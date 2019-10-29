<template>
  <div id="app">
	<home-button />
    <router-view />
  </div>
</template>

<script>
import HomeButton from '@/component/home_button';

export default {
	components: {
		'home-button': HomeButton
	},

	data() {
		return {
		}
	},

	computed: {
	},

	methods: {
	}
}
</script>

<style>
body {
  font-size: 16px;
  background-color: #f8f8f8;
  -webkit-font-smoothing: antialiased;

}
</style>
