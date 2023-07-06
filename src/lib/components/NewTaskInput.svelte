<script>
  import { tweened } from 'svelte/motion';
  import { allTasks } from '../stores';
  import { getTextWidth, getCanvasFont, clip } from '../utils.js';
  import plusButtonImage from '../../assets/imgs/plus-symbol-button.svg';
  import { v4 as uuidv4 } from 'uuid';

  let input = '';
  let inputWidth;
  let inputEl;
  let underlineOpacity = tweened(0.5, { duration: 75 });
  let underlineWidth = tweened(0, { duration: 100 });
  let underlineEl;

  const onClick = () => {
    if (input === '') return;

    allTasks.update((tasks) => {
      return [...tasks, {
        title: input,
        completed: false,
        subtasks: [],
        id: uuidv4()
      }];
    });

    input = '';
  }

  const onKeyDown = ({ key }) => {
    if (key === 'Enter') onClick();
  }

  $: if (underlineEl) underlineEl.style.opacity = $underlineOpacity;
  $: if (underlineEl) underlineEl.style.width = `${clip($underlineWidth + 15, 40, inputWidth)}px`;
  $: if (underlineEl) underlineWidth.set(getTextWidth(input, getCanvasFont(inputEl)));
</script>

<div class='flex flex-row items-center'> 
  <button 
    class='mx-2 w-6 h-6'
    on:click={onClick}
  >
    <span class='flex justify-center'>
      <img src={plusButtonImage} alt='Plus Button' class='w-4 h-4'>
    </span>   
  </button>
  <div 
    bind:offsetWidth={inputWidth}
    class='flex flex-col w-full'
  >
    <input 
      class='bg-transparent text-slate-300 text-lg focus:outline-none w-full'
      bind:value={input}
      bind:this={inputEl}
      on:focus={() => underlineOpacity.set(1)}
      on:blur={() => underlineOpacity.set(0.5)}
      on:keydown={onKeyDown}
    />
    <hr class='bg-orange-400 h-px border-none' bind:this={underlineEl}/>
  </div>
</div>

<style>
  input {
    font-family: 'Poppins', sans-serif;
  }

  hr {
    opacity: 0.5;
  }
</style>