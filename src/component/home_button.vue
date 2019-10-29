<template>
	<div v-if="inDevMode" class="x-homeButton" @click="onClickGotoLoginPage()">H</div>
</template>

<script>
export default {
	components: {
	},

	data() {
        return {
            inDevMode: true //(window.location.href.indexOf('?mode=dev') != -1)
        }
	},

	computed: {
	},

	methods: {
		onClickGotoLoginPage() {
			this.$router.replace({
				path: '/dev-login'
			})
		}
	}
}
</script>

<style lang="less">
	.x-homeButton {
		width: 50px;
		height: 50px;
		line-height: 50px;
		border-radius: 50%;
		text-align:  center;
		background-color: rgba(0, 255, 0, 0.7);
		color: #FFF;
		font-size: 2em;
		position: fixed;
		top: 20px;
		right: 10px;
		z-index: 1000;
	}
</style>