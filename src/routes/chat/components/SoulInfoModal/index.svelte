<script>
	import Cross from '$lib/assets/images/icons/cross.svg';
	import Borders from '$lib/components/Borders/index.svelte';
	import SoulTkn from '$lib/assets/images/icons/soultkn.svg';
	import ReapSoul from '$lib/assets/images/icons/reapSoul.svg';
	import Button from '$lib/components/Button/index.svelte';

	export let soulName = 'lordmike007.eth';
	export let soulsEarned = 20;
	export let ownVid = true;
	export let findingSoul = true;
	export let toggleInfoModal = false;
</script>

{#if toggleInfoModal}
	<div class="fixed inset-0 bg-black opacity-50 z-20" />
	<div
		class="fixed z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#4F4F4F] border-[3px] border-solid border-[#6E6E6E] w-10/12 py-6 px-4 pt-4"
	>
		<div class="flex flex-row justify-end items-center">
			<button
				class="relative p-1 shrink-0"
				on:click={() => {
					toggleInfoModal = false;
				}}
			>
				<Borders height="0.05rem" width="0.05rem" />
				<img class="h-[1.15rem] w-[1.15rem]" src={Cross} alt="" />
			</button>
		</div>
		<div class="flex flex-col gap-6 mt-2">
			<span class="font-semibold tracking-wide">Soul: &nbsp;&nbsp;{soulName}</span>
			<span class="font-semibold tracking-wide flex items-center">
				Souls Earned: &nbsp;&nbsp{soulsEarned}
				<img class="inline ml-2 xl:w-8" src={SoulTkn} alt="Soul Token" /></span
			>
			<div class="relative flex flex-col gap-3">
				<Button
					disabled={ownVid || findingSoul}
					className="flex flex-row h-[3.2rem] w-48 text-[15px] gap-4 justify-center items-center"
				>
					Gift Soul:
					<img
						style={ownVid || findingSoul ? '' : 'box-shadow: 0.7px 0.7px 0px 1px black;'}
						class="w-8 rounded-full"
						src={SoulTkn}
						alt=""
					/>
				</Button>
				<Button
					disabled={ownVid || findingSoul}
					className="flex flex-row h-[3.2rem] w-48 text-[15px] gap-4 justify-center items-center"
				>
					Reap Soul:
					<img
						style={ownVid || findingSoul ? '' : 'box-shadow: 0.7px 0.7px 0px 1px black;'}
						class="w-8 rounded-full"
						src={ReapSoul}
						alt=""
					/>
				</Button>
			</div>
		</div>
	</div>
{/if}
