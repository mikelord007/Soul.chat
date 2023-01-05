<script lang="ts">
	import Button from '$lib/components/Button/index.svelte';
	import MediaBlock from './components/MediaBlock/index.svelte';
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
		params.forEach((val, key) => (ownSoulParams[key as keyof Object] = JSON.parse(val)));
	};

	const InitializeSocketListeners = (io: Socket) => {
		io.emit('interests', ownSoulParams);

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
			otherSoulId = otherSoulSocketId;

			peer.on('signal', (data) => {
				io?.emit('rePassingPeerData', data, otherSoulId);
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

<div class="flex flex-col px-6 mt-8 gap-4" id="vid">
	<MediaBlock bind:videoElem={otherVideoElem} />
	<MediaBlock bind:videoElem={ownVideoElem} />
</div>
<Button on:click={skipSoul} className="my-8 w-40 tracking-[2px]" {buttonContent} />
