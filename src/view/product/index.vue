<template>
<div class="goods" v-if="product">
	<van-swipe class="goods-swipe" :autoplay="3000">
		<van-swipe-item v-for="media in product.medias" :key="media.id">
		<img :src="media.url" >
		</van-swipe-item>
	</van-swipe>

	<van-cell-group>
		<van-cell>
		<div class="goods-title">{{ product.base_info.name }}</div>
		<div class="goods-price">¥{{ product.skus[0].price }}</div>
		</van-cell>
		<van-cell class="goods-express">
		<van-col span="10">运费：免运费</van-col>
		<van-col span="14">剩余：{{ product.skus[0].stocks }}</van-col>
		</van-cell>
	</van-cell-group>

	<!-- <van-cell-group class="goods-cell-group">
		<van-cell value="进入店铺" icon="shop-o" is-link @click="sorry">
		<template slot="title">
			<span class="van-cell-text">有赞的店</span>
			<van-tag class="goods-tag" type="danger">官方</van-tag>
		</template>
		</van-cell>
		<van-cell title="线下门店" icon="location-o" is-link @click="sorry" />
	</van-cell-group> -->

	<van-panel title="商品详情" class="mt10">
		<div class="x-productPage-detail clearfix mt10">
			<div class="pt10 pb20" v-if="product.base_info.detail" v-html="product.base_info.detail"></div>
		</div>
	</van-panel>

	<van-goods-action safe-area-inset-bottom>
		<!-- <van-goods-action-icon icon="chat-o" @click="sorry">
		客服
		</van-goods-action-icon> -->
		<van-goods-action-icon v-if="shoppingCartProductCount > 0" icon="cart-o" :info="shoppingCartProductCount" @click="onClickCart">
		购物车
		</van-goods-action-icon>
		<van-goods-action-icon v-else icon="cart-o" @click="onClickCart">
		购物车
		</van-goods-action-icon>

		<van-goods-action-button type="warning" @click="onClickAddProductToShoppingCart">
		加入购物车
		</van-goods-action-button>
		<van-goods-action-button type="danger" @click="sorry">
		立即购买
		</van-goods-action-button>
	</van-goods-action>
</div>
</template>

<script>
import {
	Tag,
	Col,
	Icon,
	Cell,
	CellGroup,
	Panel,
	Swipe,
	Toast,
	SwipeItem,
	GoodsAction,
	GoodsActionIcon,
	GoodsActionButton
} from 'vant';
import ProductService from '@/service/product_service'
import ShoppingCartService from '@/service/shopping_cart_service'

export default {
	components: {
		[Tag.name]: Tag,
		[Panel.name]: Panel,
		[Col.name]: Col,
		[Icon.name]: Icon,
		[Cell.name]: Cell,
		[CellGroup.name]: CellGroup,
		[Swipe.name]: Swipe,
		[SwipeItem.name]: SwipeItem,
		[GoodsAction.name]: GoodsAction,
		[GoodsActionIcon.name]: GoodsActionIcon,
		[GoodsActionButton.name]: GoodsActionButton
	},

	data() {
		return {
			product: null,
			shoppingCartProductCount: 0
		};
	},

	mounted() {
		setTimeout(async () => {
			let productId = this.$route.query.id;
			this.product = await ProductService.getProduct(productId)
			this.shoppingCartProductCount = await ShoppingCartService.getProductCount()
		})
	},

	methods: {
		formatPrice() {
			return '¥' + (this.product.price / 100).toFixed(2);
		},

		onClickCart() {
			this.$router.push('cart');
		},

		async onClickAddProductToShoppingCart() {
			let newCount = await ShoppingCartService.addProduct(this.product.id, "standard", 1)
			if (newCount > 0) {
				this.shoppingCartProductCount = newCount;
			}
		},

		sorry() {
			Toast('暂无后续逻辑~');
		}
	}
};
</script>

<style lang="less">
.goods {
	padding-bottom: 50px;

	&-swipe {
		img {
			width: 100%;
			display: block;
		}
	}

	&-title {
		font-size: 16px;
	}

	&-price {
		color: #f44;
	}

	&-express {
		color: #999;
		font-size: 12px;
		padding: 5px 15px;
	}

	&-cell-group {
		margin: 15px 0;

		.van-cell__value {
			color: #999;
		}
	}

	&-tag {
		margin-left: 5px;
	}

	.x-productPage-detail {
		background-color: #FFF;
		padding: 0px 10px;
		position: relative;

		.x-i-label {
			width: 100%;
			height: 36px;
			line-height: 36px;
			display: block;
			box-shadow: 0 1px rgba(0,0,0,.05);
			color: #333;
		}

		p {
			margin: 0px;
			padding: 0px;
		}

		img {
			max-width: 100%;
			display: block;
			width: 100%;
		}
	}
}
</style>
