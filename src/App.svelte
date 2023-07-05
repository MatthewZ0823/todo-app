<script>
  import { flip } from 'svelte/animate';
  import NewTaskInput from "./lib/components/NewTaskInput.svelte";
  import Task from "./lib/components/Task.svelte";
  import completeTaskAudioFile from './assets/audio/complete-task.wav';
  import { allTasks } from "./lib/stores";

  const completeTaskAudio = new Audio(completeTaskAudioFile);

  $: completedTasks = $allTasks.filter(task => task.completed);
  $: incompleteTasks = $allTasks.filter(task => !task.completed);

  const handleCompleteClick = (taskId) => {
    allTasks.update((tasks) => {
      return tasks.map((task) => {
        if (task.id === taskId) {
          task.completed = !task.completed;
          
          if (task.completed) completeTaskAudio.play();
        }
        return task;
      });
    });
  };

  const handleDeleteClick = (taskId) => {
    allTasks.update((tasks) => {
      return tasks.filter((task) => task.id !== taskId);
    });
  }
</script>

<h1 class='text-4xl text-slate-100 font-bold'> TODO List: </h1>
<hr class='my-4 bg-orange-400 h-1 w-20 border-none'/>

<NewTaskInput />

{#each incompleteTasks as task (task.id)}
  <div animate:flip>
    <Task
      task={task}
      onCompleteClick={handleCompleteClick}
      onDeleteClick={handleDeleteClick}
    />
  </div>
{/each}

<h2 class='mt-2 text-xl text-slate-300 font-bold'> Completed Tasks: </h2>

{#each completedTasks as task (task.id)}
  <div animate:flip>
    <Task
      task={task}
      onCompleteClick={handleCompleteClick}
      onDeleteClick={handleDeleteClick}
    />
  </div>
{/each}
