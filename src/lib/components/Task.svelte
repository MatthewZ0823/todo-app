<script>
  import { crossfade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { allTasks } from "../stores.js";
  import xButtonImage from '../../assets/imgs/x-symbol-button.svg';
  import plusButtonImage from '../../assets/imgs/gray-plus-symbol-button.svg';
  import completeTaskAudioFile from '../../assets/audio/complete-task.wav';
  import Subtask from './Subtask.svelte';
  import { v4 as uuidv4 } from 'uuid';

  export let task;

  let hovering = false;

  const completeTaskAudio = new Audio(completeTaskAudioFile);

  /**
   * Toggle the completed flag on the task with the same ID
   */
  const handleCompleteClick = () => {
    allTasks.update((tasks) => {
      return tasks.map(t => {
        if (t.id === task.id) {
          task.completed = !task.completed;
          if (task.completed) completeTaskAudio.play();
        }
        return t;
      });
    });
  };

  /**
   * Delete the task with the same ID
   */
  const handleDeleteClick = () => {
    allTasks.update((tasks) => {
      return tasks.filter(({ id }) => id !== task.id);
    });
  };

  /**
   * Create a new subtask under this task
   */
  const handleNewSubtaskClick = () => {
    allTasks.update((tasks) => {
      return tasks.map(t => {
        if (t.id === task.id) {
          t.subtasks.push({
            title: 'New Subtask',
            completed: false,
            subtasks: [],
            id: uuidv4()
          });
        }

        return t;
      });
    });
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
  class='flex flex-col'
  in:receive={{key: task.id}} 
  out:send={{key: task.id}}
>
  <div 
    class='py-1 flex flex-row items-center w-fit' 
    on:mouseenter={() => hovering = true}
    on:mouseleave={() => hovering = false}
  >
    <button class='mx-2 w-6 h-6 bg-transparent border-2 border-blue-300 rounded-md hover:animate-glow' class:selected={task.completed} on:click={handleCompleteClick}/>
    <h1 class='text-slate-300 text-lg'>{task.title}</h1>
    <button 
      class='ml-12 w-6 h-6 bg-orange-400 rounded-md flex flex-row justify-center items-center hover:animate-grow'
      style:visibility={(hovering && !task.completed) ? 'visible' : 'hidden'}
      on:click={handleNewSubtaskClick}
    >
      <img class='w-4 h-4' src={plusButtonImage} alt='New Subtask Button' />
    </button>
    <button 
      class='mx-1 w-6 h-6 bg-red-600 rounded-md flex flex-row justify-center items-center hover:animate-wiggle'
      style:visibility={hovering ? 'visible' : 'hidden'}
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
  h1 {
    font-family: 'Poppins', sans-serif;
  }
  
  .selected {
    @apply bg-blue-300;
  }
</style>