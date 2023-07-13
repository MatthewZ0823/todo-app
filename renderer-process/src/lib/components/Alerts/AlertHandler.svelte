<script lang='ts'>
  import { alertsStore } from "../../stores/alerts";
  import { allTasks } from "../../stores/tasks";
  import ErrorMessage from "./ErrorMessage.svelte";
  import ReminderMessage from "./ReminderMessage.svelte";
  import ReminderModal from "../Reminders/ReminderModal.svelte";

  let showModal = false;
  let modalTaskId: string;
  let hiddenAlerts = [] as string[];
  
  const handleViewReminderClick = (taskId: string, alertId: string) => {
    showModal = true;
    modalTaskId = taskId;
    hiddenAlerts = [...hiddenAlerts, alertId];
  };
</script>

<div class='toast !items-end z-[100]'>
  {#each $alertsStore as alert (alert.id)}
    {#if alert.type === 'Error'}
      <ErrorMessage 
        message={alert.message}
      />
    {:else if (alert.type === 'Reminder' && !hiddenAlerts.includes(alert.id))}
      <ReminderMessage
        alert={alert}
        onClick={(taskId) => handleViewReminderClick(taskId, alert.id)}
      />
    {/if}
  {/each}
</div>

{#if showModal}
  <ReminderModal
    parentTask={$allTasks.find(task => task.id === modalTaskId)}
    onClose={() => showModal = false} 
  />
{/if}