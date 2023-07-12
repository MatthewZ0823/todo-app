import { Notification } from 'electron';
import { ReminderNotification } from '~shared/types';

export class Notifications {
  static showReminderNotification(reminder: ReminderNotification) {
    new Notification({
      title: reminder.title
    }).show()
  }
}
