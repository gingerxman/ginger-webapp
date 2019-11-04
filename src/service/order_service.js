import { Resource } from '@/lib/resource';
import Service from './service'

class OrderService extends Service {
	constructor() {
		super();
	}

	reset() {
		super.reset();
	}

	async getPurchaseData(productInfos) {
		try {
			let resp = await Resource.get({
				resource: 'ginger-mall:mall.purchase_data',
				data: {
					product_infos: productInfos
				}
			})

			return resp.data;
		} catch(e) {
			console.error(e)
			return null
		}
	}

	async createOrder(products, shipInfo, message) {
		try {
			let resp = await Resource.put({
				resource: 'ginger-mall:order.order',
				data: {
					products: JSON.stringify(products),
					ship_info: JSON.stringify(shipInfo),
					message: message
				}
			})

			return resp.data;
		} catch(e) {
			console.error(e)
			return null
		}
	}

	async payedOrder(orderBid) {
		try {
			await Resource.put({
				resource: 'ginger-mall:order.payed_order',
				data: {
					bid: orderBid
				}
			})

			return true;
		} catch(e) {
			console.error(e)
			return false
		}
	}

	async getOrder(orderBid) {
		try {
			let resp = await Resource.get({
				resource: 'ginger-mall:order.order',
				data: {
					bid: orderBid
				}
			})

			return resp.data;
		} catch(e) {
			console.error(e)
			return null
		}
	}

	async getOrders(type) {
		try {
			let resp = await Resource.get({
				resource: 'ginger-mall:order.user_orders',
				data: {
					"__f-status": type
				}
			})

			return resp.data.orders;
		} catch(e) {
			console.error(e)
			return []
		}
	}
}

let service = new OrderService();

export default service;
