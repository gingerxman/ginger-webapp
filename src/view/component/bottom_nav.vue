<template>
	<van-tabbar v-model="index" active-color="#F92929" inactive-color="#FFB18A">
		<van-tabbar-item icon="shop-o" to="/mall">商城</van-tabbar-item>
		<van-tabbar-item icon="apps-o">分类</van-tabbar-item>
		
		<van-tabbar-item v-if="shoppingCartProductCount > 0" icon="shopping-cart-o" to="/cart" :info="shoppingCartProductCount">购物车</van-tabbar-item>
		<van-tabbar-item v-else icon="shopping-cart-o" to="/cart">购物车</van-tabbar-item>
		
		<van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
	</van-tabbar>
</template>


<script>
import {
	Tabbar,
	TabbarItem
} from 'vant';
import Vue from 'vue'
import ShoppingCartService from '@/service/shopping_cart_service'

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
			index: this.active,
			shoppingCartProductCount: 0
		}
	},

	computed: {
		
	},

	mounted() {
		setTimeout(async () => {
			this.shoppingCartProductCount = await ShoppingCartService.getProductCount();
		})
	},

	methods: {
	}
}
</script>

<style lang="less">
.x-bottomNav {
	
}
</style>