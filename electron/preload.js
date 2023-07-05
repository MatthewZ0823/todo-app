const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  writeTodos: (todo) => ipcRenderer.send('write-todos', todo),
  readTodos: () => ipcRenderer.invoke('read-todos')
});