<script lang="ts">
	import Borders from '$lib/components/Borders/index.svelte';
	import SoulTkn from '$lib/assets/images/icons/soultkn.svg';

	export let videoElem;
</script>

<div class="flex flex-col w-full min-w-[280px] aspect-[280/300] relative m-auto p-6">
	<Borders width="5px" height="5px" />
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<button class="flex flex-col gap-[3px]">
				{#each Array(4) as _}
					<div
						class="h-[2px] w-[20px] bg-[#ACACAC]"
						style="box-shadow: 0.3px 0.7px 0px 0.5px black;"
					/>
				{/each}
			</button>
			<div class="overflow-hidden text-ellipsis whitespace-nowrap w-40">lordmike007.eth</div>
		</div>
		<button class="rounded-full" style="box-shadow: 0.7px 0.7px 0px 1px black;">
			<img src={SoulTkn} class="w-8 aspect-square" alt="" />
		</button>
	</div>
	<div class="py-4 pb-0 h-full">
		<!-- svelte-ignore a11y-media-has-caption -->
		<video bind:this={videoElem} class="w-full h-full bg-black" />
	</div>
</div>

<style>
	video {
		transform: rotateY(180deg);
		-webkit-transform: rotateY(180deg); /* Safari and Chrome */
		-moz-transform: rotateY(180deg); /* Firefox */
	}
</style>
