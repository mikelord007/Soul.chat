<script lang="ts">
	import Borders from '$lib/components/Borders/index.svelte';
	export let mutualInterests: Array<string>;
	export let className: string;
</script>

<div class={className}>
	<div
		class="m-auto md:ml-0 md:mr-auto mt-4 p-4 xl:py-8 flex items-center gap-4 relative h-[57.6px] xl:h-[72px] max-w-[23rem] xl:max-w-[30rem] border-[3px] border-solid border-[#797979]"
	>
		<span>Mutual:</span>
		<div class="relative">
			<Borders
				needOverflowSupport
				isProtruded={false}
				width="0.2rem"
				height="0.2rem"
				darkBarOpacity="0.15"
				applyZIndex
			/>
			<div
				class="px-[0.6rem] pt-[0.45rem] xl:pt-[0.75rem] pb-[0.55rem] xl:pb-[0.85rem] w-[11rem] xl:w-[22rem] h-full overflow-hidden flex gap-3 interestSection"
			>
				{#each mutualInterests as interest}
					<div
						class="px-2 py-1 inline-flex gap-3 items-center relative shrink-0"
						style="box-shadow: 2px 2px 0px 0.6px #000000;"
					>
						<Borders height="0.1rem" width="0.1rem" />
						<span class="text-xs xl:text-sm">{interest}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
