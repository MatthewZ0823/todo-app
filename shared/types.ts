export interface Subtask {
  title: string;
  completed: boolean;
  /** UUIDv4 */
  id: string; 
}

export interface Reminder {
  /** Date as an ISO string */
  date: string; 
  /** If the notification for the Reminder has been triggered */
  triggered: boolean;
  /** UUIDv4 */
  id: string;
}

export interface ReminderNotification extends Reminder {
  /** Title of parent task */
  title: string;
  /** Id of parent task */
  taskId: string;
}

export interface Task extends Subtask {
  reminders?: Reminder[];
  subtasks?: Subtask[];
}

export type AlertType = 'Error' | 'Reminder';

export interface Alert {
  type: AlertType;
  message: string;
  /** Length of time to display alert, in miliseconds */
  durationMs: number;
  id: string;
  /** Any aditional payload */
  payload?: any;
}