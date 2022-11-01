<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	import axios from 'axios';

	const stations = $page.url.searchParams.get('stations') || null;
	const accessKey = $page.url.searchParams.get('accessKey') || null;

	let metars = [];
	let message = null;

	async function fetchMetars() {
		try {
			if (stations !== null && accessKey !== null) {
				const responseData = (await axios.get(`/api?accessKey=${accessKey}&stations=${stations}`))
					.data;
				if (responseData.metars.length > 0) {
					return { message: null, metars: responseData.metars };
				}
			}

			// This shouldn't happen because of how Svelte routes things
			return {
				message: 'ERROR: NO STATIONS OR ACCESSKEY Example: ?accessKey=YOUR_KEY&stations=kcmh,ksdf',
				metars: []
			};
		} catch (err) {
			return { message: `ERROR: PROBLEM FETCHING DATA FROM AVWX`, metars: [] };
		}
	}

	onMount(async () => {
		const interval = setInterval(async () => {
			const response = await fetchMetars();
			metars = response.metars;
			message = response.message;
		}, 10 * 100 * 60);

		const response = await fetchMetars();
		metars = response.metars;
		message = response.message;

		return () => clearInterval(interval);
	});
</script>

{#if message}
	<div class="metar-wrapper">MESSAGE: {message}</div>
{:else}
	{#each metars as metar}
		<div class="metar-wrapper">{metar.raw}</div>
	{/each}
{/if}
