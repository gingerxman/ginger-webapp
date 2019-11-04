<template>
<div class="x-page-paymentResult">
	<h2>支付成功</h2>
	<div class="x-i-actions">
		<van-button plain hairline square type="primary" to="/mall">继续逛逛</van-button>
		<van-button plain hairline square type="primary" to="/orders">查看订单</van-button>
	</div>
</div>
</template>

<script>
import {
	Button,
	Notify,
	Toast
} from 'vant';

export default {
	components: {
		[Button.name]: Button,
		[Notify.name]: Notify,
		[Toast.name]: Toast
	},

	computed: {
	},

	data() {
		let bid = this.$route.query.bid;
		return {
			bid: bid
		};
	},

	mounted() {
	},

	methods: {
	}
}
</script>

<style lang="less">
.x-page-paymentResult {
	padding-top: 100px;

	h2 {
		text-align: center;
	}

	.x-i-actions {
		margin-top: 50px;
		display: flex;
		justify-content: space-around;
		padding: 0px 50px;
	}
}
</style>
