<script lang="ts">
	import Button from '$lib/components/Button/index.svelte';
	import MediaBlock from './components/MediaBlock/index.svelte';
	import ShowMutual from './components/ShowMutual/index.svelte';
	import ioClient, { Socket } from 'socket.io-client';
	import { onMount, onDestroy } from 'svelte';
	import SimplePeer from 'simple-peer/simplepeer.min.js';
	import type { SoulParams } from './interfaces';

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
	let findingSoul = true;
	let mutualInterests: Array<string>;
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

	const playOwnMedia = async () => {
		stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true
		});
		ownVideoElem.srcObject = stream;
		ownVideoElem.play();
	};

	const parseSoulParams = () => {
		let params = new URLSearchParams(window.location.search);
		let tempParams: SoulParams | {} = {};
		params.forEach((val, key) => {
			tempParams[key as keyof Object] = JSON.parse(val);
		});
		ownSoulParams = tempParams;
	};

	const initializeSocket = () => {
		if (!io) io = ioClient('http://localhost:5000');

		io.emit('interests', ownSoulParams);
	};

	const initializeSocketListeners = (io: Socket) => {
		io.on('initiateWebRTC', (otherSoulParams_, otherSoulSocketId) => {
			peer = new SimplePeer({ initiator: true, stream: stream });
			otherSoulParams = otherSoulParams_;
			otherSoulId = otherSoulSocketId;
			console.log('initiator');

			peer?.on('signal', (data) => {
				io?.emit('passingPeerData', data, ownSoulParams, otherSoulId);
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
		});

		io.on('matchMadeWithRemoteWebRTC', (peerData, otherSoulParams_, otherSoulSocketId) => {
			peer = new SimplePeer({ stream: stream });
			peer.signal(peerData);
			otherSoulParams = otherSoulParams_;
			otherSoulId = otherSoulSocketId;
			console.log('matchmade');

			peer.on('signal', (data) => {
				console.log('repassing it');
				io?.emit('rePassingPeerData', data, otherSoulSocketId);
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
		});

		io.on('rePassedStreamData', (peerData) => {
			console.log('got repassed data');
			peer?.signal(peerData);
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
			console.log('skipping soul');
			peer?.destroy();
			findNextSoul();
		});
	};
</script>

<ShowMutual {mutualInterests} className="px-6 xl:px-14 mt-8" />
<div class="flex flex-col xl:flex-row xl:justify-between px-6 xl:px-14 mt-8 xl:mt-16 gap-4">
	<MediaBlock {findingSoul} bind:videoElem={otherVideoElem} />
	<MediaBlock ownVid bind:videoElem={ownVideoElem} />
</div>
<Button disabled={findingSoul} on:click={skipSoul} className="my-8 xl:my-16 w-40 tracking-[2px]">
	{skipButtonContent}
</Button>
