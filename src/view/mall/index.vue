<template>
	<div class="page x-page-mall">
		<div class="x-i-topHead">
			<div class="x-i-topBg"></div>
			<div class="x-i-footBg">
			<div class="pa x-i-productImg">
				<img width="50" src="http://resource.vxiaocheng.com/ginger/logo.png"/>
			</div>
			<h1><span class="x-i-corpName">{{corpName}}</span></h1>
			<div class="x-i-productInfo" style="">
				<div class="x-i-count em95">
				<span class="">{{productCount}}</span>
				</div>
				<div class="x-i-name">全部商品</div>
			</div>
			</div>
		</div>

		<div class="x-i-products">
			<product-card
				v-for="product in products"
				:key="product.id"
				:product="product"
			/>
		</div>

		<bottom-nav :active="0" />
	</div>
</template>

<script>
import ProductService from '@/service/product_service'
import ProductCard from '@/view/component/product_card'
import BottomNav from '@/view/component/bottom_nav'

export default {
	components: {
		[BottomNav.name]: BottomNav,
		[ProductCard.name]: ProductCard
	},

	data () {
		return {
			products: [],
			corpName: 'BabyFace',
			productCount: 10,
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
.x-page-mall {
	.x-i-topHead{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 150px;
		background-color: #FFF;
		box-shadow: 1px 0 3px 1px rgba(0, 0, 0, 0.1);
		z-index: 100;
		.x-i-topBg{
			background-color: #070707;
			height: 100px;
		}
		.x-i-footBg{
			background-color: #fff;
			position: relative;
			padding-left: 20px;
			.x-i-productImg {
				position: absolute;
				/*padding: 2px;*/
				background-color: #fff;
				border-radius: 5px;
				bottom: 0px;
				width: 90px;
				height: 90px;
				box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
				text-align: center;
				line-height: 90px;
				img{
					vertical-align: middle;
				}
			}

			.x-i-productInfo {
				text-align: center;
				font-weight: 700;
				padding-left: 103px;
				width: 20%;
				.x-i-count {
					word-break: break-all;
					word-wrap: break-word;
					-webkit-box-orient: vertical;
					white-space: nowrap;
				}
				.x-i-name {
					font-size: .8rem;
					/*margin-bottom: 8px;*/
				}
			}
			h1 {
				color: #fff;
				position: absolute;
				top: -50px;
				padding-left: 103px;
				font-weight: normal;
				font-size: 1rem;
				text-align: left;
				margin-bottom: 5px;
				margin-right: 60px;
				margin-top: 0;
				.x-i-corpName{
					font-size: .9rem;
					font-weight: 600;
					line-height: 1.5rem;
					word-break: break-all;
					word-wrap: break-word;
					-webkit-box-orient: vertical;
					white-space: nowrap;
				}
			}
		}
	}

	.x-i-products {
		margin-top: 160px;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
}

</style>