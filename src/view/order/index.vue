<template>
<div class="x-page-order">
	<van-nav-bar
		title="订单详情"
		left-text="返回"
		left-arrow
		@click-left="onClickLeft" 
	/>

	<div class="x-i-statusZone">
		<div class="x-i-status" v-if="order">
			{{statusText}}
		</div>
	</div>

	<van-cell-group class="x-i-cellGroup mt0">
		<van-cell icon="location-o" class="x-i-shipInfo">
			<div v-if="shipInfo && shipInfo.name" class="x-i-user">{{shipInfo.name}} {{shipInfo.phone}}</div>
			<div v-else class="x-i-user">选择收货地址</div>

			<div v-if="shipInfo && shipInfo.name" class="x-i-area">{{shipInfo.area_name}} {{shipInfo.address}}</div>
		</van-cell>
	</van-cell-group>

	<van-card
		v-for="product in order.products"
		:key="product.id"
		:title="product.name"
		:num="product.count"
		:price="formatPrice(product.price)"
		:thumb="product.thumbnail"
	>
	</van-card>

	<van-cell-group class="x-i-cellGroup">
		<van-cell title="订单编号">
			<template slot="default">
				<span>{{order.bid}}</span>
			</template>
		</van-cell>
		<van-cell title="下单时间">
			<template slot="default">
				<span>{{order.created_at}}</span>
			</template>
		</van-cell>
		<van-cell title="留言" v-if="message">
			<template slot="default">
				<span>{{message}}</span>
			</template>
		</van-cell>
	</van-cell-group>

	<van-cell-group class="x-i-cellGroup">
		<van-cell title="商品金额">
			<template slot="default">
				<span class="x-i-price">{{productPrice}}</span>
			</template>
		</van-cell>
		<van-cell title="运费">
			<template slot="default">
				<span class="x-i-price">+ {{postageMoney}}</span>
			</template>
		</van-cell>
		<van-cell class="x-i-totalMoney">
			<template slot="default">
				实付款：<span class="x-i-price">{{productPrice}}</span>
			</template>
		</van-cell>
	</van-cell-group>

	<van-goods-action>
		<van-goods-action-button type="warning" text="申请退款" />
		<van-goods-action-button type="danger" text="立即购买" />
	</van-goods-action>
</div>
</template>

<script>
import {
	Tag,
	Cell,
	Button,
	CellGroup,
	Toast,
	GoodsAction,
	GoodsActionButton,
	Card,
	NavBar,
	Notify
} from 'vant';
import OrderService from '@/service/order_service'

export default {
	components: {
		[Tag.name]: Tag,
		[Cell.name]: Cell,
		[CellGroup.name]: CellGroup,
		[Toast.name]: Toast,
		[Card.name]: Card,
		[Button.name]: Button,
		[NavBar.name]: NavBar,
		[Notify.name]: Notify,
		[GoodsAction.name]: GoodsAction,
		[GoodsActionButton.name]: GoodsActionButton
	},

	computed: {
		statusText() {
			return '已支付，等待商家确认'
		},

		totalPrice() {
			let products = this.order.products;
			let price = products.reduce((total, item) => total + item.price*item.count, 0);
			return price;
		},

		productPrice() {
			let products = this.order.products;
			let price = products.reduce((total, item) => total + item.price*item.count, 0);
			return '¥ ' + price;
		},

		postageMoney() {
			return '¥ 0'
		}
	},

	data() {
		return {
			order: null,
			shipInfo: null,
			message: ''
		};
	},

	mounted() {
		setTimeout(async () => {
			let orderBid = this.$route.query.bid;
			let order = await OrderService.getOrder(orderBid);
			this.order = order.invoices[0]
			this.shipInfo = this.order.ship_info
			this.message = order.message;
			console.log(this.order)
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

		sorry() {
			Toast('暂无后续逻辑~');
		}
	}
};
</script>

<style lang="less">
.x-page-order {
	padding-bottom: 50px;

	.x-i-statusZone {
		background-color: rgba(255, 0, 0, 0.55);
		padding: 15px;
		color: #FFF;

		.iconfont {
			font-size: 1.8rem;
			vertical-align: baseline;
			top: 3px;
		}

		.x-i-status {
		}
	}

	.x-i-cellGroup {
		margin: 15px 0;

		.van-cell__value {
			color: #333;
		}

		.x-i-totalMoney {
			font-size: 1.2em;

			.van-cell__value {
				text-align: right;
				width: 100%;
			}
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
