import { Resource } from '@/lib/resource';
import Service from './service'

class MallService extends Service {
	constructor() {
		super();
	}

	reset() {
		super.reset();
	}

	async getShipInfos() {
		this.reset()
		try {
			let resp = await Resource.get({
				resource: 'ginger-mall:mall.ship_infos',
				data: {
				}
			})

			this.getCache('shipInfos').addAll(resp.data.ship_infos)
			return resp.data.ship_infos;
		} catch(e) {
			console.error(e)
			return []
		}
	}

	async getShipInfo(id) {
		let shipInfo = this.getCache('shipInfos').get(id)
		if (!shipInfo) {
			let resp = await Resource.get({
				resource: 'ginger-mall:mall.ship_info',
				data: {
					id: id
				}
			})

			return resp.data;
		} else {
			return shipInfo;
		}
	}

	async createShipInfo(name, phone, areaCode, address) {
		try {
			let resp = await Resource.put({
				resource: 'ginger-mall:mall.ship_info',
				data: {
					name: name,
					phone: phone,
					area_code: areaCode,
					address: address
				}
			})

			return resp.data.id;
		} catch(e) {
			console.error(e)
			return 0
		}
	}

	async updateShipInfo(id, name, phone, areaCode, address) {
		try {
			await Resource.post({
				resource: 'ginger-mall:mall.ship_info',
				data: {
					id: id,
					name: name,
					phone: phone,
					area_code: areaCode,
					address: address
				}
			})

			return true;
		} catch(e) {
			console.error(e)
			return false
		}
	}

	async setDefaultShipInfo(shipInfoId) {
		try {
			await Resource.put({
				resource: 'ginger-mall:mall.default_ship_info',
				data: {
					id: shipInfoId,
				}
			})

			return true;
		} catch(e) {
			console.error(e)
			return false
		}
	}

	async getDefaultShipInfo() {
		let resp = await Resource.get({
			resource: 'ginger-mall:mall.default_ship_info',
			data: {
			}
		})

		return resp.data;
	}

	async deleteShipInfo(shipInfoId) {
		try {
			await Resource.delete({
				resource: 'ginger-mall:mall.ship_info',
				data: {
					id: shipInfoId,
				}
			})

			return true;
		} catch(e) {
			console.error(e)
			return false
		}
	}
}

let service = new MallService();

export default service;
