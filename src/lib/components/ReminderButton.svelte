<script>
  import { allTasks } from "../stores";
  import { clickOutside } from "../utils";
  import dayjs from "dayjs";

  export let visible = true;
  export let parentTask;
  export let showReminderModal = false;

  let dateInput;

  /**
   * Add the current value in the date input to the reminder dates array
   */
  const handleAddReminderClick = () => {
    if (dateInput === undefined) return;

    allTasks.update(tasks => {
      return tasks.map(t => {
        if (t.id === parentTask.id) {
          if ('reminderDates' in t) {
            // @ts-ignore be like me, just ignore errors
            t.reminderDates.push(dayjs(dateInput).toDate());
          } else {
            t.reminderDates = [dayjs(dateInput).toDate()];
          }
        }
        return t;
      });
    });
  }

  /**
   * Remove a date from the reminder dates array
   */
  const handleDeleteReminderClick = (deletedDate) => {
    allTasks.update(tasks => {
      return tasks.map(t => {
        if (t.id === parentTask.id) {
          const index = t.reminderDates.indexOf(deletedDate);
          if (index > -1) { // only splice array when item is found
            t.reminderDates.splice(index, 1); // 2nd parameter means remove one item only
          }
        }
        return t;
      });
    });
  }
  
  const handleKeydown = (event) => {
    if (event.code === 'Escape') {
      showReminderModal = false;
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />
<div 
  class='relative flex-shrink-0 ml-1' 
  use:clickOutside 
  on:outclick={() => { showReminderModal = false }}
>
  <button
    class='w-6 h-6 bg-blue-300 rounded-md flex flex-row justify-center items-center hover:animate-grow'
    style:visibility={visible ? 'visible' : 'hidden'}
    on:click={() => {showReminderModal = true}}
  >
    ⏱️
  </button>
  
  {#if (showReminderModal && visible)}
    <dialog class='modal modal-open w-60'>
      <form method='dialog' class='modal-box !max-w-2xl' id='modal'>
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" on:click={() => showReminderModal = false}>✕</button>
        <div class='w-full flex flex-col md:flex-row mt-2'>
          <div class='flex flex-col flex-grow basis-0'>
            <h3 class='mb-2 font-bold'>Create New Reminder:</h3>
            <div class='flex flex-row items-center h-full justify-center'>
              <input class='bg-[#141518] p-4 rounded-md self-center flex-grow-0 focus:outline-none' type='datetime-local' bind:value={dateInput} />
              <button class='btn btn-primary btn-sm btn-circle ml-2' on:click={handleAddReminderClick}>＋</button>
            </div>
          </div>
          <div class='divider divider-vertical md:divider-horizontal flex-grow-0 flex-shrink-0'></div>
          <div class='flex flex-col flex-grow basis-0'>
            <h3 class='mb-2 font-bold'>Existing Reminders:</h3>
            <div class='bg-[#141518] rounded-md h-20 overflow-y-scroll overflow-x-hidden self-center'>
              <!-- Check if there are no reminder dates -->
              {#if !parentTask.reminderDates || parentTask.reminderDates.length === 0}
                <p class='mx-4 my-4'>Currently Empty... <br> ← Add a new reminder!</p>
              {/if}

              <!-- Render each reminder (if they exist) -->
              {#each (parentTask.reminderDates || []) as date, i}
                <div 
                  class='flex flex-row items-center'
                  class:first={i === 0}
                  class:last={i === parentTask.reminderDates.length - 1}
                >
                  <p class='px-4 flex-grow'>
                    {dayjs(date).format('[⏰] YYYY-MM-DD hh:mm A')}
                  </p>
                  <button class='btn btn-circle btn-sm flex-shrink-0 mr-6' on:click={() => handleDeleteReminderClick(date)}>✕</button>
                </div>

                <!-- Render a divider for every element but the last -->
                {#if i !== parentTask.reminderDates.length - 1}
                  <div class='divider'></div>
                {/if}
              {/each}
            </div>
          </div>
        </div>
      </form>
    </dialog>
  {/if}
</div>

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
