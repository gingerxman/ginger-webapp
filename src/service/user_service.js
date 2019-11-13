import { Resource } from '@/lib/resource';
import Service from './service'
import Vue from 'vue'

class UserService extends Service {
	constructor() {
		super();
		this.user = null;
	}

	reset() {
		super.reset();
	}

	async getAllUsers() {
		try {
			let resp = await Resource.get({
				resource: 'ginger-account:dev.users',
				data: {}
			})

			return resp.data.users.filter(user => user.name.indexOf("corp_") == -1);
		} catch(e) {
			console.error(e)
			return []
		}
	}

	async login(user, corpId) {
		try {
			let resp = await Resource.put({
				resource: 'ginger-account:login.logined_mall_user',
				data: {
					unionid: user.unionid,
					name: user.name,
					avatar: user.avatar,
					corp_id: corpId
				}
			})

			return resp.data;
		} catch(e) {
			console.error(e)
			return null
		}
	}

	setUser(user) {
		this.user = user;
		Vue.ls.set("_user", JSON.stringify(this.user))
	}

	getUser() {
		if (this.user == null) {
			this.user = JSON.parse(Vue.ls.get("_user"))
		}

		return this.user;
	}
}

let service = new UserService();

export default service;
