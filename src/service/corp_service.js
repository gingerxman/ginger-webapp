import { Resource } from '@/lib/resource';
import Service from './service'

class CorpService extends Service {
	constructor() {
		super();
	}

	reset() {
		super.reset();
	}

	async getAllCorps() {
		try {
			let resp = await Resource.get({
				resource: 'ginger-account:dev.all_corps',
				data: {}
			})

			return resp.data.corps;
		} catch(e) {
			console.error(e)
			return []
		}
	}
}

let service = new CorpService();

export default service;
