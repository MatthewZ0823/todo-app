import { writable } from "svelte/store";
import { v4 as uuidv4 } from 'uuid';
import dayjs from "dayjs";
import completeTaskAudioFile from '../assets/audio/complete-task.wav';

const completeTaskAudio = new Audio(completeTaskAudioFile);

const createAllTasks = () => {
  const { subscribe, set, update } = writable([]);
  
  const createNewTask = (title) => {
    update((tasks) => {
      return [...tasks, {
        title,
        completed: false,
        subtasks: [],
        id: uuidv4()
      }];
    });
  };

  const addReminderToTask = (taskId, date) => {
    update(tasks => {
      return tasks.map(t => {
        if (t.id === taskId) {
          if ('reminderDates' in t) {
            // @ts-ignore be like me, just ignore errors
            t.reminderDates.push(dayjs(date).toDate());
          } else {
            t.reminderDates = [dayjs(date).toDate()];
          }
        }
        return t;
      });
    });
  };

  const deleteReminderFromTask = (taskId, date) => {
    update(tasks => {
      return tasks.map(t => {
        if (t.id === taskId) {
          const index = t.reminderDates.indexOf(date);
          if (index > -1) { // only splice array when item is found
            t.reminderDates.splice(index, 1); // 2nd parameter means remove one item only
          }
        }
        return t;
      });
    });
  };

  const toggleTaskCompletion = (taskId) => {
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

  const deleteTask = (taskId) => {
    update((tasks) => {
      return tasks.filter(({ id }) => id !== taskId);
    });
  };

  const createNewSubtask = (taskId) => {
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

  const toggleSubtaskCompletion = (parentTaskId, subtaskId) => {
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

  const deleteSubtask = (parentTaskId, subtaskId) => {
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

  const renameTask = (taskId, title) => {
    update((tasks) => {
      return tasks.map(t => {
        if (t.id === taskId) {
          t.title = title;
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
    renameTask
  }
}

export const allTasks = createAllTasks();