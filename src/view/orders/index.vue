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
			<van-tab name="wait_confirm" title="待发货"></van-tab>
			<van-tab name="shipped" title="待收货"></van-tab>
			<van-tab name="review" title="待评价"></van-tab>
		</van-tabs>

		<div class="x-i-orders">
			<order-card
				v-for="order in orders"
				:key="order.id"
				:order="order"
			/>
		</div>
	</div>
</template>

<script>
import {
	NavBar,
	Tab,
	Tabs
} from 'vant';
import OrderService from '@/service/order_service';
import OrderCard from './order_card'

export default {
	components: {
		[NavBar.name]: NavBar,
		[Tab.name]: Tab,
		[Tabs.name]: Tabs,
		[OrderCard.name]: OrderCard
	},

	data () {
		return {
			orders: [],
			activeTab: 0
		}
	},

	computed:{
		
	},

	mounted () {
		setTimeout(async () => {
			this.orders = await OrderService.getOrders('all')
			console.log(this.orders)
		})
	},

	methods: {
		onClickLeft() {
			this.$router.go(-1)
		},

		async onChangeTab(name) {
			let type = name;
			this.orders = await OrderService.getOrders(type)
		}
	}
}
</script>

<style lang="less">
.x-page-orders {
	.x-i-orders {
		margin-top: 10px;
	}
}
</style>