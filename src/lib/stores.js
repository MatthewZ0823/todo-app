import { writable } from "svelte/store";
import { v4 as uuidv4 } from 'uuid';

export const allTasks = writable([
  {
    title: 'Example Task A',
    completed: false,
    id: uuidv4()
  },
  {
    title: 'Example Task B',
    completed: true,
    id: uuidv4()
  }
]);   