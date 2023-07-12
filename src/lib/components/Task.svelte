<script lang='ts'>
  import { crossfade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { allTasks } from "../stores/tasks";
  import xButtonImage from '../../assets/imgs/x-symbol-button.svg';
  import Subtask from './Subtask.svelte';
  import ReminderButton from './ReminderButton.svelte';
  import type { Task } from '../../../types';

  export let task: Task;

  let hovering = false;
  let editing = false;
  let showReminderModal = false;

  /**
   * Toggle the completed flag on the task with the same ID
   */
  const handleCompleteClick = () => {
    allTasks.toggleTaskCompletion(task.id);
  };

  /**
   * Delete the task with the same ID
   */
  const handleDeleteClick = () => {
    allTasks.deleteTask(task.id);
  };

  /**
   * Create a new subtask under this task
   */
  const handleNewSubtaskClick = () => {
    allTasks.createNewSubtask(task.id);
  };

  /**
   * If the enter key pressed in the text input, turn editing mode off
   */
  const handleKeyDown = ({ key }) => {
    if (key === 'Enter') {
      editing = false;
    }
  };

  const handleInputChange = () => {
    allTasks.renameTask(task.id, task.title);
  }
  
  /**
   * Focus the input element on creation
   */
  const init = (el: HTMLInputElement) => {
    el.focus();
  };

  const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, _params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
  });
</script>

<div
  class='py-1 flex flex-col hover:bg-[#202021] hover:rounded-md hover:px-2'
  in:receive={{key: task.id}} 
  out:send={{key: task.id}}
>
  <div 
    class='flex flex-row items-center w-full' 
    on:mouseenter={() => hovering = true}
    on:mouseleave={() => hovering = false}
  >
    <button class='flex-shrink-0 mx-2 w-6 h-6 bg-transparent border-2 border-blue-300 rounded-md hover:animate-glow' class:selected={task.completed} on:click={handleCompleteClick}/>

    {#if editing}
      <input 
          class='flex-grow text-slate-300 text-lg bg-transparent focus:outline-none border-b-2 border-b-red-400 border-dotted break-normal' 
          type='text' 
          bind:value={task.title}
          on:keydown={handleKeyDown}
          on:change={handleInputChange}
          use:init
        />
    {:else}
      <h1 class='flex-grow text-slate-300 text-lg'>{task.title}</h1>
    {/if}

    <button 
      class='flex-shrink-0 ml-12 w-6 h-6 bg-blue-300 rounded-md flex flex-row justify-center items-center hover:animate-grow'
      style:visibility={((hovering || editing || showReminderModal) && !task.completed) ? 'visible' : 'hidden'}
      on:click={handleNewSubtaskClick}
    >
      ➕
    </button>

    <ReminderButton 
      visible={(hovering || editing || showReminderModal) && !task.completed}
      parentTask={task}
      bind:showReminderModal
    />

    <button 
      class='flex-shrink-0 ml-1 w-6 h-6 bg-blue-300 rounded-md flex flex-row justify-center items-center hover:animate-grow'
      style:visibility={((hovering || editing || showReminderModal) && !task.completed) ? 'visible' : 'hidden'}
      on:click={() => editing = !editing}
    >
      ✏️
    </button>

    <button 
      class='flex-shrink-0 mx-1 w-6 h-6 bg-red-600 rounded-md flex flex-row justify-center items-center hover:animate-wiggle'
      style:visibility={(hovering || editing || showReminderModal) ? 'visible' : 'hidden'}
      on:click={handleDeleteClick}
    >
      <img class='w-4 h-4' src={xButtonImage} alt='Trash Button' />
    </button>
  </div>

  {#each (task.subtasks || []) as subtask}
    <Subtask 
      parentId={task.id}
      subtask={subtask}
    />
  {/each}
</div>

<style>
  input, h1 {
    font-family: 'Poppins', sans-serif;
  }
  
  .selected {
    @apply bg-blue-300;
  }
</style>