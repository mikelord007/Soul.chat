<script>
	import '../app.css';
	import Borders from '$lib/components/Borders/index.svelte';
</script>

<div class="min-h-screen">
	<Borders needOverflowSupport isFixed={true} applyZIndex={true} />
	<slot />
</div>
