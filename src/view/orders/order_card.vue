<template>
	<div class="x-orderCard">  
		<div class="x-i-card">
			<div class="x-i-head">
				<div class="x-i-date">{{order.created_at}}</div>
				<div class="x-i-status">{{statusText}}</div>
			</div>
			<van-card
				v-for="product in products"
				:key="product.id"
				:title="product.name"
				:price="formatPrice(product.price)"
				:thumb="product.thumbnail"
				:num="product.count"
				@click="onClickProduct(product)"
			>
				<div slot="tags" v-if="product.sku_display_name != 'standard'">
					<van-tag plain type="danger">{{product.sku_display_name}}</van-tag>
				</div>
			</van-card>
			<div class="x-i-sum">
				<span>共{{totalProductCount}}件商品 合计: ¥</span> <span class="x-i-price">{{order.final_money}}</span>
			</div>
			<div class="x-i-actions">
				<van-button
					v-for="(action, index) in actions"
					:key="index"
					plain
					hairline
					round 
					size="small"
					:type="action.type"
					class="ml5"
					@click="onClickAction(action)"
				>
					{{action.name}}
				</van-button>
			</div>
		</div>
	</div>
</template>


<script>
import { Card, Button, Tag } from 'vant';

export default {
	name: 'order-card',
	props: {
		order: {
			type: Object,
			default: null
		}
	},

	components: {
		[Card.name]: Card,
		[Button.name]: Button,
		[Tag.name]: Tag,
	},

	data () {
		return {
			name2action: {
				'pay': {
					code: 'pay',
					name: '去付款',
					type: 'danger',
				},
				'review': {
					code: 'review',
					name: '评价',
					type: 'danger',
				}, 
				'logistics': {
					code: 'logistics',
					name: '查看物流',
					type: 'default',
				}
			}
		}
	},

	mounted () {
	},

	computed: {
		products() {
			return this.order.invoices[0].products
		},

		statusText() {
			let status2text = {
				"wait_confirm": "等待商家确认",
				"wait_pay": "等待付款",
			}

			return status2text[this.order.status] || this.order.status;
		},

		totalPrice() {
			let price = this.products.reduce((total, item) => total + (this.checkedGoods.indexOf(item.id) !== -1 ? item.price*item.purchase_count : 0), 0);
			return price * 100;
		},

		totalProductCount() {
			return this.order.invoices.reduce((total, invoice) => {
				let count = invoice.products.reduce((invoiceTotal, product) => {
					return invoiceTotal + product.count;
				}, 0)
				return total + count;
			}, 0)
		},

		actions() {
			return [this.name2action['pay'], this.name2action['review'], this.name2action['logistics']]
		}
	},

	methods: {
		formatPrice(price) {
			return price;
		},

		onClickProduct(product) {
			this.$router.push({
				path: '/product',
				query: {
					id: product.id
				}
			})
		},

		onClickAction(action) {
			if (action.code == 'pay') {
				this.$router.push({
					path: '/payment',
					query: {
						money: this.order.final_money * 100,
						order_bid: this.order.bid,
						order_id: this.order.id
					}
				})
			} else {
				console.log(action.code)
			}
		}
	}
}
</script>

<style lang="less">
.x-orderCard {
	background-color: #fff;
	position: relative;    

	.x-i-card {
		margin-bottom: 10px;
		.x-i-head {
			padding: 5px 15px 2px 15px;
			display: flex;
			font-size: 12px;
			color: #333;

			.x-i-status {
				width: 100px;
				color: #ee0a24;
				text-align: right;
			}

			.x-i-date {
				flex: 1;
			}
		}
		.van-card {
			margin-top: 0px;
			background-color: #FFF;
		}

		.x-i-sum {
			padding: 5px 15px 2px 15px;
			font-size: 12px;
			color: #333;
			vertical-align: bottom;
			text-align: right;

			.x-i-price {
				font-size: 1.2em;
				font-weight: 500;
			}
		}

		.x-i-actions {
			padding: 10px;
			text-align: right;

			.van-button {
				padding: 0 12px;
			}
			.van-button--default {
				border-color: #BfBfBf;
			}
		}
	}
}
</style>