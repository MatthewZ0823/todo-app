const { Notification } = require('electron')

class Notifications {
  static showReminderNotification(reminder) {
    new Notification({
      title: reminder.title
    }).show()
  }
}

module.exports = Notifications;