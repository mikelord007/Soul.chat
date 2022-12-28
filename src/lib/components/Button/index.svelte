<script lang="ts">
	import Borders from '$lib/components/Borders/index.svelte';

	export let className = '';
	export let buttonContent: string;
</script>

<button on:click class={['px-6 py-4 m-auto block relative ', className].join('')}>
	<Borders width="0.2rem" height="0.2rem" />
	{buttonContent}
</button>
