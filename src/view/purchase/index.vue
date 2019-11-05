<template>
<div class="x-page-purchase">
	<van-nav-bar
		title="下单"
		left-text="返回"
		left-arrow
		@click-left="onClickLeft" 
	/>

	<van-cell-group class="x-i-cellGroup mt0">
		<van-cell icon="location-o" is-link @click="onClickSelectShipInfo" class="x-i-shipInfo">
			<div v-if="shipInfo && shipInfo.name" class="x-i-user">{{shipInfo.name}} {{shipInfo.phone}}</div>
			<div v-else class="x-i-user">选择收货地址</div>

			<div v-if="shipInfo && shipInfo.name" class="x-i-area">{{shipInfo.area}} {{shipInfo.address}}</div>
		</van-cell>
	</van-cell-group>

	<van-card
		v-for="product in products"
		:key="product.id"
		:title="product.name"
		:price="formatPrice(product.price)"
		:thumb="product.thumbnail"
	>
		<div slot="tags" v-if="product.sku_display_name != 'standard'">
			<van-tag plain type="danger">{{product.sku_display_name}}</van-tag>
		</div>
		<div slot="num">
			<van-button class="x-i-countBtn" size="mini" @click.stop="increCount(product)">+</van-button>
			<span class="x-i-count">{{product.count}}</span>
			<van-button class="x-i-countBtn" size="mini" @click.stop="decreCount(product)">-</van-button>
		</div>
	</van-card>

	<van-cell-group class="x-i-cellGroup">
		<van-field label="留言" v-model="message" placeholder="请输入给商家的留言" />
	</van-cell-group>

	<!-- <van-panel title="" class="mt10">
		<div class="x-productPage-detail clearfix mt10">
			<div class="pt10 pb20" v-if="product.base_info.detail" v-html="product.base_info.detail"></div>
		</div>
	</van-panel> -->

	<van-cell-group class="x-i-cellGroup">
		<van-cell title="商品金额">
			<template slot="default">
				<span class="x-i-price">{{productPrice}}</span>
			</template>
		</van-cell>
		<van-cell title="运费">
			<template slot="default">
				<span class="x-i-price">{{postageMoney}}</span>
			</template>
		</van-cell>
	</van-cell-group>

	<van-submit-bar
		:price="totalPrice"
		button-text="提交订单"
		@submit="onSubmit"
	/>
</div>
</template>

<script>
import {
	Tag,
	Cell,
	Button,
	CellGroup,
	Panel,
	Toast,
	SubmitBar,
	Card,
	NavBar,
	Field,
	Notify
} from 'vant';
import OrderService from '@/service/order_service'
import MallService from '@/service/mall_service'
import Vue from 'vue'
// import ShoppingCartService from '@/service/shopping_cart_service'

export default {
	components: {
		[Tag.name]: Tag,
		[Panel.name]: Panel,
		[Cell.name]: Cell,
		[CellGroup.name]: CellGroup,
		[SubmitBar.name]: SubmitBar,
		[Toast.name]: Toast,
		[Card.name]: Card,
		[Button.name]: Button,
		[NavBar.name]: NavBar,
		[Field.name]: Field,
		[Notify.name]: Notify
	},

	computed: {
		totalPrice() {
			let price = this.products.reduce((total, item) => total + item.price*item.count, 0);
			return price * 100;
		},

		productPrice() {
			let price = this.products.reduce((total, item) => total + item.price*item.count, 0);
			return '¥ ' + price;
		},

		postageMoney() {
			return '¥ 0'
		}
	},

	data() {
		return {
			message: '',
			products: [],
			shipInfo: null
		};
	},

	mounted() {
		setTimeout(async () => {
			let shipInfoId = Vue.ls.get('__shipInfoId')
			if (shipInfoId) {
				this.shipInfo = await MallService.getShipInfo(shipInfoId)
			} else {
				this.shipInfo = await MallService.getDefaultShipInfo()
			}
			console.log(this.shipInfo);
			let productInfos = this.$route.query.products;
			let purchaseData = await OrderService.getPurchaseData(productInfos)
			this.products = purchaseData.products;
			console.log(this.products)
			// this.product = await ProductService.getProduct(productId)
			// this.shoppingCartProductCount = await ShoppingCartService.getProductCount()
		})
	},

	methods: {
		onClickLeft() {
			this.$router.go(-1)
		},

		formatPrice(price) {
			return price.toFixed(2);
		},

		increCount(product) {
			product.count += 1;
		},

		decreCount(product) {
			if (product.count == 1) {
				return
			}
			product.count -= 1;
		},

		onClickCart() {
			this.$router.push('cart');
		},

		async onSubmit() {
			let products = this.products.map(product => {
				return {
					id: product.id,
					count: product.count,
					sku: product.sku,
					price: product.price
				}
			})
			
			let shipInfo = {
				name: this.shipInfo.name,
				phone: this.shipInfo.phone,
				area_code: this.shipInfo.area_code,
				address: this.shipInfo.address
			}

			let order = await OrderService.createOrder(products, shipInfo, this.message)
			if (order) {
				Toast({
					message: '下单成功，去支付~',
					duration: 1000
				})
				setTimeout(() => {
					this.$router.push({
						path: '/payment',
						query: {
							money: this.totalPrice,
							order_bid: order.bid,
							order_id: order.id
						}
					})
				}, 1100)
			} else {
				Notify("下单失败，请稍后再试")
			}
		},

		onClickSelectShipInfo() {
			this.$router.push({
				path: '/ship_infos',
				query: {
					mode: 'select'
				}
			})
		},

		sorry() {
			Toast('暂无后续逻辑~');
		}
	}
};
</script>

<style lang="less">
.x-page-purchase {
	padding-bottom: 50px;

	.x-i-cellGroup {
		margin: 15px 0;

		.van-cell__value {
			color: #999;
		}
	}

	.van-submit-bar__text {
		text-align: left;
		margin-left: 10px;
	}

	.x-i-shipInfo {
		padding-top: 20px;
		padding-bottom: 20px;

		.x-i-user {
			color: #333;
		}

		.x-i-area {
			color: #333;
		}
	}

	.van-card {
		background-color: #FFF;
	}

	.van-card__price {
		color: #f44;
	}

	.x-i-price {
		color: #f44;
	}

	.x-i-countBtn {
		min-width: 25px;
		width: 25px;
	}

	.x-i-count {
		padding: 0px 8px;
	}
}
</style>
