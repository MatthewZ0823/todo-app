const { Notification } = require('electron')

class Notifications {
  static showReminderNotification(reminder) {
    new Notification({
      title: reminder.title,
      body: reminder.date
    }).show()
  }
}

module.exports = Notifications;