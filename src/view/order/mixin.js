import OrderService from '@/service/order_service'
import { Toast, Dialog, Notify } from 'vant';

const name2action = {
	'pay': {
		code: 'pay_order',
		name: '付款',
		type: 'danger'
	},
	'review': {
		code: 'review_order',
		name: '评价',
		type: 'default',
	}, 
	'logistics': {
		code: 'view_logistics',
		name: '查看物流',
		type: 'default',
	},
	'finish': {
		code: 'finish_order',
		name: '确认收货',
		type: 'primary'
	},
	'reorder': {
		code: 'reorder',
		name: '再来一单',
		type: 'default'
	},
	'cancel': {
		code: 'cancel_order',
		name: '取消',
		type: 'default'
	}
}

const statusMap = {
	'wait_pay': {
		step: -1,
		icon: 'bill-o',
		text: '等待买家付款',
		help: '如买家未在规定时间内付款，订单将按照设置逾期自动关闭。',
		operations: [name2action['cancel'], name2action['pay']]
	},
	'wait_ship': {
		step: 0,
		icon: 'todo-list-o',
		text: '等待商家发货',
		help: '买家已付款，请尽快发货，否则买家有可能申请退款。',
		operations: [name2action['reorder']]
	},
	'shipped': {
		step: 1,
		icon: 'logistics',
		text: '商家已发货',
		help: '还剩7天自动确认完成',
		operations: [name2action['logistics'], name2action['finish']]
	},
	'finished': {
		step: 2,
		icon: 'completed',
		text: '交易完成',
		longText: '交易完成',
		help: '',
		operations: [name2action['review'], name2action['reorder']]
	},
	'canceled': {
		text: '交易关闭',
		icon: 'failure',
		help: '',
		operations: [name2action['reorder']]
	}
}

const OrderStatusInfo = {
	computed: {
		statusInfo: function () {
			let order = this.invoice
			if (!order) {
				order = this.order
			}
			return statusMap[order.status] || {
				text: order.status,
				operations: []
			}
		}
	},

	methods: {
		gotoPaymentPage (order) {
			this.$router.push({
				path: '/payment',
				query: {
					money: order.final_money,
					order_bid: order.bid,
					order_id: order.id
				}
			})
		},

		finishInvoice (order) {
			Dialog.confirm({
				title: '确认收货',
				message: '确认收货后，订单交易完成，钱款将立即到达商家账户'
			}).then(() => {
				setTimeout(async () => {
					const isSuccess = await OrderService.finishInvoice(order.bid)
					if (isSuccess) {
						Toast("收货成功")
						if (this.orderStatusChangeHandler) {
							this.orderStatusChangeHandler(this.order.bid, 'finished')
						}
					} else {
						Notify("收货失败，请稍后再试")
					}
				})
			}).catch(() => {
			});
		},

		cancelOrder (order) {
			// 注意，为和youzan行为保持一致，我们使用cancel button来作为确认按钮
			Dialog.confirm({
				title: '取消订单',
				message: '订单还未付款，确定要取消吗？',
				confirmButtonText: '再考虑下',
				cancelButtonText: '取消订单'
			}).then(() => {
				
			}).catch(() => {
				setTimeout(async () => {
					const isSuccess = await OrderService.cancelOrder(order.bid)
					if (isSuccess) {
						Toast("取消订单成功")
						if (this.orderStatusChangeHandler) {
							this.orderStatusChangeHandler(this.order.bid, 'canceled')
						}
					} else {
						Notify("取消订单失败，请稍后再试")
					}
				})
			});
		},

		operateOrder(order, op) {
			if (op.code == 'pay_order') {
				this.gotoPaymentPage(this.order)
			} else if (op.code == 'finish_order') {
				this.finishInvoice(this.order)
			} else if (op.code == 'cancel_order') {
				this.cancelOrder(this.order)
			} else {
				console.warn(op.code)
			}
		}
	}
}

export { OrderStatusInfo }