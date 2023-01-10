import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Web3Modal } from '@web3modal/html';
import type { EthereumClient } from '@web3modal/ethereum';

interface networkConnectionData {
    walletConnected: boolean,
    correctNetwork: boolean,
    ethereumClient: EthereumClient | undefined,
    web3Modal: Web3Modal | undefined
}

export const networkConnectionData : Writable<networkConnectionData> = writable({
    walletConnected: false,
	correctNetwork: false,
    ethereumClient: undefined,
    web3Modal: undefined
});