import { writable } from "svelte/store";
import { v4 as uuidv4 } from "uuid";
import type { Alert, AlertType } from "~shared/types";

const createAlerts = () => {
  const { subscribe, update } = writable([] as Alert[]);

  const deleteAlert = (alertId: string) => {
    update(alerts => alerts.filter(alert => alert.id !== alertId));
  }

  const createAlert = (type: AlertType, message: string, durationMs: number, payload?: any) => {
    const alertId = uuidv4();

    update(alerts => {
      return [...alerts, {
        type,
        message,
        durationMs,
        id: alertId,
        payload
      }];
    });

    setTimeout(() => {
      deleteAlert(alertId);
    }, durationMs);
  };

  return {
    subscribe,
    createAlert
  }
}

export const alertsStore = createAlerts();