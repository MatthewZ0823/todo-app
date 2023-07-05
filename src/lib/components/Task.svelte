<script>
  export let task;
  export let onClick;
</script>

<div class='py-1 flex flex-row items-center'>
  <button class='mx-2 w-6 h-6 bg-transparent border-2 border-blue-300 rounded-md' class:selected={task.completed} on:click={() => onClick(task.id)}/>
  <h1 class='text-slate-300 text-lg'>{task.title}</h1>
</div>

<style>
  h1 {
    font-family: 'Poppins', sans-serif;
  }
  
  .selected {
    @apply bg-blue-300;
  }
</style>