<script lang="ts">
	import Borders from '$lib/components/Borders/index.svelte';
	import SoulTkn from '$lib/assets/images/icons/soultkn.svg';
	import ReapSoul from '$lib/assets/images/icons/reapSoul.svg';
	import Button from '$lib/components/Button/index.svelte';
	import SoulInfoModal from '../SoulInfoModal/index.svelte';
	import GiftSoulModal from '../GiftSoulModal/index.svelte';
	import ReapSoulModal from '../ReapSoulModal/index.svelte';
	import { deviceSize } from '$lib/stores';

	export let videoElem;
	export let ownVid = false;
	export let findingSoul = ownVid ? false : true;
	export let soulEns: string = '';
	export let soulAddress: string;
	export let soulsRewarded: string;
	export let gotStreamAccess: boolean;

	const borderWidth = $deviceSize.size === '2xl' ? '7px' : '5px';
	const borderHeight = $deviceSize.size === '2xl' ? '7px' : '5px';
	let toggleInfoModal = false;
	let toggleGiftModal = false;
	let toggleReapModal = false;
	$: soulIdentityValue = soulEns ? soulEns : soulAddress;
</script>

<div
	class="flex flex-col w-full xl:w-[41rem] max-w-[23rem] md:max-w-[33rem] lg:max-w-[40rem] md:max-w-auto min-w-[280px] aspect-[280/300] xl:aspect-[280/215] relative m-auto md:m-0 p-[1.1rem] md:p-6 xl:p-[2.3rem]"
>
	<Borders width={borderWidth} height={borderHeight} />
	<div class="flex items-center justify-between h-8 xl:h-auto">
		<div class="flex items-center gap-4">
			<button
				class="flex flex-col gap-[3px] lg:hidden"
				on:click={() => (toggleInfoModal = !toggleInfoModal)}
			>
				{#each Array(4) as _}
					<div
						class="h-[2px] w-[20px] bg-[#ACACAC]"
						style="box-shadow: 0.3px 0.7px 0px 0.5px black;"
					/>
				{/each}
			</button>
			<div class="xl:text-lg overflow-hidden text-ellipsis whitespace-nowrap w-40">
				{findingSoul ? 'finding a Soul...' : soulIdentityValue}
			</div>
		</div>
		<button
			class="rounded-full xl:hidden"
			style={`${
				ownVid
					? 'display: none;'
					: findingSoul
					? 'opacity: 0.5;'
					: 'box-shadow: 0.7px 0.7px 0px 1px black;'
			}`}
			on:click={() => (toggleGiftModal = !toggleGiftModal)}
			disabled={findingSoul || ownVid}
		>
			<img src={SoulTkn} class="w-8 aspect-square" alt="" />
		</button>
	</div>
	<div class="hidden lg:flex items-center justify-start gap-3 mt-4">
		<span>Souls Earned: &nbsp;&nbsp;&nbsp; {soulsRewarded}</span>
		<img src={SoulTkn} class="w-[1.8rem] aspect-square" alt="" />
	</div>
	<div
		class="py-4 pb-0 md:py-0 md:my-8 h-full lg:h-auto md:border-[3px] lg:border-[4px] xl:border-[5px] md:border-solid md:border-[#797979] relative"
	>
		<!-- svelte-ignore a11y-media-has-caption -->
		{#if !gotStreamAccess}
			<div class="flex flex-col justify-center items-center absolute inset-0 z-10 gap-4">
				<span>Waiting for Media Access...</span>
			</div>
		{:else if findingSoul}
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
		<video bind:this={videoElem} class="w-full h-full lg:h-[24rem] xl:h-[26.3rem] bg-black" />
	</div>
	<div class="hidden md:flex gap-2 flex-row items-center justify-between">
		<Button
			disabled={ownVid || findingSoul}
			className="flex flex-row w-[9.6rem] lg:w-48 py-2 lg:py-4 px-[0.5rem] lg:px-4 gap-4 justify-center items-center"
			on:click={() => {
				toggleReapModal = !toggleReapModal;
			}}
		>
			Reap Soul:
			<img
				style={ownVid || findingSoul ? '' : 'box-shadow: 0.7px 0.7px 0px 1px black;'}
				class="w-[1.7rem] lg:w-8 rounded-full"
				src={ReapSoul}
				alt=""
			/>
		</Button>
		<Button
			disabled={ownVid || findingSoul}
			className="flex flex-row w-[9.6rem] lg:w-48 py-2 lg:py-4 px-[0.5rem] lg:px-4 gap-4 justify-center items-center"
			on:click={() => {
				toggleGiftModal = !toggleGiftModal;
			}}
		>
			Gift Soul:
			<img
				style={ownVid || findingSoul ? '' : 'box-shadow: 0.7px 0.7px 0px 1px black;'}
				class="w-[1.7rem] lg:w-8 rounded-full"
				src={SoulTkn}
				alt=""
			/>
		</Button>
	</div>
</div>
<SoulInfoModal {soulIdentityValue} {soulsRewarded} {ownVid} {findingSoul} bind:toggleInfoModal />
<GiftSoulModal {soulIdentityValue} {ownVid} {findingSoul} bind:toggleGiftModal />
<ReapSoulModal {soulIdentityValue} {ownVid} {findingSoul} bind:toggleReapModal />

<style>
	video {
		transform: rotateY(180deg);
		-webkit-transform: rotateY(180deg); /* Safari and Chrome */
		-moz-transform: rotateY(180deg); /* Firefox */
		/* display: none; */
	}
</style>
