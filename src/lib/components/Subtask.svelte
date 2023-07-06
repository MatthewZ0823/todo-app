<script>
  import { allTasks } from "../stores.js";
  import xButtonImage from '../../assets/imgs/x-symbol-button.svg';
  import completeTaskAudioFile from '../../assets/audio/complete-task.wav';

  export let subtask;
  export let parentId;

  let hovering = false;

  const completeTaskAudio = new Audio(completeTaskAudioFile);

  /**
   * Toggle the completed flag on the correct subtask
   */
  const handleCompleteClick = () => {
    allTasks.update((parentTasks) => {
      return parentTasks.map(parentTask => {
        // First find the right parent task
        if (parentTask.id === parentId) {
          parentTask.subtasks.forEach(t => {
            // Then find the right subtask in that parent
            if (t.id === subtask.id) {
              t.completed = !t.completed;
              if (t.completed) completeTaskAudio.play();
            }
          });
        }

        return parentTask;
      });
    });
  }

  /**
   * Delete the subtask with the same id and parent
   */
  const handleDeleteClick = () => {
    allTasks.update((parentTasks) => {
      return parentTasks.map(parentTask => {
        // First find the right parent task
        if (parentTask.id === parentId) {
          // Then filter out the deleted task
          parentTask.subtasks = parentTask.subtasks.filter(t => t.id !== subtask.id);
        }

        return parentTask;
      });
    });
  }
  
</script>

<div 
    class='ml-10 py-1 flex flex-row items-center w-fit' 
    on:mouseenter={() => hovering = true}
    on:mouseleave={() => hovering = false}
  >
    <button class='mx-1.5 w-5 h-5 bg-transparent border-2 border-cyan-600 rounded-md hover:animate-glow' class:selected={subtask.completed} on:click={handleCompleteClick}/>
    <input class='text-slate-400 text-md bg-transparent' type='text' bind:value={subtask.title}/>
    <button 
      class='ml-12 w-6 h-6 bg-red-600 rounded-md flex flex-row justify-center items-center hover:animate-wiggle'
      style:visibility={hovering ? 'visible' : 'hidden'}
      on:click={handleDeleteClick}
    >
      <img class='w-4 h-4' src={xButtonImage} alt='Trash Button' />
    </button>

  </div>

<style>
  input {
    font-family: 'Poppins', sans-serif;
  }

  .selected {
    @apply bg-cyan-600;
  }
</style>