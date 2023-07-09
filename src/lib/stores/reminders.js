import { derived } from "svelte/store";
import { allTasks } from "./tasks";
import { cloneDeep } from "lodash";

export const reminders = derived(allTasks, ($allTasks) => {
  let tasks = cloneDeep($allTasks);
  const reminders = [];

  // Filter only the tasks with reminders
  tasks = tasks.filter(task => {
    if (!('reminders' in task)) return false;
    if (task.reminders.length === 0) return false;
    return true;
  });

  tasks.forEach(task => {
    task.reminders.forEach(reminder => [
      reminders.push({
        title: task.title,
        taskId: task.id,
        ...reminder
      })
    ]);
  });

  return reminders;
});