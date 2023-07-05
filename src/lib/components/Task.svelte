<script>
  import { crossfade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  export let task;
  export let onClick;

  const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
  });
</script>

<div class='py-1 flex flex-row items-center' in:receive={{key: task.id}} out:send={{key: task.id}}>
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