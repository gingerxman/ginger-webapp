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
				resource: 'ginger-product:cart.product_count',
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
					resource: 'ginger-product:cart.cart_item',
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
				resource: 'ginger-product:cart.cart',
				data: {
				}
			})

			let productGroups = resp.data.product_groups;
			if (productGroups.length > 0) {
				let products = resp.data.product_groups[0].products;
				products = products.map(product => {
					product.price = parseFloat(product.price);
					return product;
				})

				return products;
			} else {
				return [];
			}
		} catch(e) {
			console.error(e)
			return null;
		}
	}

	async deleteProduct(itemId) {
		try {
			await Resource.delete({
				resource: 'ginger-product:cart.cart_item',
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
