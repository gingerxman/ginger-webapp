<template>
<div class="x-page-order" v-if="order">
	<!-- <van-nav-bar
		title="订单详情"
		left-text="返回"
		left-arrow
		@click-left="onClickLeft" 
	/> -->

	<div class="x-i-statusZone">
		<div class="x-i-status">
			<van-icon :name="statusInfo.icon" size="30"/>
			<div class="x-i-status-info">
				<div class="x-i-status-text">{{statusInfo.text}}</div>
				<div class="x-i-status-help">{{orderHelp}}</div>
			</div>
		</div>
		<van-steps v-if="order.status != 'canceled'" :active="statusInfo.step">
			<van-step>买家付款</van-step>
			<van-step>商家发货</van-step>
			<van-step>交易完成</van-step>
		</van-steps>
	</div>

	<van-cell-group class="x-i-cellGroup mt0">
		<van-cell icon="location-o" class="x-i-shipInfo">
			<div class="x-i-user">
				<div class="x-i-user-name">收货人: {{shipInfo.name}}</div> 
				<div class="x-i-user-phone">{{shipInfo.phone}}</div>
			</div>
			<div v-if="shipInfo && shipInfo.name" class="x-i-area">{{shipInfo.area_name}} {{shipInfo.address}}</div>
		</van-cell>
	</van-cell-group>

	<van-card
		v-for="product in products"
		:key="product.id"
		:title="product.name"
		:num="product.count"
		:price="formatPrice(product.price)"
		:thumb="product.thumbnail"
	>
	</van-card>

	<van-cell-group class="x-i-cellGroup x-i-orderInfo">
		<van-cell title="配送方式">
			<template slot="default">
				<span>快递 ¥{{formatPrice(postageMoney)}}</span>
			</template>
		</van-cell>
		<van-cell title="买家留言">
			<template slot="default">
				<span>{{message ? message : '无'}}</span>
			</template>
		</van-cell>
	</van-cell-group>

	<van-cell-group class="x-i-cellGroup x-i-priceInfo">
		<van-cell title="商品金额">
			<template slot="default">
				<span class="x-i-price">¥ {{formatPrice(productPrice)}}</span>
			</template>
		</van-cell>
		<van-cell title="运费">
			<template slot="default">
				<span class="x-i-price">+ ¥ {{formatPrice(postageMoney)}}</span>
			</template>
		</van-cell>
		<van-cell class="x-i-totalMoney">
			<template slot="default">
				合计：<span class="x-i-price">¥ {{formatPrice(totalPrice)}}</span>
			</template>
		</van-cell>
	</van-cell-group>

	<van-cell-group v-if="order.status != 'wait_pay'" class="x-i-cellGroup x-i-orderInfo">
		<van-cell title="订单编号">
			<template slot="default">
				<span>{{order.status == 'wait_pay' ? order.bid : invoice.bid}}</span>
			</template>
		</van-cell>
		<van-cell title="下单时间">
			<template slot="default">
				<span>{{order.created_at}}</span>
			</template>
		</van-cell>
		<van-cell title="付款时间" v-if="getOperationTime('pay_order')">
			<template slot="default">
				<span>{{getOperationTime("pay_order")}}</span>
			</template>
		</van-cell>
		<van-cell title="发货时间" v-if="getOperationTime('ship_order')">
			<template slot="default">
				<span>{{getOperationTime("ship_order")}}</span>
			</template>
		</van-cell>
		<van-cell title="完成时间" v-if="getOperationTime('finish_order')">
			<template slot="default">
				<span>{{getOperationTime("finish_order")}}</span>
			</template>
		</van-cell>
	</van-cell-group>

	<div class="x-i-operations">
		<template v-if="order.status == 'wait_pay'">
			<div >合计: <span class="x-i-price">¥ {{formatPrice(totalPrice)}}</span></div>
			<van-button
				type="danger"
				@click.stop="onClickOrderOperation({code:'pay_order'})"
			>去支付</van-button>
		</template>
		<template v-else>
			<van-button
				v-for="op in statusInfo.operations"
				plain
				:key="op.code"
				:type="op.type"
				:round="op.type != 'danger'"
				:size="op.type == 'danger' ? 'normal' : 'small'"
				@click.stop="onClickOrderOperation(op)"
			>{{op.name}}</van-button>
		</template>
	</div>
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
	Notify,
	Step,
	Steps,
	Icon
} from 'vant';
import OrderService from '@/service/order_service'
import { OrderStatusInfo } from '@/view/order/mixin'

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
		[GoodsActionButton.name]: GoodsActionButton,
		[Steps.name]: Steps,
		[Step.name]: Step,
		[Icon.name]: Icon,
	},

	mixins: [OrderStatusInfo],

	computed: {
		totalPrice() {
			if (!this.order) {
				return 0
			}

			return this.order.final_money
		},

		productPrice() {
			if (!this.order) {
				return 0
			}

			return this.order.product_price
		},

		postageMoney() {
			if (!this.order) {
				return 0
			}

			return this.order.postage
		},

		products () {
			if (!this.order) {
				return []
			}

			if (this.order.status == 'wait_pay') {
				return this.invoice.products
			} else {
				return this.invoice.products
			}
		},

		orderHelp () {
			let status = this.order.status;
			if (status != "wait_pay") {
				status = this.invoice.status;
			}

			if (status == 'wait_pay') {
				return '请于 18分30秒 内付款，超时订单将自动关闭'
			} else if (status == 'shipped') {
				return '还剩7天自动确认完成'
			}
		},


	},

	data() {
		return {
			order: null,
			invoice: null,
			shipInfo: null,
			message: ''
		};
	},

	mounted() {
		setTimeout(async () => {
			let orderBid = this.$route.query.bid;
			let order = await OrderService.getOrder(orderBid);
			this.order = order;
			this.invoice = order.invoices[0]
			this.shipInfo = this.invoice.ship_info
			this.message = order.message;
		})
	},

	methods: {
		onClickLeft() {
			this.$router.go(-1)
		},

		formatPrice(price) {
			return (price / 100).toFixed(2);
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

		onClickOrderOperation(op) {
			this.operateOrder(this.order, op)
		},

		getOperationTime (action) {
			if (!this.order) {
				return ''
			}

			const operationLog = this.order.operation_logs.find(log => {
				console.log(JSON.stringify(log))
				return log.action === action
			})
			if (operationLog) {
				return operationLog.created_at
			} else {
				return ''
			}
		},

		orderStatusChangeHandler (bid, newStatus) {
			// 注意: 这是OrderStatusInfo mixin中进行了订单操作之后的回调函数
			if (this.order.bid === bid) {
				this.order = {
					...this.order,
					status: newStatus
				}
			}

			if (this.invoice.bid === bid) {
				this.invoice = {
					...this.invoice,
					status: newStatus
				}
			}
		}
	}
};
</script>

<style lang="less">
.x-page-order {
	.x-i-statusZone {
		// background-color: rgba(255, 0, 0, 0.55);
		background-color: #FFF;
		padding: 15px;
		padding-bottom: 15px;

		.iconfont {
			font-size: 1.8rem;
			vertical-align: baseline;
			top: 3px;
		}

		.x-i-status {
			display: flex;
			flex-direction: row;
			.van-icon {
				width: 30px;
				display: block;
			}
			&-info {
				flex: 1;
				margin-left: 5px;
			}
			&-text {
				display: inline-block;
				vertical-align: middle;
				font-weight: bold;
				font-size: 16px;
				color: #333;
			}
			&-help {
				color: #666;
				font-size: 12px;
				margin-top: 4px;
				line-height: 14px;
			}
		}

		.van-steps {
			padding-left: 0px;
			margin-top: 15px;

			&__items {
				margin: 0px;
			}
		}
	}

	.x-i-cellGroup {
		margin: 15px 0;

		.van-cell__title {
			width: 100px;
			flex: none;
		}
		.van-cell__value {
			color: #333;
		}

		.x-i-totalMoney {
			font-size: 16px;

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
			color: #323233;
			font-size: 16px;
			font-weight: 500;
			display: flex;
			flex-direction: row;
			justify-content: space-between;

			&-name {
				flex: 1;
			}

			&-phone {
				text-align: right;
				width: 120px;
			}
		}

		.x-i-area {
			font-size: 12px;
			color: #666;
		}
	}
	.x-i-shipInfo:after {
		left: 0;
		right: 0;
		bottom: 0;
		content: "";
		height: 2px;
		position: absolute;
		background: -webkit-repeating-linear-gradient(135deg,#ff6d6d,#ff6d6d 20%,transparent 0,transparent 25%,#3283fa 0,#3283fa 45%,transparent 0,transparent 50%);
		background: repeating-linear-gradient(-45deg,#ff6d6d,#ff6d6d 20%,transparent 0,transparent 25%,#3283fa 0,#3283fa 45%,transparent 0,transparent 50%);
		background-size: 80px;
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

	.x-i-orderInfo {
		.van-cell {
			padding: 8px 16px;
		}
	}

	.x-i-priceInfo {
		.van-cell {
			padding: 8px 16px;
		}
	}

	.x-i-operations {
		z-index: 1;
		background-color: #FFF;
		position: fixed;
		width: 100%;
		bottom: 0px;
		display: flex;
		justify-content: flex-end;
		height: 44px;
		line-height: 44px;

		div {
			line-height: 44px;
		}

		.van-button {
			margin-left: 10px;
		}
		.van-button--small {
			margin-top: 7px;
			margin-right: 10px;
		}
	}
}
</style>
