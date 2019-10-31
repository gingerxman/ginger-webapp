import { Resource } from '@/lib/resource';
import Service from './service'

class ShoppingCartService extends Service {
	constructor() {
		super();
	}

	reset() {
		super.reset();
	}

	async getProductCount() {
		try {
			let resp = await Resource.get({
				resource: 'ginger-mall:mall.shopping_cart_product_count',
				data: {
				}
			})

			return resp.data.count;
		} catch(e) {
			console.error(e)
			return 0
		}
	}

	async addProduct(productId, skuName, count) {
		let product = this.getCache('products').get(productId)
		if (product) {
			return product;
		} else {
			try {
				let resp = await Resource.put({
					resource: 'ginger-mall:mall.shopping_cart_item',
					data: {
						pool_product_id: productId,
						sku_name: skuName,
						count: count
					}
				})

				return resp.data.count;
			} catch(e) {
				console.error(e)
				return 0;
			}
		}
	}

	async getProducts() {
		try {
			let resp = await Resource.get({
				resource: 'ginger-mall:mall.shopping_cart',
				data: {
				}
			})

			let products = resp.data.product_groups[0].products;
			products = products.map(product => {
				product.price = parseFloat(product.price);
				return product;
			})

			return products;
		} catch(e) {
			console.error(e)
			return null;
		}
	}

	async deleteProduct(itemId) {
		try {
			await Resource.delete({
				resource: 'ginger-mall:mall.shopping_cart_item',
				data: {
					id: itemId
				}
			})

			return true;
		} catch(e) {
			console.error(e)
			return false;
		}
	}
}

let service = new ShoppingCartService();

export default service;