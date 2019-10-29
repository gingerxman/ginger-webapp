<template>
	<van-tabbar v-model="index" active-color="#F92929" inactive-color="#FFB18A">
		<van-tabbar-item icon="shop-o" to="/mall">商城</van-tabbar-item>
		<van-tabbar-item icon="apps-o">分类</van-tabbar-item>
		<van-tabbar-item icon="shopping-cart-o">购物车</van-tabbar-item>
		<van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
	</van-tabbar>
</template>


<script>
import {
	Tabbar,
	TabbarItem
} from 'vant';
import Vue from 'vue'

Vue.use(Tabbar).use(TabbarItem)

export default {
	name: 'bottom-nav',

	components: {
		[Tabbar.name]: Tabbar,
		[TabbarItem.name]: TabbarItem
	},

	props: {
		active: {
			type: Number,
			default: null
		}
	},

	data () {
		return {
			index: this.active
		}
	},

	computed: {
		
	},

	methods: {
	}
}
</script>

<style lang="less">
.x-bottomNav {
	
}
</style>