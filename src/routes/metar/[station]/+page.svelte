<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	import axios from 'axios';

	let metar = '';
	async function fetchMetar() {
		const station = $page.params.station;
		if (station) {
			return (await axios.get(`/metar/${station}`)).data.raw;
		}

		// This shouldn't happen because of how Svelte routes things
		return 'ERROR: NO STATION';
	}
	onMount(async () => {
		const interval = setInterval(async () => {
			metar = await fetchMetar();
		}, 10000);
		metar = await fetchMetar();

		return () => clearInterval(interval);
	});
</script>

<div id="metar-wrapper">{metar}</div>
