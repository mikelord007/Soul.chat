<script lang="ts">
	import Button from '$lib/components/Button/index.svelte';
	import MediaBlock from './components/MediaBlock/index.svelte';
	import ioClient, { Socket } from 'socket.io-client';
	import { onMount, onDestroy } from 'svelte';
	import SimplePeer from 'simple-peer/simplepeer.min.js';

	// let SimplePeer = {};
	let affirm = 0;
	let buttonContent = 'Skip Soul';
	let io: Socket | null;
	let peer;
	let stream: MediaStream | undefined;
	let otherSoul;
	let videoElem: HTMLVideoElement;

	onMount(async () => {
		// let { SimplePeer } = await import('simple-peer');

		navigator.mediaDevices
			.getUserMedia({
				video: true,
				audio: true
			})
			.then((strm) => {
				stream = strm;
			});

		io = ioClient('http://localhost:5000');
		let params = new URLSearchParams(window.location.search);

		let parsedParams = {};

		params.forEach((val, key) => (parsedParams[key as keyof Object] = JSON.parse(val)));

		io.emit('interests', parsedParams);

		io.on('initiate', (otherSoulData, callback) => {
			otherSoul = otherSoulData;
			// peer = new SimplePeer({ initiator: true, stream: stream });
			callback('hello');
		});

		io.on('MatchMade', (otherSoul, peerData) => {
			console.log('peer data matched: ', peerData);
			peer = new SimplePeer();
			peer.signal(peerData);
		});

		peer?.on('stream', (stream) => {
			if ('srcObject' in videoElem) {
				videoElem.srcObject = stream;
			} else {
				videoElem.src = window.URL.createObjectURL(stream); // for older browsers
			}

			videoElem.play();
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

<div class="flex flex-col px-6 mt-8 gap-4">
	<MediaBlock {videoElem} />
	<MediaBlock />
</div>
<Button on:click={skipSoul} className="my-8 w-40 tracking-[2px]" {buttonContent} />
