<template>
	<div class="page x-page-products">
		<product-card
			v-for="product in products"
			:key="product.id"
			:product="product"
		/>
	</div>
</template>

<script>
	import ProductService from '@/service/product_service'
	import ProductCard from '@/view/component/product_card'

	export default {
		components: {
			'product-card': ProductCard
		},

		data () {
			return {
				products: [],
				productRows: []
			}
		},

		computed:{
			
		},

		mounted () {
			setTimeout(async () => {
				this.products = await ProductService.getProducts()
				console.log(this.products)
			})
		},

		methods: {
			
		}
	}
</script>

<style lang="less">
.x-page-products {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}
</style>