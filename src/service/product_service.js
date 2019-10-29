import { Resource } from '@/lib/resource';
import Service from './service'

class ProductService extends Service {
	constructor() {
		super();
	}

	reset() {
		super.reset();
	}

	async getProducts() {
		try {
			let resp = await Resource.get({
				resource: 'ginger-mall:mall.products',
				data: {
					_p_from: 0,
					_p_count: 20,
				}
			})

			this.getCache('products').addAll(resp.data.products)
			return resp.data.products;
		} catch(e) {
			console.error(e)
			return []
		}
	}

	async getProduct(productId) {
		let product = this.getCache('products').get(productId)
		if (product) {
			return product;
		} else {
			try {
				let resp = await Resource.get({
					resource: 'ginger-mall:mall.product',
					data: {
						id: productId
					}
				})
	
				product = resp.data;
				this.getCache('products').add(product)
				return product;
			} catch(e) {
				console.error(e)
				return null;
			}
		}
	}
}

let service = new ProductService();

export default service;
