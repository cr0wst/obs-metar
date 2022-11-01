<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	import axios from 'axios';

	let metar = '';

	async function fetchMetar() {
		const station = $page.params.station;
		try {
			if (station) {
				return (await axios.get(`/${station}`)).data.raw;
			}
		} catch (err) {
			return 'ERROR: PROBLEM FETCHING DATA FROM AVWX';
		}

		// This shouldn't happen because of how Svelte routes things
		return 'ERROR: NO STATION';
	}

	onMount(async () => {
		const interval = setInterval(async () => {
			metar = await fetchMetar();
		}, 10 * 100 * 60);
		metar = await fetchMetar();

		return () => clearInterval(interval);
	});
</script>

<div id="metar-wrapper">{metar}</div>
