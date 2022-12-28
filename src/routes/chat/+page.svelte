<script lang="ts">
	import Borders from '$lib/components/Borders/index.svelte';
	import Button from '$lib/components/Button/index.svelte';
	import MediaBlock from './components/MediaBlock/index.svelte';

	let affirm = 0;
	let buttonContent = 'Skip Soul';

	const skipSoul = () => {
		if (!affirm) {
			affirm++;
			buttonContent = 'Affirm?';
			return;
		}
		// do sth
	};
</script>

<div class="min-h-screen">
	<Borders needOverflowSupport isFixed={true} applyZIndex={true} />
	<div class="flex flex-col px-6 mt-8 gap-4">
		<MediaBlock />
		<MediaBlock />
	</div>
	<Button on:click={skipSoul} className="my-8 w-40 tracking-[2px]" {buttonContent} />
</div>
