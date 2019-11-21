<template>
	<div class="page x-page-user">
		<div class="x-i-header">
			<div style="height:1px;"></div>
			<div class="x-i-avatarBox">
				<img :src="user.avatar" />
			</div>
			<div class="x-i-info">
				<div>{{user.name}}</div>
			</div>
		</div>
		<van-row class="user-links">
			<van-col span="6">
				<van-icon name="pending-payment" />
				待付款
			</van-col>
			<van-col span="6">
				<van-icon name="records" />
				待接单
			</van-col>
			<van-col span="6">
				<van-icon name="tosend" />
				待发货
			</van-col>
			<van-col span="6">
				<van-icon name="logistics" />
				已发货
			</van-col>
		</van-row>

		<van-cell-group class="user-group">
			<van-cell icon="records" title="全部订单" is-link to="/orders" />
		</van-cell-group>

		<van-cell-group>
			<van-cell icon="location-o" title="收货地址" is-link to="/ship_infos" />
			<van-cell icon="points" title="我的积分" is-link />
			<van-cell icon="gold-coin-o" title="我的优惠券" is-link />
			<van-cell icon="gift-o" title="我收到的礼物" is-link />
		</van-cell-group>

		<div class="x-i-logout">
			<van-button type="danger" size="small" to="/dev-login">退出登录</van-button>
		</div>

		<bottom-nav :active="3" />
	</div>
</template>

<script>
import { Row, Col, Icon, Cell, CellGroup, Button } from 'vant';
import BottomNav from '@/view/component/bottom_nav'
import UserService from '@/service/user_service'

export default {
	components: {
		[Row.name]: Row,
		[Col.name]: Col,
		[Icon.name]: Icon,
		[Cell.name]: Cell,
		[CellGroup.name]: CellGroup,
		[BottomNav.name]: BottomNav,
		[Button.name]: Button,
	},

	data () {
		let user = UserService.getUser()
		console.log(user)

		return {
			user: user
		}
	}
};
</script>

<style lang="less">
.x-page-user {
	.x-i-header {
		background-color: #E7270E;
		width: 100%;
		height: 53vw;

		.x-i-avatarBox {
			width: 80px;
			height: 80px;
			border: 3px solid #FFF;
			border-radius: 50%;
			margin: 14px auto;
			margin-top: 48px;
			overflow: hidden;
			text-align: center;

			img {
				width: 80px;
				height: 80px;
				border-radius: 50%;
				background-clip: padding-box;
			}
		}

		.x-i-info {
			color: #FFF;
			font-size: 1.1em;
			margin: 5px auto;
			width: 40px;
		}
	}

	.x-i-logout {
		margin-top:20px;
		text-align:center;

		.van-button {
			width: 90%;
		}
	}
}
.user {
	&-poster {
		width: 100%;
		height: 53vw;
		display: block;
	}

	&-group {
		margin-bottom: 15px;
	}

	&-links {
		padding: 15px 0;
		font-size: 12px;
		text-align: center;
		background-color: #fff;

		.van-icon {
			display: block;
			font-size: 24px;
		}
	}
}
</style>
