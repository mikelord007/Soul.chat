<script lang="ts">
	import Borders from '$lib/components/Borders/index.svelte';
	import Button from '$lib/components/Button/index.svelte';
	import { fetchSigner } from '@wagmi/core';
	import { networkConnectionData } from '$lib/stores';
	import * as PushAPI from '@pushprotocol/restapi';
	export let mutualInterests: Array<string>;
	export let className: string;
	let receivingNotifications = false;

	const optInToNotifications = async () => {
		let signer = await fetchSigner();
		await PushAPI.channels.subscribe({
			signer: signer,
			channelAddress: 'eip155:80001:0xEFDeb468C681EEF5Df33E58920B3027B52d525D7', // channel address in CAIP
			userAddress: `eip155:80001:${$networkConnectionData.myAddress}`, // user address in CAIP
			verifyingContractAddress: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
			onSuccess: () => {
				console.log('opt in success');
			},
			onError: () => {
				console.error('opt in error');
			},
			env: 'staging'
		});
		receivingNotifications = true;
	};

	const optOutFromNotifications = async () => {
		let signer = await fetchSigner();
		await PushAPI.channels.unsubscribe({
			signer: signer,
			channelAddress: 'eip155:80001:0xEFDeb468C681EEF5Df33E58920B3027B52d525D7', // channel address in CAIP
			userAddress: `eip155:80001:${$networkConnectionData.myAddress}`, // user address in CAIP
			verifyingContractAddress: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
			onSuccess: () => {
				console.log('opt out success');
			},
			onError: () => {
				console.error('opt out error');
			},
			env: 'staging'
		});
		receivingNotifications = false;
	};

	$: if (mutualInterests.length < 1) {
		mutualInterests = ['void'];
	}
</script>

<div class={[className, 'flex justify-between items-center'].join(' ')}>
	<div
		class="m-auto md:ml-0 md:mr-auto  mt-4 p-4 xl:py-8 flex items-center gap-4 relative h-[57.6px] xl:h-[72px] max-w-[23rem] xl:max-w-[30rem] border-[3px] border-solid border-[#797979]"
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
	<Button
		className="mr-0 hidden md:block"
		on:click={() => {
			if (receivingNotifications) optOutFromNotifications();
			else optInToNotifications();
		}}>{receivingNotifications ? 'Disable Notifications' : 'Receive Notifications'}</Button
	>
</div>
