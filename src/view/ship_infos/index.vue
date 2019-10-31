<template>
	<div class="page x-page-shipInfos">
		<van-nav-bar
			title="我的收货地址"
			left-text="返回"
			left-arrow
			@click-left="onClickLeft"
		/>

		<van-address-list
			v-if="addresses"
			v-model="chosenAddressId"
			:list="addresses"
			:disabled-list="disabledList"
			disabled-text=""
			:switchable="switchable"
			@add="onClickAdd"
			@edit="onClickEdit"
			@select="onClickSelect"
		>
		</van-address-list>
	</div>
</template>

<script>
import { Row, Col, Icon, Cell, CellGroup, AddressList, NavBar } from 'vant';
import UserService from '@/service/user_service'
import MallService from '@/service/mall_service'
import Vue from 'vue'

export default {
	components: {
		[Row.name]: Row,
		[Col.name]: Col,
		[Icon.name]: Icon,
		[Cell.name]: Cell,
		[CellGroup.name]: CellGroup,
		[AddressList.name]: AddressList,
		[NavBar.name]: NavBar
	},

	data () {
		let user = UserService.getUser()
		
		return {
			mode: 'edit',
			user: user,
			switchable: true,
			chosenAddressId: '',
			addresses: null,
			disabledList: null
		}
	},

	mounted() {
		setTimeout(async () => {
			// this.switchable = this.$route.query.switchable || false;
			this.mode = this.$route.query.mode || 'edit';
			let shipInfos = await MallService.getShipInfos()
			this.addresses = shipInfos.map(shipInfo => {
				if (shipInfo.is_default) {
					this.chosenAddressId = ''+shipInfo.id;
				}
				return {
					id: ''+shipInfo.id,
					name: shipInfo.name,
					address: `${shipInfo.area} ${shipInfo.address}`,
					tel: shipInfo.phone
				}
			})
		})
	},

	methods: {
		onClickLeft() {
			this.$router.go(-1)
		},

		onClickAdd() {
			this.$router.push({
				path: '/ship_info'
			})
		},

		onClickEdit(item) {
			this.$router.push({
				path: '/ship_info',
				query: {
					id: item.id
				}
			})
		},

		onClickSelect(item) {
			console.log(item)
			if (this.mode == 'select') {
				Vue.ls.set("__shipInfoId", item.id)
				this.$router.go(-1)
			}
		}
	}
};
</script>

<style lang="less">
.x-page-shipInfos {
	
}
</style>
