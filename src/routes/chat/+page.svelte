<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import Button from '$lib/components/Button/index.svelte';
	import MediaBlock from './components/MediaBlock/index.svelte';
	import ShowMutual from './components/ShowMutual/index.svelte';
	import ioClient, { Socket } from 'socket.io-client';
	import { onMount, onDestroy } from 'svelte';
	import { networkConnectionData } from '$lib/stores';
	import { fetchEnsName, readContract } from '@wagmi/core';
	import SimplePeer from 'simple-peer/simplepeer.min.js';
	import type { BigNumber } from 'ethers';
	import type { SoulParams } from './interfaces';
	import { SOULTOKENADDRESS } from '$lib/constants/index';
	import { abi as SOULTOKENABI } from '$lib/constants/abi';

	let affirmToSkipSoul = 0;
	$: skipButtonContent = affirmToSkipSoul ? 'Affirm?' : 'Skip Soul';
	let io: Socket | null;
	let peer: SimplePeer | undefined;
	let stream: MediaStream | undefined;
	let ownVideoElem: HTMLVideoElement;
	let otherVideoElem: HTMLVideoElement;
	let ownSoulParams: SoulParams;
	let otherSoulParams: SoulParams;
	let otherSoulId = '';
	let otherSoulAddress: `0x${string}`;
	let otherSoulENS: string;
	let otherSoulBalance: string;
	let findingSoul = true;
	let mutualInterests: Array<string>;

	const fetchOtherSoulENS = async () => {
		otherSoulENS = await fetchEnsName({
			address: otherSoulAddress,
			chainId: 1
		});
	};

	const fetchOtherSoulBalance = async () => {
		const data: BigNumber = await readContract({
			address: SOULTOKENADDRESS,
			abi: SOULTOKENABI,
			functionName: 'rewardCount',
			args: [otherSoulAddress]
		});
		otherSoulBalance = data.toString();
	};

	const playOwnMedia = async () => {
		try {
			stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true
			});
			ownVideoElem.srcObject = stream;
			ownVideoElem.play();
		} catch (e) {}
	};

	const parseSoulParams = () => {
		let params = new URLSearchParams(window.location.search);
		let tempParams: SoulParams | {} = {};
		params.forEach((val, key) => {
			tempParams[key as keyof Object] = JSON.parse(val);
		});
		ownSoulParams = tempParams;
	};

	const makeMeFreeIfImStillLonely = () => {
		if (ownSoulParams.interests.length > 0)
			setTimeout(() => {
				if (findingSoul) io?.emit('makeMeFreeSoul', ownSoulParams);
			}, 12000);
	};

	const initializeSocket = () => {
		if (!io) io = ioClient(PUBLIC_BACKEND_URL);

		if (stream) {
			io.emit('interests', ownSoulParams);
		}
		makeMeFreeIfImStillLonely();
	};

	const initializeSocketListeners = (io: Socket) => {
		io.on('initiateWebRTC', (otherSoulParams_, otherSoulSocketId) => {
			peer = new SimplePeer({ initiator: true, stream: stream });
			otherSoulParams = otherSoulParams_;
			otherSoulId = otherSoulSocketId;

			peer?.on('signal', (data) => {
				console.log('1 initiator on signal');
				io?.emit(
					'passingPeerData',
					data,
					ownSoulParams,
					otherSoulId,
					$networkConnectionData.myAddress
				);
			});

			peer?.on('stream', (stream: MediaStream) => {
				if ('srcObject' in otherVideoElem) {
					otherVideoElem.srcObject = stream;
				} else {
					otherVideoElem.src = window.URL.createObjectURL(stream); // for older browsers
				}

				findingSoul = false;
				otherVideoElem.play();
			});

			peer?.on('close', () => {
				io?.emit('skipSoul', otherSoulId, () => {
					peer?.destroy();
					findNextSoul();
				});
			});

			peer?.on('error', () => {
				io?.emit('skipSoul', otherSoulId, () => {
					peer?.destroy();
					findNextSoul();
				});
			});
		});

		io.on(
			'matchMadeWithRemoteWebRTC',
			(peerData, otherSoulParams_, otherSoulSocketId, otherSoulAddress_) => {
				peer = new SimplePeer({ stream: stream });
				peer.signal(peerData);
				console.log('2 matcher signalling initiator');
				otherSoulParams = otherSoulParams_;
				otherSoulId = otherSoulSocketId;
				otherSoulAddress = otherSoulAddress_;
				fetchOtherSoulENS();
				fetchOtherSoulBalance();

				peer.on('signal', (data) => {
					console.log('3 matcher on signal');
					let intvl = setInterval(() => {
						if ($networkConnectionData.myAddress) {
							io?.emit(
								'rePassingPeerData',
								data,
								otherSoulSocketId,
								$networkConnectionData.myAddress
							);
							clearInterval(intvl);
						}
					});

					setTimeout(() => {
						clearInterval(intvl);
					}, 12000);
				});

				peer?.on('stream', (stream: MediaStream) => {
					if ('srcObject' in otherVideoElem) {
						otherVideoElem.srcObject = stream;
					} else {
						otherVideoElem.src = window.URL.createObjectURL(stream); // for older browsers
					}

					otherVideoElem.play();
					findingSoul = false;
				});

				peer?.on('close', () => {
					io?.emit('skipSoul', otherSoulId, () => {
						peer?.destroy();
						findNextSoul();
					});
				});

				peer?.on('error', () => {
					io?.emit('skipSoul', otherSoulId, () => {
						peer?.destroy();
						findNextSoul();
					});
				});
			}
		);

		io.on('rePassedStreamData', (peerData, otherSoulAddress_) => {
			otherSoulAddress = otherSoulAddress_;
			fetchOtherSoulENS();
			peer?.signal(peerData);
			console.log('4 initiator signalling matcher');
		});

		io.on('soulSkipped', () => {
			peer?.destroy();
			findNextSoul();
		});
	};

	onMount(() => {
		playOwnMedia();

		parseSoulParams();

		initializeSocket();

		initializeSocketListeners(io);
	});

	onDestroy(() => {
		io?.emit('skipSoul', otherSoulId, () => {
			peer?.destroy();
			io?.disconnect();
		});
	});

	const findNextSoul = () => {
		findingSoul = true;
		affirmToSkipSoul = 0;

		initializeSocket();
	};

	const skipSoul = () => {
		if (!affirmToSkipSoul) {
			affirmToSkipSoul++;
			return;
		}

		io?.emit('skipSoul', otherSoulId, () => {
			peer?.destroy();
			findNextSoul();
		});

		makeMeFreeIfImStillLonely();
	};

	$: {
		if (findingSoul) {
			mutualInterests = ['finding a soul...'];
		} else {
			mutualInterests = [];
			ownSoulParams.interests.forEach((ownInterest) => {
				if (otherSoulParams.interests.includes(ownInterest)) {
					mutualInterests.push(ownInterest);
				}
			});
		}
	}

	$: if (stream) {
		initializeSocket();
	}
</script>

<ShowMutual {mutualInterests} className="px-6 md:px-10 xl:px-14 mt-8 md:mt-10" />
<div
	class="flex flex-col md:flex-row md:justify-between px-6 md:px-10 xl:px-14 mt-8 xl:mt-16 gap-6"
>
	<MediaBlock
		soulEns={otherSoulENS}
		soulsRewarded={otherSoulBalance || 'loading...'}
		soulAddress={otherSoulAddress || 'loading...'}
		{findingSoul}
		gotStreamAccess={stream ? true : false}
		bind:videoElem={otherVideoElem}
	/>
	<MediaBlock
		ownVid
		soulEns={$networkConnectionData.myENS}
		soulsRewarded={$networkConnectionData.myRewards || 'loading...'}
		soulAddress={$networkConnectionData.myAddress || 'loading...'}
		gotStreamAccess={stream ? true : false}
		bind:videoElem={ownVideoElem}
	/>
</div>
<Button disabled={findingSoul} on:click={skipSoul} className="my-8 xl:my-16 w-40 tracking-[2px]">
	{skipButtonContent}
</Button>
