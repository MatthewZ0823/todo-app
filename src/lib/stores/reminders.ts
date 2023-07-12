import { derived } from "svelte/store";
import { allTasks } from "./tasks";
import { cloneDeep } from "lodash";
import type { ReminderNotification } from "../../../types";

export const reminders = derived(allTasks, ($allTasks) => {
  const reminders: ReminderNotification[] = [];

  // Filter only the tasks with reminders
  $allTasks.filter(task => {
    if (!('reminders' in task)) return false;
    if (task.reminders.length === 0) return false;
    return true;
  // Loop through the filtered tasks and push the reminders to to the reminders array
  }).forEach(task => {
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