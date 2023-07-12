import { writable } from "svelte/store";
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import dayjs from "dayjs";
import completeTaskAudioFile from '../../assets/audio/complete-task.wav';
import type { Task } from '../../../types';

const completeTaskAudio = new Audio(completeTaskAudioFile);

const createAllTasks = () => {
  const store = writable([] as Task[]);
  const { subscribe, set, update } = store;
  
  const createNewTask = (title: string) => {
    update((tasks) => {
      return [...tasks, {
        title,
        completed: false,
        subtasks: [],
        id: uuidv4()
      }];
    });
  };

  const addReminderToTask = (taskId: string, date: string) => {
    if (!uuidValidate(taskId)) throw new Error('Invalid Task ID');
    
    update(tasks => {
      return tasks.map(t => {
        if (t.id === taskId) {
          if ('reminders' in t) {
            // @ts-ignore be like me, just ignore errors
            t.reminders.push({
              date: dayjs(date).toDate().toISOString(),
              triggered: false,
              id: uuidv4()
            });
          } else {
            t.reminders = [{
              date: dayjs(date).toDate().toISOString(),
              triggered: false,
              id: uuidv4()
            }];
          }
        }
        return t;
      });
    });
  };

  const deleteReminderFromTask = (taskId: string, reminderId: string) => {
    if (!uuidValidate(taskId)) throw new Error('Invalid Task ID');
    if (!uuidValidate(reminderId)) throw new Error('Invalid Reminder ID');

    update(tasks => {
      return tasks.map(t => {
        if (t.id === taskId) {
          const index = t.reminders.findIndex(reminder => reminder.id === reminderId);
          if (index > -1) { // only splice array when item is found
            t.reminders.splice(index, 1); // 2nd parameter means remove one item only
          }
        }
        return t;
      });
    });
  };

  const toggleTaskCompletion = (taskId: string) => {
    if (!uuidValidate(taskId)) throw new Error('Invalid Task ID');

    update((tasks) => {
      return tasks.map(t => {
        if (t.id === taskId) {
          t.completed = !t.completed;
          if (t.completed) completeTaskAudio.play();
        }
        return t;
      });
    });
  };

  const deleteTask = (taskId: string) => {
    if (!uuidValidate(taskId)) throw new Error('Invalid Task ID');

    update((tasks) => {
      return tasks.filter(({ id }) => id !== taskId);
    });
  };

  const createNewSubtask = (taskId: string) => {
    if (!uuidValidate(taskId)) throw new Error('Invalid Task ID');

    update((tasks) => {
      return tasks.map(t => {
        if (t.id === taskId) {
          t.subtasks.push({
            title: 'New Subtask',
            completed: false,
            id: uuidv4()
          });
        }
        return t;
      });
    });
  };

  const toggleSubtaskCompletion = (parentTaskId: string, subtaskId: string) => {
    if (!uuidValidate(parentTaskId)) throw new Error('Invalid Parent Task ID');
    if (!uuidValidate(subtaskId)) throw new Error('Invalid Subtask ID');

    update((parentTasks) => {
      return parentTasks.map(parentTask => {
        // First find the right parent task
        if (parentTask.id === parentTaskId) {
          parentTask.subtasks.forEach(t => {
            // Then find the right subtask in that parent
            if (t.id === subtaskId) {
              t.completed = !t.completed;
              if (t.completed) completeTaskAudio.play();
            }
          });
        }

        return parentTask;
      });
    });
  };

  const deleteSubtask = (parentTaskId: string, subtaskId: string) => {
    if (!uuidValidate(parentTaskId)) throw new Error('Invalid Parent Task ID');
    if (!uuidValidate(subtaskId)) throw new Error('Invalid Subtask ID');

    update((parentTasks) => {
      return parentTasks.map(parentTask => {
        // First find the right parent task
        if (parentTask.id === parentTaskId) {
          // Then filter out the deleted task
          parentTask.subtasks = parentTask.subtasks.filter(t => t.id !== subtaskId);
        }

        return parentTask;
      });
    });
  };

  const renameTask = (taskId: string, title: string) => {
    if (!uuidValidate(taskId)) throw new Error('Invalid Task ID');

    update((tasks) => {
      return tasks.map(t => {
        if (t.id === taskId) {
          t.title = title;
        }

        return t;
      });
    });
  };

  const toggleReminderTrigger = (taskId: string, reminderId: string) => {
    if (!uuidValidate(taskId)) throw new Error('Invalid Task ID');

    update((tasks) => {
      return tasks.map(t => {
        if (t.id === taskId) {
          t.reminders.forEach(reminder => {
            if (reminder.id === reminderId) {
              reminder.triggered = !reminder.triggered;
            }
          });
        }

        return t;
      });
    });
  };

  return {
    subscribe,
    setFromSaved: (val) => set(val),
    createNewTask,
    createNewSubtask,
    addReminderToTask,
    deleteReminderFromTask,
    toggleTaskCompletion,
    toggleSubtaskCompletion,
    deleteTask,
    deleteSubtask,
    renameTask,
    toggleReminderTrigger
  }
}

export const allTasks = createAllTasks();