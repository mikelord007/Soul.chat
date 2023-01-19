<script>
	import Cross from '$lib/assets/images/icons/cross.svg';
	import Borders from '$lib/components/Borders/index.svelte';
	import SoulTkn from '$lib/assets/images/icons/soultkn.svg';
	import ReapSoul from '$lib/assets/images/icons/reapSoul.svg';

	export let toggleInfoModal = false;
	// let infoPoints = <span>Hello</span>
</script>

{#if toggleInfoModal}
	<div class="fixed inset-0 bg-black opacity-50 z-20" />
	<div
		class="fixed z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#4F4F4F] border-[3px] border-solid border-[#6E6E6E] w-10/12 xl:w-[31rem] max-w-[29.25rem] py-8 xl:py-10 px-6 xl:px-10 pt-5 xl:pt-8"
	>
		<div class="flex flex-row justify-end items-center">
			<button
				class="relative p-1 shrink-0"
				on:click={() => {
					toggleInfoModal = false;
				}}
			>
				<Borders height="0.15rem" width="0.15rem" />
				<img class="h-[1.15rem] xl:h-[1.25rem] w-[1.15rem] xl:w-[1.25rem]" src={Cross} alt="" />
			</button>
		</div>
		<ul class="flex flex-col gap-4 pl-[1.1rem] mt-3">
			<li>
				<span />You are stuck in the 90's internet. The web has only started to take over.
			</li>
			<li>
				<span />Each user is a Soul.
			</li>
			<li>
				<span />
				You can choose to gift Souls
				<img class="inline ml-2 xl:w-8" src={SoulTkn} alt="Soul Token" />
				to others.
			</li>
			<li>
				<span />
				You earn a Soul NFT whenever you get gifted 100<img
					class="inline ml-2 xl:w-8"
					src={SoulTkn}
					alt="Soul Token"
				/>.
			</li>
			<li>
				<span />
				You can only gift few<img class="inline ml-2 xl:w-8" src={SoulTkn} alt="Soul Token" />each
				day.
			</li>
			<li>
				<span />
				You can choose to reap other Souls<img
					class="inline ml-2 xl:w-8"
					src={ReapSoul}
					alt="Soul Token"
				/>.
			</li>
			<li>
				<span />You will be forever ridden if 5 Souls Reap your Soul.
			</li>
		</ul>
	</div>
	>
{/if}

<style>
	li {
		position: relative;
	}
	li > span {
		display: block;
		position: absolute;
		height: 0.45rem;
		width: 0.45rem;
		background-color: white;
		border-radius: 50%;
		left: -20px;
		top: 9px;
	}
	ul > li > img {
		margin: 0 0.5rem;
		width: 2rem;
	}
	@media only screen and (min-width: 1280px) {
		li {
			font-size: 18px;
		}
	}
</style>
