<template>
	<div class="page x-page-shipInfo">
		<van-nav-bar
			title="收货地址"
			left-text="返回"
			left-arrow
			@click-left="onClickLeft"
		/>

		<van-address-edit
			v-if="areaList"
			:area-list="areaList"
			:address-info="addressInfo"
			:show-delete="addressInfo.id ? true : false"
			show-set-default
			:area-columns-placeholder="columns"
			@save="onSave"
			@delete="onDelete"
			@change-default="onChangeDefault"
		/>
	</div>
</template>

<script>
import { AddressEdit, NavBar, Notify, Toast } from 'vant';
import UserService from '@/service/user_service'
import MallService from '@/service/mall_service'
import AreaService from '@/service/area_service'

export default {
	components: {
		[NavBar.name]: NavBar,
		[AddressEdit.name]: AddressEdit,
	},

	data () {
		let user = UserService.getUser()

		let addressInfo = {
		}

		return {
			user: user,
			addressInfo: addressInfo,
			columns: ['请选择', '请选择', '请选择'],
			areaList: null
		}
	},

	mounted() {
		setTimeout(async () => {
			let shipInfoId = this.$route.query.id || 0;
			if (shipInfoId != 0) {
				let shipInfo = await MallService.getShipInfo(shipInfoId)
				this.addressInfo = {
					id: shipInfo.id,
					name: shipInfo.name,
					tel : shipInfo.phone,
					areaCode: shipInfo.area_code,
					addressDetail: shipInfo.address,
					isDefault: shipInfo.is_default
				}
			}
			this.areaList = await AreaService.getYouzanAreaList()
		})
	},

	methods: {
		onClickLeft() {
			this.$router.go(-1)
		},

		async createShipInfo(content) {
			let id = await MallService.createShipInfo(content.name, content.tel, content.areaCode, content.addressDetail)
			if (id != 0) {
				if (content.isDefault) {
					let isSuccess = await MallService.setDefaultShipInfo(id);
					if (isSuccess) {
						Notify({
							type: 'success',
							message: '创建成功',
							duration: 1000
						})
						setTimeout(() => {
							this.$router.go(-1)
						}, 1000)
					} else {
						Notify("创建失败")
					}
				} else {
					Notify({
						type: 'success',
						message: '创建成功',
						duration: 1000
					})
					setTimeout(() => {
						this.$router.go(-1)
					}, 1000)
				}
			} else {
				Notify("保存失败，请稍后重试")
			}
		},

		async updateShipInfo(content) {
			let isSuccess = await MallService.updateShipInfo(content.id, content.name, content.tel, content.areaCode, content.addressDetail)
			if (isSuccess) {
				Notify({
					type: 'success',
					message: '操作成功'
				})
			} else {
				Notify("操作失败，请稍后重试")
			}
		},

		async onSave(content) {
			if (content.id) {
				await this.updateShipInfo(content)
			} else {
				await this.createShipInfo(content)
			}
			console.log(content)
		},

		async onDelete() {
			await MallService.deleteShipInfo(this.addressInfo.id)
			Toast({
				duration: 1000,
				message: "删除成功"
			})
			setTimeout(() => {
				this.$router.go(-1)
			}, 1000)
		},

		async onChangeDefault(isSelect) {
			if (!this.addressInfo.id) {
				return
			}

			if (!isSelect) {
				this.addressInfo = {...this.addressInfo}
				Notify("您只能通过设置其他地址为默认地址，切换默认地址")
			} else {
				await MallService.setDefaultShipInfo(this.addressInfo.id)
				this.addressInfo = {
					...this.addressInfo,
					isDefault: true
				}
				Toast("设置默认地址成功")
			}
			console.log(isSelect)
		}
	}
};
</script>

<style lang="less">
.x-page-shipInfo {
	
}
</style>
