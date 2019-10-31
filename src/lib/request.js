import Vue from 'vue'
import axios from 'axios'
import { VueAxios } from './axios'

// 创建 axios 实例
const service = axios.create({
  ///baseURL: "http://devapi.vxiaocheng.com", // process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 6000 // 请求超时时间
})

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    // const token = Vue.ls.get("_jwt")
    if (error.response.status === 403) {
      console.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      console.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
    //   if (token) {
    //     store.dispatch('Logout').then(() => {
    //       setTimeout(() => {
    //         window.location.reload()
    //       }, 1500)
    //     })
    //   }
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get("_jwt")
  if (token) {
    config.headers['AUTHORIZATION'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
	let respData = response.data;
	if (respData.code != 200) {
		return Promise.reject({
			errCode: respData.errCode,
			errMsg: respData.errMsg
		})
	} else {
		return respData
	}
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
