<script lang='ts'>
  import { alertsStore } from "../../stores/alerts";
  import _ from 'lodash';
  import { allTasks } from "../../stores/tasks";
  import dayjs from "dayjs";
  import { clickOutside } from "../../utils";
  import type { Task } from "~shared/types";

  export let parentTask: Task; 
  export let onClose: () => void;
  
  let dateInput: string | undefined;

  $: sortedReminders = parentTask.reminders ? 
    _.cloneDeep(parentTask.reminders).sort((reminderA, reminderB) => {
      return (reminderA.date < reminderB.date) ? -1 : ((reminderA.date > reminderB.date) ? 1 : 0);
    }) : []; 

  /**
   * Add the current value in the date input to the reminder dates array
   */
  const handleAddReminderClick = () => {
    if (dateInput === undefined) {
      alertsStore.createAlert("Error", 'Invalid date. Please select a date', 2000);
      return;
    }

    if (dayjs(dateInput).isBefore(dayjs())) {
      alertsStore.createAlert('Error', 'Invalid date. Date is after the current date', 2000);
      return;
    }
    
    allTasks.addReminderToTask(parentTask.id, dateInput);
  }

  /**
   * Remove a date from the reminder dates array
   */
  const handleDeleteReminderClick = (reminderId: string) => {
    allTasks.deleteReminderFromTask(parentTask.id, reminderId);
  }
</script>

<dialog class='modal modal-open w-60 !z-50'>
  <form 
    method='dialog' 
    class='modal-box !max-w-md md:!max-w-2xl' 
    id='modal'
    use:clickOutside 
    on:outclick={onClose}
  >
    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" on:click|preventDefault={onClose}>✕</button>
    <h1 class='text-lg font-bold mb-6 text-center'>{ `${parentTask.title}:` }</h1>
    <div class='w-full flex flex-col md:flex-row mt-2'>
      <div class='flex flex-col flex-grow basis-0'>
        <h3 class='mb-2 font-bold text-gray-300'>Create New Reminder:</h3>
        <div class='flex flex-row items-center h-full justify-center'>
          <input class='bg-[#141518] p-4 rounded-md self-center flex-grow-0 focus:outline-none' type='datetime-local' bind:value={dateInput} />
          <button class='btn btn-primary btn-sm btn-circle ml-2' on:click={handleAddReminderClick}>＋</button>
        </div>
      </div>
      <div class='divider divider-vertical md:divider-horizontal flex-grow-0 flex-shrink-0'></div>
      <div class='flex flex-col flex-grow basis-0'>
        <h3 class='mb-2 font-bold text-gray-300'>Existing Reminders:</h3>
        <div class='w-full max-w-xs bg-[#141518] rounded-md h-20 overflow-y-scroll overflow-x-hidden self-center'>
          <!-- Check if there are no reminders -->
          {#if !parentTask.reminders || parentTask.reminders.length === 0}
            <p class='mx-4 my-4'>Currently Empty... <br> Add a new reminder!</p>
          {/if}

          <!-- Render each reminder (if they exist) -->
          {#each sortedReminders as reminder, i}
            <div 
              class='flex flex-row items-center w-full'
              class:first={i === 0}
              class:last={i === sortedReminders.length - 1}
            >
              <svelte:element 
                this={reminder.triggered ? 'strike' : 'p'} 
                class='px-4'
              >
                {dayjs(reminder.date).format('YYYY-MM-DD hh:mm A')}
              </svelte:element>

              <button class='btn btn-circle btn-sm flex-shrink-0 mr-2 ml-auto' on:click={() => handleDeleteReminderClick(reminder.id)}>✕</button>
            </div>

            <!-- Render a divider for every element but the last -->
            {#if i !== sortedReminders.length - 1}
              <div class='divider'></div>
            {/if}
          {/each}
        </div>
      </div>
    </div>
  </form>
</dialog>

<style>
  .first {
    margin-top: 1.5rem;
  }

  .last {
    margin-bottom: 1.5rem;
  }

  p {
    font-family: 'Poppins', sans-serif;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: none;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    @apply rounded-full;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>