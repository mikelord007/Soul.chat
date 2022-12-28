<script>
	import Logo from '$lib/assets/images/logos/logo.png';
	import SoulTkn from '$lib/assets/images/icons/soultkn.svg';
	import Cross from '$lib/assets/images/icons/cross.svg';
	import Borders from '$lib/components/Borders/index.svelte';

	let interests = [];
	const removeInterest = (interest) => {
		interests = interests.filter((elem) => elem !== interest);
	};
	const addInterest = (event) => {
		if (event.keyCode === 13) {
			interests = [...interests, event.target.value];
			event.target.value = '';
		}
	};
</script>

<div class="min-h-screen">
	<Borders needOverflowSupport isFixed={true} applyZIndex={true} />
	<div class="px-8 pt-11">
		<img class="m-auto w-32" src={Logo} alt="soul chat logo" />
	</div>
	<blockquote class="px-12 mt-8 pb-[0.8em] font-semibold tracking-[0.18em]">
		“You can always trust random strangers on the internet with your life.”
	</blockquote>
	<p class="px-12 tracking-[0.18em] font-normal text-right">- Sun Tzu, prolly</p>
	<p class="px-12 mt-20 font-semibold tracking-[0.195em] hover:cursor-pointer">
		<span class="underline">How this works</span>?
	</p>
	<div class="px-12 mt-8">
		<div
			class="py-3 px-2 max-w-[13rem] font-semibold border-[3px] border-solid border-[#797979] flex align-center"
		>
			Souls Earned &nbsp;:&nbsp; 20 <img class="inline ml-4" src={SoulTkn} alt="Soul Token" />
		</div>
	</div>
	<div class="px-12 mt-8">
		<p class="font-semibold">Interests :</p>
		<div
			class="mt-4 relative h-[57.6px]"
			style="box-shadow: inset 2px 2px 3px 2px rgba(0, 0, 0, 0.25)"
		>
			<Borders
				needOverflowSupport
				isProtruded={false}
				width="0.2rem"
				height="0.2rem"
				darkBarOpacity="0.15"
				applyZIndex
			/>
			<div class="px-4 py-3 w-full h-full overflow-scroll flex gap-3 interestSection">
				{#each interests as interest}
					<div
						class="px-2 py-1 inline-flex gap-3 items-center relative shrink-0"
						style="box-shadow: 2px 2px 0px 0.6px #000000;"
					>
						<Borders height="0.1rem" width="0.1rem" />
						<span>{interest}</span>
						<button class="relative p-1 shrink-0" on:click={removeInterest(interest)}>
							<Borders height="0.05rem" width="0.05rem" />
							<img class="h-3 w-3" src={Cross} alt="" />
						</button>
					</div>
				{/each}
				<input
					class="px-2 py-1 w-[15ch] outline-none bg-transparent border-[2.4px] border-solid border-[#646464] shrink-0 relative top-[1px]"
					placeholder="type to add sth"
					on:keypress={addInterest}
				/>
			</div>
		</div>
	</div>
	<div class="px-12 mt-14 ml-[1px] flex items-center gap-2">
		<input
			class="cursor-pointer accent-[#424242] hover:accent-[#424242] outline-none aspect-square w-[1.1rem]"
			type="checkbox"
			id="soulReaper"
		/>
		<label for="soulReaper" class="cursor-pointer select-none text-sm">
			Connect with the most Soul Reaper
		</label>
	</div>
	<div class="px-12 mt-20 mb-12">
		<button class="px-6 py-4 m-auto block relative">
			<Borders width="0.2rem" height="0.2rem" />
			Connect your wallet
		</button>
	</div>
</div>

<style>
	.interestSection::-webkit-scrollbar {
		display: none;
	}
</style>
