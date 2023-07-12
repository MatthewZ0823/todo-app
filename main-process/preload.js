const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  writeTodos: (todo) => ipcRenderer.send('write-todos', todo),
  sendReminderNotification: (reminder) => ipcRenderer.send('send-reminder-notification', reminder),
  readTodos: () => ipcRenderer.invoke('read-todos')
});