<template>
	<div class="page x-account-loginPage">
		<h2 :class="{'x-h2-active':('lala' == 'lala')}">金捷商城</h2>
		<div class="xui-i-users" v-if="mode == 'select-user'">
			<h1 class="x-i-head">1 - 选择手机用户</h1>
			<ul v-for="(member, index) in members" :key="index" class="item-icon-right" @click="onClickSelectUser(member)">
				<li class="xui-i-user">
					<img :src="member.avatar" width="50" class="mr10">{{member.name}}
					<i class="icon ion-ios-arrow-right" style="color: #DDD;"></i>
				</li>
			</ul>
		</div>
		<div class="xui-i-users" v-if="mode == 'select-corp'">
			<h1 class="x-i-head">2 - 进入商城</h1>
			<ul v-for="(corp, index) in corps" :key="index" class="item-icon-right" @click="onClickLogin(corp)">
				<li class="xui-i-user">
					<img src="http://resource.vxiaocheng.com/ginger/girls/bar.jpeg" width="50" class="mr10">
					{{corp.corp_user.name}}的{{corp.name}}商城
					<i class="icon ion-ios-arrow-right" style="color: #DDD;"></i>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import UserService from '@/service/user_service'
	import CorpService from '@/service/corp_service'
	import Vue from 'vue';

	export default {
		data () {
			return {
				title: '登录',
				members: [],
				corps: [],
				selectedMember: null,
				selectedCorp: null
			}
		},

		computed:{
			h2Class(info) {
				console.warn(info);
				return !this.isRobert ? "x-h2" : "x-h2-active";
			},

			mode() {
				if (!this.selectedMember) {
					return 'select-user';
				} else {
					return 'select-corp';
				}
			}
		},

		mounted () {
			this.$cookies.remove('_jwt');
			Vue.ls.clear();
			setTimeout(async () => {
				await this.loadMembers()
			})
		},

		methods: {
			async loadMembers () {
				this.members = await UserService.getAllUsers()
			},
			
			async loadCorps () {
				this.corps = await CorpService.getAllCorps()
			},

			onClickSelectUser(member) {
				this.selectedMember = member;
				setTimeout(async () => {
					this.loadCorps()
				})
			},
			
			onClickLogin(corp) {
				this.selectedCorp = corp;
				UserService.setUser(this.selectedMember)
				setTimeout(async () => {
					let resp = await UserService.login(this.selectedMember, this.selectedCorp.id)
					if (resp && resp.jwt) {
						Vue.ls.set("_jwt", resp.jwt)
					}

					this.$router.replace({
						path: '/mall'
					})
				})
			},

			onClickProductionLogin() {
				this.$router.push({
					path: '/account/login/', 
					query: {
					}
				});
			}
		}
	}
</script>

<style lang="less">
.x-account-loginPage {
	h2 {
		margin-top: 50px;
		color: #333;
		text-align: center;
	}

	.xui-i-users {
		background-color: #FFF;
		text-align: left;
		margin-top: 0px;
		padding-top: 10px;
		padding-bottom: 30px;

		.x-i-head {
			font-size: 1.5em;
			padding-left: 5px;
			color: #666;
		}

		ul {
			list-style: none;
			margin: 0;
			padding: 5px 10px;
			border-bottom: solid 1px #EFEFEF;
		}

		.xui-i-user {
			img {
				vertical-align: middle;
			}
		}
	}
}
</style>