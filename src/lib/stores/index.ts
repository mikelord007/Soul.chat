import { readable, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Web3Modal } from '@web3modal/html';
import type { EthereumClient } from '@web3modal/ethereum';
import { browser } from '$app/environment';

interface networkConnectionData {
    walletConnected: boolean,
    correctNetwork: boolean,
    ethereumClient: EthereumClient | undefined,
    web3Modal: Web3Modal | undefined,
    myAddress: string | undefined,
    myENS: string | undefined,
}

export const networkConnectionData : Writable<networkConnectionData> = writable({
    walletConnected: false,
	correctNetwork: false,
    ethereumClient: undefined,
    web3Modal: undefined,
    myAddress: undefined,
    myENS: undefined
});

export const deviceSize = readable({size: 'sm'},(set) => {
    
    if(browser)
        set({
            size: window?.innerWidth>=1536?'2xl':
            window?.innerWidth>=1280?'xl':
            window?.innerWidth>=1024?'lg':
            window?.innerWidth>=768?'md':
            'sm'
        })
})