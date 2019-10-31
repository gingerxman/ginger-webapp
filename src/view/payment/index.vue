<template>
<div class="x-page-payment">
	<div style="height:1px;"></div>
	<div class="xui-top">{{formatPrice}}</div>
	<div style="text-align:center; margin-top:60px;">
		<van-button type="primary" class="mt60" @click="onClickPay" v-if="isInDevMode">支付</van-button>
	</div>
</div>
</template>

<script>
import {
	Button,
	Notify,
	Toast
} from 'vant';
import OrderService from '@/service/order_service'
import Vue from 'vue'
// import ShoppingCartService from '@/service/shopping_cart_service'

export default {
	components: {
		[Button.name]: Button,
		[Notify.name]: Notify,
		[Toast.name]: Toast
	},

	computed: {
		formatPrice() {
			return '¥' + (this.money / 100).toFixed(2);
		},
	},

	data() {
		return {
			money: 0,
			orderId: '',
			orderBid: '',
			isInDevMode: true
		};
	},

	mounted() {
		let query = this.$route.query;
		this.money = query.money;
		this.orderId = query.order_id;
		this.orderBid = query.order_bid;
	},

	methods: {
		async onClickPay() {
			let isSuccess = await OrderService.payedOrder(this.orderBid)
			if (isSuccess) {
				Notify({
					type: 'success',
					message: '支付成功',
					duration: 1000
				})

				setTimeout(() => {
					this.$router.push({
						path: '/order',
						query: {
							bid: this.orderBid
						}
					})
				}, 1100)
			} else {
				Notify({
					message: '支付失败',
					duration: 1000
				})

				setTimeout(() => {
					this.$router.push({
						path: '/order',
						query: {
							bid: this.orderBid
						}
					})
				}, 1000)
			}
		}
	}
};
</script>

<style lang="less">
.x-page-payment {
	background-image: url(../../assets/img/wxpay_bg.png);
	margin: 0;
	padding: 0;
	height: 100vh;
	.xui-top {
		font-size: 1.35rem;
		width: 13.75rem;
		height: 10.5rem;
		background-image: url(../../assets/img/weixin_pay.png);
		background-size: cover;
		margin: 0 auto;
		font-family: arial;
		color: #45AC35;
		margin-top: 6rem;
		box-sizing: border-box;
		padding-top: 6.8rem;
		text-align: center;
	}
	.x-i-info {
		margin-top: 100px;
		margin-bottom: 50px;
		padding: 10px;
		text-align: center;
		font-size: 2rem;

		.x-i-price {
		color: #cf0404;
		}
	}
	.button {
		border-color: transparent;
		background-color: #45AC35;
		color: #fff;
		display: block;
		width: 50%;
		margin: 1rem auto;
	}
}
</style>
