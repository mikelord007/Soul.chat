<script lang="ts">
	import Borders from '$lib/components/Borders/index.svelte';

	export let className = '';
	export let disabled = false;
</script>

<button
	{disabled}
	on:click
	class={[className, 'px-6 py-4 m-auto block relative xl:text-xl'].join(' ')}
>
	{#if disabled}
		<div class="absolute inset-0 opacity-60 bg-[#4c4c4c]" />
	{/if}
	<Borders width="0.2rem" height="0.2rem" />
	<slot />
</button>
