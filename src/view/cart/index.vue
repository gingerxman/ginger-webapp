<template>
	<div 
		:class="{
			page:true, 
			'x-page-cart':true,
			'x-page-cart-fromProduct': isFromProductPage
		}"
	>
		<van-nav-bar
			v-if="isFromProductPage"
			title="购物车"
			left-text="返回"
			left-arrow
			@click-left="onClickGoBack" 
		/>

		<van-checkbox-group class="card-goods" v-model="checkedGoods" v-if="products.length > 0">
			<van-checkbox
				class="card-goods__item"
				v-for="product in products"
				:key="`${product.id}_${product.sku_name}`"
				:name="product.id"
			>
				<van-card
					:title="product.name"
					:price="formatPrice(product.price)"
					:thumb="product.thumbnail"
				>
					<div slot="num">
						<van-button class="x-i-countBtn" size="mini" @click.stop="increCount(product)">+</van-button>
						<span class="x-i-count">{{product.purchase_count}}</span>
						<van-button class="x-i-countBtn" size="mini" @click.stop="decreCount(product)">-</van-button>
					</div>
					<div slot="tags" v-if="product.sku_display_name != 'standard'">
						<van-tag plain type="danger">{{product.sku_display_name}}</van-tag>
					</div>
					<div slot="footer">
						<van-button class="x-i-deleteBtn" size="normal" icon="delete" @click.stop="onClickDelete(product)" />
					</div>
				</van-card>
			</van-checkbox>
		</van-checkbox-group>
		<div v-else class="x-i-empty">
			您还没有商品，去挑选吧～
		</div>
		
		<van-submit-bar
			:price="totalPrice"
			:disabled="!checkedGoods.length"
			:button-text="submitBarText"
			suffix-label="不含运费"
			@submit="onSubmit"
		/>

		<bottom-nav v-if="!isFromProductPage" :active="2" />
	</div>
</template>

<script>
import { Checkbox, CheckboxGroup, Card, SubmitBar, Toast, Button, NavBar, Tag } from 'vant';
import ShoppingCartService from '@/service/shopping_cart_service'
import BottomNav from '@/view/component/bottom_nav'

export default {
	components: {
		[Card.name]: Card,
		[NavBar.name]: NavBar,
		[Checkbox.name]: Checkbox,
		[SubmitBar.name]: SubmitBar,
		[CheckboxGroup.name]: CheckboxGroup,
		[Button.name]: Button,
		[BottomNav.name]: BottomNav,
		[Tag.name]: Tag,
	},

	data() {
		return {
			checkedGoods: [],
			products: [],
			isFromProductPage: false
		};
	},

	computed: {
		submitBarText() {
			const count = this.checkedGoods.length;
			return '结算' + (count ? `(${count})` : '');
		},

		totalPrice() {
			let price = this.products.reduce((total, item) => total + (this.checkedGoods.indexOf(item.id) !== -1 ? item.price*item.purchase_count : 0), 0);
			return price;
		}
	},

	mounted() {
		if (this.$route.query && this.$route.query.source) {
			this.isFromProductPage = this.$route.query.source == 'product';
		}

		setTimeout(async () => {
			this.products = await ShoppingCartService.getProducts();
			this.checkedGoods = this.products.map(product => {
				return product.id;
			})
		})
	},

	methods: {
		onClickGoBack() {
			this.$router.go(-1)
		},

		formatPrice(price) {
			return (price / 100).toFixed(2);
		},

		onSubmit() {
			let products = this.products.filter(product => {
				let foundId = this.checkedGoods.find(productId => productId == product.id);
				if (foundId) {
					return true;
				} else {
					return false;
				}
			})

			let cartItemIds = products.map(product => product.cart_item_id)

			let code = products.map(product => {
				return `${product.id}.${product.purchase_count}.${product.sku_name}`
			}).join(';')

			this.$router.push({
				path: '/purchase',
				query: {
					products: code,
					cart_item_ids: JSON.stringify(cartItemIds)
				}
			})
		},

		async onClickDelete(product) {
      console.log(product)
			let isSuccess = await ShoppingCartService.deleteProduct(product.cart_item_id);
			if (isSuccess) {
				this.products = this.products.filter(oneProduct => {
					return oneProduct.id != product.id;
				})

				this.checkedGoods = this.checkedGoods.filter(checkedId => {
					return checkedId != product.id;
				})
			} else {
				Toast("操作失败，请稍后再试～")
			}
		},

		increCount(product) {
			product.purchase_count += 1;
		},

		decreCount(product) {
			if (product.purchase_count == 1) {
				return
			}
			product.purchase_count -= 1;
		}
	}
};
</script>

<style lang="less">
.x-page-cart {
	.van-submit-bar {
		bottom: 50px;
	}

	.x-i-empty {
		margin-top: 150px;
		color: #666;
		text-align: center;
		text-shadow:0 0 10px #BBB;
	}

	.van-submit-bar__suffix-label {
		display: block;
		color: #888;
		font-size: 12px;
	}
}

.x-page-cart-fromProduct {
	.van-submit-bar {
		bottom: 0px;
	}
}

.card-goods {
	padding: 10px 0;
	background-color: #fff;

	&__item {
		position: relative;
		background-color: #FFF;

		.van-checkbox__label {
			width: 100%;
			height: auto; // temp
			padding: 0 10px 0 15px;
			box-sizing: border-box;
		}

		.van-checkbox__icon {
			top: 50%;
			left: 10px;
			z-index: 1;
			position: absolute;
			margin-top: -10px;
		}

		.van-card {
			background-color: #FFF;
		}

		.van-card__price {
			color: #f44;
		}

		.x-i-countBtn {
			min-width: 25px;
			width: 25px;
		}

		.x-i-deleteBtn {
			min-width: 30px;
			width: 30px;
			min-height: 20px;
			height: 20px;
			line-height: 20px;
			margin: 0px;
			padding: 0px;
			border: none;
		}

		.x-i-count {
			padding: 0px 8px;
		}
	}
}
</style>
