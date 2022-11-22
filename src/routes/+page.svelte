<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	import axios from 'axios';

	const stations = $page.url.searchParams.get('stations') || null;
	const accessKey = $page.url.searchParams.get('accessKey') || null;
	const scrollSpeed = Number.parseInt($page.url.searchParams.get('scrollSpeed')) || 10;
	const enableScrolling = $page.url.searchParams.get('enableScrolling') || false;
	const refreshMs = Number.parseInt($page.url.searchParams.get('refreshMs')) || 30 * 60 * 1000;

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
		}, refreshMs);

		const response = await fetchMetars();
		metars = response.metars;
		message = response.message;

		return () => clearInterval(interval);
	});
</script>

{#if message}
	<div class="metar-wrapper">MESSAGE: {message}</div>
{:else if enableScrolling}
	<div class="page-head__ticker">
		<div class="msg" style="--animation-speed: {metars.length * 4 * scrollSpeed}s">
			{#each metars.concat(metars).concat(metars).concat(metars) as metar}
				<span>{metar.raw}</span>
			{/each}
		</div>
	</div>
{:else}
	<div class="metar-wrapper">
		{#each metars as metar}
			<span>{metar.raw}</span>
		{/each}
	</div>
{/if}

<style>
	/**
 * Ticker
 */

	.page-head__ticker {
		text-transform: uppercase;
		overflow: hidden;
	}

	.msg {
		rmargin: 0 auto;
		white-space: nowrap;
		overflow: hidden;
		animation: marquee var(--animation-speed) linear infinite;
		display: inline-block;
	}

	span {
		padding-left: 24px;
		/* to give a gap between messages */
	}

	@keyframes marquee {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(-50%, 0);
			/* changed from 100% */
		}
	}
</style>
