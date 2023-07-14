import { Notification } from 'electron';
import { ReminderNotification } from '~shared/types';
import { join } from 'path';

export class Notifications {
  static showReminderNotification(reminder: ReminderNotification) {
    new Notification({
      title: `Reminder: ${reminder.title}`,
      icon: join(__dirname, '../../../assets/app-icon.png')
    }).show()
  }
}
