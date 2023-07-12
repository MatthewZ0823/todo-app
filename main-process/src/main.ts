import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { Store } from './store';
import { Notifications } from './notifications';

const store = new Store({
  configName: 'todo-list',
  defaults: {
    todos: []
  }
});


const handleReadTodos = async () => {
  return store.get('todos');
};

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js')
    }
  });

  ipcMain.on('write-todos', (_event, todoList) => {
    store.set('todos', todoList);
  });

  ipcMain.on('send-reminder-notification', (_event, reminder) => Notifications.showReminderNotification(reminder));

  ipcMain.handle('read-todos', handleReadTodos);

  // Check if in development
  if (!app.isPackaged) { 
    mainWindow.loadURL('http://localhost:8080/');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(join(__dirname, '../../renderer-process/dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
