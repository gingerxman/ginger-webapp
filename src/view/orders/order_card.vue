<template>
	<div class="x-orderCard" @click="onClickOrder">
		<div class="x-i-card">
			<div class="x-i-head">
				<div class="x-i-date">{{order.created_at}}</div>
				<div class="x-i-status">{{statusInfo.text}}</div>
			</div>
			<div class="x-i-bid">
				订单编号: {{ order.bid }}
			</div>
			<van-card
				v-for="product in products"
				:key="product.id"
				:title="product.name"
				:price="formatPrice(product.price)"
				:thumb="product.thumbnail"
				:num="product.count"
			>
				<div slot="tags" v-if="product.sku_display_name != 'standard'">
					<van-tag plain type="danger">{{product.sku_display_name}}</van-tag>
				</div>
			</van-card>
			<div class="x-i-sum">
				<span>共{{totalProductCount}}件商品 合计: </span> <span class="x-i-price">¥{{formatPrice(order.final_money)}}</span>
			</div>
			<div class="x-i-actions">
				<van-button
					v-for="(op, index) in statusInfo.operations"
					:key="index"
					plain
					hairline
					round 
					size="small"
					:type="op.type"
					class="ml5"
					@click.stop="onClickOrderOperation(op)"
				>
					{{op.name}}
				</van-button>
			</div>
		</div>
	</div>
</template>


<script>
import { Card, Button, Tag, Toast, Dialog, Notify } from 'vant';
import OrderService from '@/service/order_service'
import { OrderStatusInfo } from '@/view/order/mixin'

export default {
	name: 'order-card',
	props: {
		order: {
			type: Object,
			default: null
		}
	},

	mixins: [OrderStatusInfo],

	components: {
		[Card.name]: Card,
		[Button.name]: Button,
		[Tag.name]: Tag,
		[Toast.name]: Toast,
		[Dialog.name]: Dialog,
		[Notify.name]: Notify
	},

	data () {
		return {
			
		}
	},

	mounted () {
	},

	computed: {
		products() {
			return this.order.invoices[0].products
		},

		totalPrice() {
			let price = this.products.reduce((total, item) => total + (this.checkedGoods.indexOf(item.id) !== -1 ? item.price*item.purchase_count : 0), 0);
			return price;
		},

		totalProductCount() {
			return this.order.invoices.reduce((total, invoice) => {
				let count = invoice.products.reduce((invoiceTotal, product) => {
					return invoiceTotal + product.count;
				}, 0)
				return total + count;
			}, 0)
		}
	},

	methods: {
		formatPrice(price) {
			return (price / 100).toFixed(2);
		},

		onClickOrder() {
			this.$router.push({
				path: '/order',
				query: {
					bid: this.order.bid
				}
			})
		},

		onClickOrderOperation(op) {
			this.operateOrder(this.order, op)
		},

		orderStatusChangeHandler (bid, newStatus) {
			// 注意: 这是OrderStatusInfo mixin中进行了订单操作之后的回调函数
			this.$emit('change-status', {
				bid: bid,
				newStatus: newStatus
			})
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
		.x-i-bid {
			color: #aaa;
			font-size: 12px;
			margin-left: 15px;
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
				color: #f44;
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