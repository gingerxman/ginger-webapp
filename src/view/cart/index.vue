<template>
	<div class="page">
		<van-checkbox-group class="card-goods" v-model="checkedGoods">
			<van-checkbox
				class="card-goods__item"
				v-for="product in products"
				:key="product.id"
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
					<div slot="footer">
						<van-button class="x-i-deleteBtn" size="normal" icon="delete" @click.stop="onClickDelete(product)" />
					</div>
				</van-card>
			</van-checkbox>
		</van-checkbox-group>
		<van-submit-bar
			:price="totalPrice"
			:disabled="!checkedGoods.length"
			:button-text="submitBarText"
			@submit="onSubmit"
		/>
	</div>
</template>

<script>
import { Checkbox, CheckboxGroup, Card, SubmitBar, Toast, Button } from 'vant';
import ShoppingCartService from '@/service/shopping_cart_service'

export default {
	components: {
		[Card.name]: Card,
		[Checkbox.name]: Checkbox,
		[SubmitBar.name]: SubmitBar,
		[CheckboxGroup.name]: CheckboxGroup,
		[Button.name]: Button
	},

	data() {
		return {
			checkedGoods: [],
			goods: [{
				id: '1',
				title: '进口香蕉',
				desc: '约250g，2根',
				price: 200,
				count: 1,
				thumb: 'https://img.yzcdn.cn/public_files/2017/10/24/2f9a36046449dafb8608e99990b3c205.jpeg'
			}, {
				id: '2',
				title: '陕西蜜梨',
				desc: '约600g',
				price: 690,
				count: 1,
				thumb: 'https://img.yzcdn.cn/public_files/2017/10/24/f6aabd6ac5521195e01e8e89ee9fc63f.jpeg'
			}, {
				id: '3',
				title: '美国伽力果',
				desc: '约680g/3个',
				price: 2680,
				count: 1,
				thumb: 'https://img.yzcdn.cn/public_files/2017/10/24/320454216bbe9e25c7651e1fa51b31fd.jpeg'
			}],
			products: []
		};
	},

	computed: {
		submitBarText() {
			const count = this.checkedGoods.length;
			return '结算' + (count ? `(${count})` : '');
		},

		totalPrice() {
			let price = this.products.reduce((total, item) => total + (this.checkedGoods.indexOf(item.id) !== -1 ? item.price*item.purchase_count : 0), 0);
			return price * 100;
		}
	},

	mounted() {
		setTimeout(async () => {
			this.products = await ShoppingCartService.getProducts();
			this.checkedGoods = this.products.map(product => {
				return product.id;
			})
		})
	},

	methods: {
		formatPrice(price) {
			return price.toFixed(2);
		},

		onSubmit() {
			Toast('点击结算');
		},

		async onClickDelete(product) {
			let isSuccess = await ShoppingCartService.deleteProduct(product.shopping_cart_item_id);
			console.log(isSuccess);
			if (isSuccess) {
				this.products = this.products.filter(oneProduct => {
					return oneProduct.id != product.id;
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
