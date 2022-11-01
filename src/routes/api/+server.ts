import type { RequestEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import axios from 'axios';

/**
 * This method proxies the client API requests to the weather server.
 *
 */
export async function GET({ url }: RequestEvent) {
	const stations = url.searchParams.get('stations')?.split(',') ?? ([] as string[]);
	const accessKey = url.searchParams.get('accessKey');
	try {
		const metars = [];
		if (stations.length > 0 && accessKey !== null) {
			for (const station of stations) {
				const metar = await getSingle(station, accessKey);
				metars.push(metar);
			}

			return json({ message: null, metars });
		}

		return json({ message: 'Station and access key are required' });
	} catch (err) {
		return json({ message: 'Error Communicating with API' });
	}
}

async function getSingle(station: string, accessKey: string) {
	const response = await axios.get(`https://avwx.rest/api/metar/${station}`, {
		headers: {
			Authorization: `Bearer ${accessKey}`
		}
	});
	return response.data;
}
