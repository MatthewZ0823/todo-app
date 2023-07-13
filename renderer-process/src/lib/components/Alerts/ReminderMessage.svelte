<script lang='ts'>
  import { fade } from "svelte/transition";
  import type { Alert } from "~shared/types";

  export let alert: Alert;
  export let onClick: (taskId: string) => void;
</script>

<div class="alert !border-lime-300 !border-2" out:fade>
  <span class="shrink-0 w-6 h-6">⏰</span>
  <div>
    <h3 class="font-bold">{ alert.message }</h3>
    <p class='text-xs'>You have a reminder. Click 'See' to view the reminder</p>
  </div>
  <button class="btn btn-sm" on:click={() => onClick(alert.payload.reminder.taskId)}>See</button>
</div>