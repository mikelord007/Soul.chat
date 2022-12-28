import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	server: {
		port: 3000
	},
	preprocess: vitePreprocess()
};

export default config;
