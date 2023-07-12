import { contextBridge, ipcRenderer } from 'electron';
import { Task, ReminderNotification } from '~shared/types';

contextBridge.exposeInMainWorld('electronAPI', {
  writeTodos: (todos: Task[]) => ipcRenderer.send('write-todos', todos),
  sendReminderNotification: (reminder: ReminderNotification) => ipcRenderer.send('send-reminder-notification', reminder),
  readTodos: () => ipcRenderer.invoke('read-todos')
});