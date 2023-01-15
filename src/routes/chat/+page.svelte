<script lang="ts">
	import Button from '$lib/components/Button/index.svelte';
	import MediaBlock from './components/MediaBlock/index.svelte';
	import ShowMutual from './components/ShowMutual/index.svelte';
	import ioClient, { Socket } from 'socket.io-client';
	import { onMount, onDestroy } from 'svelte';
	import SimplePeer from 'simple-peer/simplepeer.min.js';
	import type { SoulParams } from './interfaces';

	let affirm = 0;
	let buttonContent = 'Skip Soul';
	let io: Socket | null;
	let peer: SimplePeer | undefined;
	let stream: MediaStream | undefined;
	let ownVideoElem: HTMLVideoElement;
	let otherVideoElem: HTMLVideoElement;
	let ownSoulParams: SoulParams;
	let otherSoulParams: SoulParams;
	let otherSoulId = '';

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

	const InitializeSocketListeners = (io: Socket) => {
		io.on('initiateWebRTC', (otherSoulParams_, otherSoulSocketId) => {
			peer = new SimplePeer({ initiator: true, stream: stream });
			otherSoulParams = otherSoulParams_;
			otherSoulId = otherSoulSocketId;

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
			});
		});

		io.on('matchMadeWithRemoteWebRTC', (peerData, otherSoulParams_, otherSoulSocketId) => {
			peer = new SimplePeer({ stream: stream });
			peer.signal(peerData);
			otherSoulParams = otherSoulParams_;

			peer.on('signal', (data) => {
				io?.emit('rePassingPeerData', data, otherSoulSocketId);
			});

			peer?.on('stream', (stream: MediaStream) => {
				if ('srcObject' in otherVideoElem) {
					otherVideoElem.srcObject = stream;
				} else {
					otherVideoElem.src = window.URL.createObjectURL(stream); // for older browsers
				}

				otherVideoElem.play();
			});
		});

		io.on('rePassedStreamData', (peerData) => {
			peer?.signal(peerData);
		});
	};

	onMount(() => {
		playOwnMedia();

		parseSoulParams();

		io = ioClient('http://localhost:5000');
		io.emit('interests', ownSoulParams);

		InitializeSocketListeners(io);
	});

	onDestroy(() => {
		io?.disconnect();
	});

	const skipSoul = () => {
		if (!affirm) {
			affirm++;
			buttonContent = 'Affirm?';
			return;
		}
		// do sth
	};
</script>

<ShowMutual className="px-6 xl:px-14 mt-8" />
<div class="flex flex-col xl:flex-row xl:justify-between px-6 xl:px-14 mt-8 xl:mt-12 gap-4">
	<MediaBlock bind:videoElem={otherVideoElem} />
	<MediaBlock ownVid bind:videoElem={ownVideoElem} />
</div>
<Button on:click={skipSoul} className="my-8 xl:my-12 w-40 tracking-[2px]">
	{buttonContent}
</Button>
