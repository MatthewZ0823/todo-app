<script>
  import Task from "./lib/Task.svelte";
  import { allTasks } from "./lib/stores";

  $: completedTasks = $allTasks.filter(task => task.completed);
  $: incompleteTasks = $allTasks.filter(task => !task.completed);

  const handleClick = (taskId) => {
    allTasks.update((tasks) => {
      return tasks.map((task) => {
        if (task.id === taskId) {
          task.completed = !task.completed;
        }
        return task;
      });
    });
  };
</script>

<h1 class='text-4xl text-slate-100 font-bold'> TODO List: </h1>
<hr class='my-4 bg-orange-400 h-1 w-20 border-none'/>

{#each incompleteTasks as task (task.id)}
  <Task
    task={task}
    onClick={handleClick}
  />
{/each}

<h2 class='mt-2 text-xl text-slate-300 font-bold'> Completed Tasks: </h2>

{#each completedTasks as task (task.id)}
  <Task
    task={task}
    onClick={handleClick}
  />
{/each}
