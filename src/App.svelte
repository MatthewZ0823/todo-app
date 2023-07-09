<script>
  import { flip } from 'svelte/animate';
  import NewTaskInput from "./lib/components/NewTaskInput.svelte";
  import Task from "./lib/components/Task.svelte";
  import { allTasks } from "./lib/stores/tasks";
  import { reminders } from './lib/stores/reminders';
  import { onMount } from 'svelte';
  import dayjs from 'dayjs';

  let loaded = false;
  let reminderIntervalId;

  onMount(async () => {
    // @ts-ignore
    allTasks.setFromSaved(await window.electronAPI.readTodos());
    loaded = true;

    reminderIntervalId = setInterval(() => {
      $reminders.forEach(reminder => {
        if (dayjs(reminder.date).isBefore(dayjs()) && !reminder.triggered) {
          // @ts-ignore
          window.electronAPI.sendReminderNotification(reminder);
          allTasks.toggleReminderTrigger(reminder.taskId, reminder.id);
        }
      });
    }, 1000);
  });

  $: completedTasks = $allTasks.filter(task => task.completed);
  $: incompleteTasks = $allTasks.filter(task => !task.completed);

  $: try {
    // @ts-ignore
    if (loaded) window.electronAPI.writeTodos($allTasks);
  } catch (e) {   
    console.error('Unable to write todo list to file \n' + e);
  }
</script>

<h1 class='text-4xl text-slate-100 font-bold'> TODO List: </h1>
<hr class='my-4 bg-orange-400 h-1 w-20 border-none'/>

<NewTaskInput />

{#each incompleteTasks as task (task.id)}
  <div animate:flip>
    <Task
      task={task}
    />
  </div>
{/each}

<h2 class='mt-2 text-xl text-slate-300 font-bold'> Completed Tasks: </h2>

{#each completedTasks as task (task.id)}
  <div animate:flip>
    <Task
      task={task}
    />
  </div>
{/each}
