<template>
<div class="goods" v-if="product">
	<van-swipe class="goods-swipe" :autoplay="3000">
		<van-swipe-item v-for="media in product.medias" :key="media.id">
		<img :src="media.url" >
		</van-swipe-item>
	</van-swipe>

	<van-cell-group>
		<van-cell>
		<div class="goods-title">{{ product.base_info.name }}</div>
		<div class="goods-price">¥{{ product.skus[0].price }}</div>
		</van-cell>
		<van-cell class="goods-express">
		<van-col span="10">运费：免运费</van-col>
		<van-col span="14">剩余：{{ product.skus[0].stocks }}</van-col>
		</van-cell>
	</van-cell-group>

	<!-- <van-cell-group class="goods-cell-group">
		<van-cell value="进入店铺" icon="shop-o" is-link @click="sorry">
		<template slot="title">
			<span class="van-cell-text">有赞的店</span>
			<van-tag class="goods-tag" type="danger">官方</van-tag>
		</template>
		</van-cell>
		<van-cell title="线下门店" icon="location-o" is-link @click="sorry" />
	</van-cell-group> -->

	<van-panel title="商品详情" class="mt10">
		<div class="x-productPage-detail clearfix mt10">
			<div class="pt10 pb20" v-if="product.base_info.detail" v-html="product.base_info.detail"></div>
		</div>
	</van-panel>

	<van-goods-action safe-area-inset-bottom>
		<!-- <van-goods-action-icon icon="chat-o" @click="sorry">
		客服
		</van-goods-action-icon> -->
		<van-goods-action-icon v-if="shoppingCartProductCount > 0" icon="cart-o" :info="shoppingCartProductCount" @click="onClickCart">
		购物车
		</van-goods-action-icon>
		<van-goods-action-icon v-else icon="cart-o" @click="onClickCart">
		购物车
		</van-goods-action-icon>

		<van-goods-action-button type="warning" @click="onClickAddNoneSkuToCart">
		加入购物车
		</van-goods-action-button>
		<van-goods-action-button type="danger" @click="onClickBuyNoneSku">
		立即购买
		</van-goods-action-button>
	</van-goods-action>

	<van-sku
		v-model="showSku"
		:sku="sku"
		:goods="goods"
		:goods-id="goodsId"
		:hide-stock="sku.hide_stock"
		@buy-clicked="onClickBuySku"
		@add-cart="onClickAddSkuToCart"
	/>
</div>
</template>

<script>
import {
	Tag,
	Col,
	Icon,
	Cell,
	CellGroup,
	Panel,
	Swipe,
	Toast,
	SwipeItem,
	GoodsAction,
	GoodsActionIcon,
	GoodsActionButton,
	Sku
} from 'vant';
import ProductService from '@/service/product_service'
import ShoppingCartService from '@/service/shopping_cart_service'

export default {
	components: {
		[Tag.name]: Tag,
		[Panel.name]: Panel,
		[Col.name]: Col,
		[Icon.name]: Icon,
		[Sku.name]: Sku,
		[Cell.name]: Cell,
		[CellGroup.name]: CellGroup,
		[Swipe.name]: Swipe,
		[SwipeItem.name]: SwipeItem,
		[GoodsAction.name]: GoodsAction,
		[GoodsActionIcon.name]: GoodsActionIcon,
		[GoodsActionButton.name]: GoodsActionButton
	},

	data() {
		return {
			product: null,
			shoppingCartProductCount: 0,
			purchaseCount: 1,
			skuName: '971:2046_972:2048',

			showSku: false,
			goods: {},
			goodsId: 0,
			sku: {
				tree: [],
				list: [],
				price: '0.00', // 默认价格（单位元）
				stock_num: 0, // 商品总库存
				none_sku: false, // 是否无规格商品
				messages: [
				],
				hide_stock: false // 是否隐藏剩余库存
			}
		};
	},

	computed: {
		isSkuProduct() {
			if (!this.product) {
				return false;
			}

			if (this.product.skus.length == 1 && this.product.skus[0].name == 'standard') {
				return false;
			} else {
				return true;
			}
		}
	},

	mounted() {
		setTimeout(async () => {
			let productId = this.$route.query.id;
			this.product = await ProductService.getProduct(productId)
			if (this.product.skus.length == 1 && this.product.skus[0].name == 'standard') {
				this.skuName = this.product.skus[0].name;
			}

			this.goods = {
				name: this.product.base_info.name,
				picture: this.product.base_info.thumbnail
			}
			this.goodsId = this.product.base_info.id;

			this.buildSku();

			this.shoppingCartProductCount = await ShoppingCartService.getProductCount();
		})
	},

	methods: {
		buildSku () {
			let keys = [];
			let key2values = {};
			let list = [];
			this.product.skus.forEach(sku => {
				let property2value = {}
				keys = sku.property_values.map(propertyValue => {
					return {
						id: propertyValue.property_id,
						name: propertyValue.property_name
					}
				})
				sku.property_values.forEach(propertyValue => {
					let values = key2values[propertyValue.property_name];
					if (!values) {
						values = [];
						key2values[propertyValue.property_name] = values;
					}

					values.push({
						id: propertyValue.id,
						name: propertyValue.text,
						imgUrl: propertyValue.image,
						previewImgUrl: propertyValue.image,
					})

					let keyStr = `property_${propertyValue.property_id}`
					property2value[keyStr] = propertyValue.id
				})

				list.push({
					...property2value,
					id: sku.name,
					price: sku.price * 100,
					stock_num: sku.stocks
				})
			})

			let properties = []
			keys.forEach(key => {
				properties.push({
					k: key.name,
					v: key2values[key.name],
					k_s: `property_${key.id}`
				})
			})

			this.sku.tree = properties;
			this.sku.list = list;
		},

		formatPrice() {
			return '¥' + (this.product.price / 100).toFixed(2);
		},

		buyProduct(skuName, count) {
			let productsData = `${this.product.id}.${count}.${skuName}`
			this.$router.push({
				path: '/purchase',
				query: {
					products: productsData
				}
			})
		},

		onClickBuyNoneSku() {
			if (this.isSkuProduct) {
				this.showSku = true;
			} else {
				this.buyProduct('standard', 1)
			}
		},

		onClickBuySku(skuData) {
			console.log('buy')
			console.log(skuData);
			this.buyProduct(skuData.selectedSkuComb.id, skuData.selectedNum)
		},

		onClickCart() {
			this.$router.push('cart');
		},

		async addProductToCart(skuName, count) {
			let newCount = await ShoppingCartService.addProduct(this.product.id, skuName, count)
			if (newCount > 0) {
				this.shoppingCartProductCount = newCount;
			}
			Toast("添加成功")
		},

		async onClickAddNoneSkuToCart() {
			if (this.isSkuProduct) {
				this.showSku = true;
			} else {
				this.addProductToCart('standard', 1)
			}
		},

		async onClickAddSkuToCart(skuData) {
			this.addProductToCart(skuData.selectedSkuComb.id, skuData.selectedNum)
		},

		sorry() {
			Toast('暂无后续逻辑~');
		}
	}
};
</script>

<style lang="less">
.goods {
	padding-bottom: 50px;

	&-swipe {
		img {
			width: 100%;
			display: block;
		}
	}

	&-title {
		font-size: 16px;
	}

	&-price {
		color: #f44;
	}

	&-express {
		color: #999;
		font-size: 12px;
		padding: 5px 15px;
	}

	&-cell-group {
		margin: 15px 0;

		.van-cell__value {
			color: #999;
		}
	}

	&-tag {
		margin-left: 5px;
	}

	.x-productPage-detail {
		background-color: #FFF;
		padding: 0px 10px;
		position: relative;

		.x-i-label {
			width: 100%;
			height: 36px;
			line-height: 36px;
			display: block;
			box-shadow: 0 1px rgba(0,0,0,.05);
			color: #333;
		}

		p {
			margin: 0px;
			padding: 0px;
		}

		img {
			max-width: 100%;
			display: block;
			width: 100%;
		}
	}
}
</style>
