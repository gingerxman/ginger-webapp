<template>
	<div class="page x-page-orders">
		<van-nav-bar
			title="我的订单"
			left-text="返回"
			left-arrow
			@click-left="onClickLeft" 
		/>

		<van-tabs @change="onChangeTab" v-model="activeTab" sticky animated>
			<van-tab name="all" title="全部"></van-tab>
			<van-tab name="wait_pay" title="待付款"></van-tab>
			<van-tab name="wait_ship" title="待发货"></van-tab>
			<van-tab name="shipped" title="待收货"></van-tab>
			<van-tab name="wait_review" title="待评价"></van-tab>
		</van-tabs>

		<van-pull-refresh v-model="isPullLoading" @refresh="onRefresh" class="x-i-orders">
			<van-list
				v-model="loading"
				:finished="finished"
				finished-text="我是有底线的"
				@load="onLoad"
				:immediate-check="false"
				class="van-clearfix"
			>
				<order-card
					class="van-clearfix mb10"
					v-for="order in orders"
					:key="order.id"
					:order="order"
				/>
			</van-list>
		</van-pull-refresh>
	</div>
</template>

<script>
import {
	NavBar,
	Tab,
	Tabs,
	List,
	PullRefresh
} from 'vant';
import OrderService from '@/service/order_service';
import OrderCard from './order_card'

export default {
	components: {
		[NavBar.name]: NavBar,
		[Tab.name]: Tab,
		[Tabs.name]: Tabs,
		[List.name]: List,
		[PullRefresh.name]: PullRefresh,
		[OrderCard.name]: OrderCard
	},

	data () {
		this.isFrozen = false;
		return {
			orderType: 'all',
			orders: [],
			loading: false,
			finished: false,
			isPullLoading: false,
			activeTab: 0
		}
	},

	computed:{
		
	},

	mounted () {
		setTimeout(async () => {
			await this.loadOrders(true)
		})
	},

	methods: {
		async loadOrders(reset=false) {
			if (reset) {
				OrderService.reset()
			}
			let { orders, finished } = await OrderService.getOrders(this.orderType)
			if (reset) {
				this.orders = [...orders];
			} else {
				let id2order = {}
				this.orders.forEach(order => {
					id2order[order.id] = true
				})
				let newOrders = orders.filter(order => {
					return !id2order[order.id]
				})
				if (newOrders.length > 0) {
					this.orders = [...this.orders, ...orders];
				}
			}
			this.finished = finished;
			this.loading = false;
			this.isPullLoading = false;
		},

		async onRefresh() {
			setTimeout(async () => {
				await this.loadOrders(true)
			}, 1000)
		},

		async onLoad() {
			console.log("load")
			await this.loadOrders(false)
		},

		onClickLeft() {
			this.$router.go(-1)
		},

		async onChangeTab(name) {
			this.orderType = name;
			await this.loadOrders(true)
		}
	}
}
</script>

<style lang="less">
.x-page-orders {
	margin-bottom: 10px;

	.x-i-orders {
		margin-top: 10px;
	}
}
</style>