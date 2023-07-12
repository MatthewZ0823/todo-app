import { Notification } from 'electron';

export class Notifications {
  static showReminderNotification(reminder) {
    new Notification({
      title: reminder.title
    }).show()
  }
}
