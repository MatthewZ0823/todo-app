<script lang='ts'>
  import errorIcon from "../../../assets/imgs/error-icon.svg";
  import { fade } from "svelte/transition";

  export let message: string;
</script>

<div class='w-fit max-w-[100vh] bg-red-400 flex flex-row items-center p-4 rounded-lg z-50' out:fade={{ duration: 100 }}>
  <img src={errorIcon} alt='error icon'>
  <p class='ml-4 text-black break-words'>{ message }</p>
</div>