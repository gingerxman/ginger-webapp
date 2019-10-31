import { Resource } from '@/lib/resource';
import Service from './service'

class AreaService extends Service {
	constructor() {
		super();
	}

	reset() {
		super.reset();
	}

	async getYouzanAreaList() {
		try {
			let resp = await Resource.get({
				resource: 'ginger-mall:area.youzan_area_list',
				data: {
				}
			})

			return resp.data;
		} catch(e) {
			console.error(e)
			return null
		}
	}
}

let service = new AreaService();

export default service;
