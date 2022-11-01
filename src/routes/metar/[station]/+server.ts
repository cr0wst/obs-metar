import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { AVWX_API_KEY } from '$env/static/private';
import axios from 'axios';

/**
 * This method proxies the client API requests to the weather server.
 *
 */
export async function GET(request: RequestEvent) {
	const station = request.params['station'];
	const response = await axios.get(`https://avwx.rest/api/metar/${station}`, {
		headers: {
			Authorization: `Bearer ${AVWX_API_KEY}`
		}
	});
	return json(response.data);
}
