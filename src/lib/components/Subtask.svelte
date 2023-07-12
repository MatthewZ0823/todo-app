<script lang='ts'>
  import { allTasks } from "../stores/tasks";
  import xButtonImage from '../../assets/imgs/x-symbol-button.svg';
  import type { Subtask } from "../../../types";
  
  export let subtask: Subtask;
  export let parentId: string;

  let hovering = false;
  let editing = false;

  /**
   * Toggle the completed flag on the correct subtask
   */
  const handleCompleteClick = () => {
    allTasks.toggleSubtaskCompletion(parentId, subtask.id); 
  };

  /**
   * Delete the subtask with the same id and parent
   */
  const handleDeleteClick = () => {
    allTasks.deleteSubtask(parentId, subtask.id);
  };

  /**
   * If the enter key pressed in the text input, turn editing mode off
   */
  const handleKeyDown = ({ key }) => {
    if (key === 'Enter') {
      editing = false;
    }
  };

  /**
   * Focus the input element on creation
   */ 
  const init = (el) => {
    el.focus();
  };
</script>

<div 
    class='pl-10 py-1 flex flex-row items-center w-full' 
    on:mouseenter={() => hovering = true}
    on:mouseleave={() => hovering = false}
  >
    <button class='flex-shrink-0 mx-1.5 w-5 h-5 bg-transparent border-2 border-cyan-600 rounded-md hover:animate-glow' class:selected={subtask.completed} on:click={handleCompleteClick}/>

    {#if editing}
      <input 
        class='flex-grow text-slate-400 text-md bg-transparent focus:outline-none border-b-2 border-b-red-400 border-dotted break-normal' 
        type='text' 
        bind:value={subtask.title}
        on:keydown={handleKeyDown}
        use:init
      />
    {:else}
      <h2 class='text-slate-400 text-md bg-transparent flex-grow break-normal'>{subtask.title}</h2>
    {/if}

    <button 
      class='flex-shrink-0 ml-12 w-6 h-6 bg-blue-300 rounded-md flex flex-row justify-center items-center hover:animate-grow'
      style:visibility={(hovering || editing) ? 'visible' : 'hidden'}
      on:click={() => editing = !editing}
    >
      ✏️
    </button>

    <button 
      class='flex-shrink-0 mx-1 w-6 h-6 bg-red-600 rounded-md flex flex-row justify-center items-center hover:animate-wiggle'
      style:visibility={(hovering || editing) ? 'visible' : 'hidden'}
      on:click={handleDeleteClick}
    >
      <img class='w-4 h-4' src={xButtonImage} alt='Trash Button' />
    </button>
  </div>

<style>
  h2, input {
    font-family: 'Poppins', sans-serif;
  }

  .selected {
    @apply bg-cyan-600;
  }
</style>