<script lang="ts">
	import Borders from '$lib/components/Borders/index.svelte';
	import SoulTkn from '$lib/assets/images/icons/soultkn.svg';
	import ReapSoul from '$lib/assets/images/icons/reapSoul.svg';
	import Button from '$lib/components/Button/index.svelte';
	import SoulInfoModal from '../SoulInfoModal/index.svelte';
	import { deviceSize } from '$lib/stores';

	export let videoElem;
	export let soulsEarned = 20;
	export let ownVid = true;
	export let findingSoul = ownVid ? false : true;
	const borderWidth = $deviceSize.size === '2xl' ? '7px' : '5px';
	const borderHeight = $deviceSize.size === '2xl' ? '7px' : '5px';
	let toggleInfoModal = false;
</script>

<div
	class="flex flex-col w-full xl:w-[41rem] min-w-[280px] aspect-[280/300] xl:aspect-[280/215] relative m-auto xl:m-0 p-6 xl:p-[2.3rem]"
>
	<Borders width={borderWidth} height={borderHeight} />
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<button class="flex flex-col gap-[3px] xl:hidden">
				{#each Array(4) as _}
					<div
						class="h-[2px] w-[20px] bg-[#ACACAC]"
						style="box-shadow: 0.3px 0.7px 0px 0.5px black;"
						on:click={() => (toggleInfoModal = !toggleInfoModal)}
						on:keypress={() => (toggleInfoModal = !toggleInfoModal)}
					/>
				{/each}
			</button>
			<div class="xl:text-lg overflow-hidden text-ellipsis whitespace-nowrap w-40">
				{ownVid ? 'lordmike007.eth' : findingSoul ? 'finding A Soul...' : 'otherPerson.eth'}
			</div>
		</div>
		<button class="rounded-full xl:hidden" style="box-shadow: 0.7px 0.7px 0px 1px black;">
			<img src={SoulTkn} class="w-8 aspect-square" alt="" />
		</button>
	</div>
	<div class="hidden xl:flex items-center justify-between w-[11rem] mt-4">
		<span>Souls Earned: &nbsp;&nbsp;&nbsp; {soulsEarned}</span>
		<img src={SoulTkn} class="w-[1.8rem] aspect-square" alt="" />
	</div>
	<div
		class="py-4 pb-0 xl:py-0 xl:my-8 h-full xl:h-auto xl:border-[5px] xl:border-solid xl:border-[#797979] relative"
	>
		<!-- svelte-ignore a11y-media-has-caption -->
		{#if findingSoul}
			<div class="flex flex-col justify-center items-center absolute inset-0 z-10 gap-4">
				<span>finding A Soul...</span>
				<div
					class="relative px-1 border-[3px] xl:border-[4px] border-[#4f4f4f] border-solid w-40 xl:w-[16rem] h-8 xl:h-10 flex flex-row justify-start gap-1 items-center"
				>
					{#each Array(6) as _}
						<div class="h-[1.2rem] xl:h-6 w-[0.55rem] xl:w-3 bg-[#4f4f4f]" />
					{/each}
				</div>
			</div>
		{/if}
		<video bind:this={videoElem} class="w-full xl:w-full h-full xl:h-[24.3rem] bg-black" />
	</div>
	<div class="hidden xl:flex flex-row items-center justify-between">
		<Button
			disabled={ownVid || findingSoul}
			className="flex flex-row w-48 gap-4 justify-center items-center"
		>
			Reap Soul:
			<img
				style={ownVid || findingSoul ? '' : 'box-shadow: 0.7px 0.7px 0px 1px black;'}
				class="w-8 rounded-full"
				src={ReapSoul}
				alt=""
			/>
		</Button>
		<Button
			disabled={ownVid || findingSoul}
			className="flex flex-row w-48 gap-4 justify-center items-center"
		>
			Gift Soul:
			<img
				style={ownVid || findingSoul ? '' : 'box-shadow: 0.7px 0.7px 0px 1px black;'}
				class="w-8 rounded-full"
				src={SoulTkn}
				alt=""
			/>
		</Button>
	</div>
</div>
<SoulInfoModal {ownVid} {findingSoul} bind:toggleInfoModal />

<style>
	video {
		transform: rotateY(180deg);
		-webkit-transform: rotateY(180deg); /* Safari and Chrome */
		-moz-transform: rotateY(180deg); /* Firefox */
	}
</style>
