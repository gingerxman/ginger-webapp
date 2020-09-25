<template>
	<div class="x-productCard">  
		<div class="x-i-card">
			<a @click="onClickProduct(product)">
				<div class="x-i-rate-box">
					<div class="x-i-rate-box-skeleton" style="margin-top: 100%;"></div>
					<div class="x-i-rate-box-body">
						<img class="x-i-image" :src="product.base_info.thumbnail">
					</div>
				</div>
				<div class="x-i-title">{{product.base_info.name}}</div>
				<h2 class="x-i-promotionTitle">{{product.base_info.promotion_title}}</h2>
			</a>
			<div class="x-i-bottomBar">
        <div class="left">
          <div class="x-i-price">{{formatPrice}}</div>
          <span class="x-i-sales">已售: {{product.sold_count}}</span>
        </div>
        <div class="right">
          <van-icon name="shopping-cart-o" style="font-size:20px;"/>
        </div>
			</div>
		</div>
	</div>
</template>


<script>
import {
	Icon
} from 'vant';

export default {
  name: 'product-card',
  
  components: {
		[Icon.name]: Icon,
  },
  
	props: {
		product: {
			type: Object,
			default: null
		}
	},

	data () {
		return {
		}
	},

	mounted () {
	},

	computed: {
		formatPrice() {
			return '¥' + (this.product.skus[0].price / 100).toFixed(2);
		},
	},

	methods: {
		onClickProduct(product) {
			this.$router.push({
				path: '/product',
				query: {
					id: product.id
				}
			})
		}
	}
}
</script>

<style lang="less">
.x-productCard {
	background-color: #fff;
	border: 0 solid #ddd;
	position: relative;    
	width: 50%;
	margin-bottom: 5px;

	.x-i-card {
		box-shadow: 0 1px 2px rgba(0,0,0,.2);
		border-radius: 0px;
		padding: 8px 8px 0 8px;
		display: block;

		a {
			display: block;
			width: 100%;
			text-decoration: none;
		}

		.x-i-title {
			color: #312d29;
			padding: 5px 0 0 0;
			margin: 0;
			font-weight: 400;
			font-size: 13px;
			overflow: hidden;
			height: 18px;
			line-height: 18px;
			border-bottom: 0;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			word-break: break-all;
			word-wrap: break-word;
			-webkit-box-orient: vertical;
		}

		.x-i-rate-box {
			position: relative;
			overflow: hidden;

			.x-i-rate-box-skeleton {
				display: block;
				margin-top: 100%;
			}
			.x-i-rate-box-body {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;

				.x-i-image {
					height: 100%;
					width: 100%;
					border-radius: 4px;
				}
			}
		}

		.x-i-bottomBar {
			font-size: 15px;
			height: 36px;
      line-height: 36px;
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;

      .left {
        flex: 1;
        .x-i-price {
          display: inline-block;
          color: #FF5613;
          font-weight: bold;
        }

        .x-i-sales {
          font-size: 13px;
          margin-left: 15px;
        }
      }

      .right {
        height: 33px;
      }
		}
		.x-i-promotionTitle {
			font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Helvetica, Arial,
			"Hiragino Sans GB", "Source Han Sans", "Noto Sans CJK Sc", "Microsoft YaHei", "Microsoft Jhenghei", sans-serif;
			font-size: 0.7rem;
			font-weight: normal;
			text-align: left;
			color: #FE916D;
			margin: 0;
			padding: 0;
			margin-right: 20px;
			height: 15px;
		}
	}
}
</style>