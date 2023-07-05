<script>
  import { crossfade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import xButtonImage from '../../assets/imgs/x-symbol-button.svg';

  export let task;
  export let onCompleteClick;
  export let onDeleteClick;

  let hovering = false;

  const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, _params) {
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

<div 
  class='py-1 flex flex-row items-center' 
  in:receive={{key: task.id}} 
  out:send={{key: task.id}}
  on:mouseenter={() => hovering = true}
  on:mouseleave={() => hovering = false}
>
  <button class='mx-2 w-6 h-6 bg-transparent border-2 border-blue-300 rounded-md' class:selected={task.completed} on:click={() => onCompleteClick(task.id)}/>
  <h1 class='text-slate-300 text-lg'>{task.title}</h1>
  {#if hovering}
    <button 
      class='ml-4 w-6 h-6 bg-red-500 rounded-md flex flex-row justify-center items-center hover:animate-wiggle'
      on:click={() => onDeleteClick(task.id)}
    >
      <img class='w-4 h-4' src={xButtonImage} alt='Trash Button' />
    </button>
  {/if}
</div>

<style>
  h1 {
    font-family: 'Poppins', sans-serif;
  }
  
  .selected {
    @apply bg-blue-300;
  }
</style>