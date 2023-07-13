<script lang='ts'>
  import ReminderModal from './ReminderModal.svelte';
  import type { Task } from '~shared/types';

  export let visible = true;
  export let showReminderModal = false;
  export let parentTask: Task;

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.code === 'Escape') {
      showReminderModal = false;
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />
<div class='relative flex-shrink-0 ml-1'>
  <button
    class='w-6 h-6 bg-blue-300 rounded-md flex flex-row justify-center items-center hover:animate-grow'
    style:visibility={visible ? 'visible' : 'hidden'}
    on:click={() => {showReminderModal = true}}
  >
    ⏱️
  </button>
  
  {#if (showReminderModal && visible)}
    <ReminderModal 
      parentTask={parentTask}
      onClose={() => showReminderModal = false}
    />
  {/if}
</div>
