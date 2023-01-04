<script lang="ts">
	import Button from '$lib/components/Button/index.svelte';
	import MediaBlock from './components/MediaBlock/index.svelte';
	import ioClient, { Socket } from 'socket.io-client';
	import { onMount, onDestroy } from 'svelte';
	import SimplePeer from 'simple-peer/simplepeer.min.js';

	let affirm = 0;
	let buttonContent = 'Skip Soul';
	let io: Socket | null;
	let peer: SimplePeer | undefined;
	let stream: MediaStream | undefined;
	let otherSoulData;
	let otherSoulId = '';
	let ownVideoElem: HTMLVideoElement;
	let otherVideoElem: HTMLVideoElement;

	onMount(async () => {
		stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true
		});
		ownVideoElem.srcObject = stream;
		// ownVideoElem.play();

		io = ioClient('http://localhost:5000');
		let params = new URLSearchParams(window.location.search);

		let parsedParams = {};

		params.forEach((val, key) => (parsedParams[key as keyof Object] = JSON.parse(val)));

		io.emit('interests', parsedParams);

		io.on('initiate', (otherSoulParams, otherSoulSocketId) => {
			console.log('streaminitiate: ', stream);
			peer = new SimplePeer({ initiator: true, stream: stream });
			otherSoulData = otherSoulParams;
			otherSoulId = otherSoulSocketId;
			console.log('intiating');

			peer?.on('signal', (data) => {
				console.log('peer initiaized');
				io?.emit('passingPeerData', data, parsedParams, otherSoulId);
			});

			peer?.on('stream', (stream: MediaStream) => {
				console.log('stream received');
				if ('srcObject' in otherVideoElem) {
					otherVideoElem.srcObject = stream;
				} else {
					otherVideoElem.src = window.URL.createObjectURL(stream); // for older browsers
				}

				otherVideoElem.play();
			});
		});

		io.on('matchMade', (peerData, otherSoulParams, otherSoulSocketId) => {
			console.log('peer data matched: ', peerData);
			peer = new SimplePeer({ stream: stream });
			peer.signal(peerData);
			otherSoulData = otherSoulParams;

			peer.on('signal', (data) => {
				io?.emit('rePassingPeerData', data, otherSoulSocketId);
			});

			peer?.on('stream', (stream: MediaStream) => {
				console.log('stream received');
				console.log('stream: ', stream);
				if ('srcObject' in otherVideoElem) {
					otherVideoElem.srcObject = stream;
				} else {
					otherVideoElem.src = window.URL.createObjectURL(stream); // for older browsers
				}

				otherVideoElem.play();
			});
		});

		io.on('rePass', (peerData) => {
			console.log('here in rePass');
			peer?.signal(peerData);
		});
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
