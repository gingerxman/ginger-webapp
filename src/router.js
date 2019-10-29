import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
  {
    path: '*',
    redirect: '/dev-login'
  },
  {
	name: 'dev-login',
	component: () => import('./view/login'),
	meta: {
		title: 'DevLogin'
	}
  },
  {
	name: 'mall',
	component: () => import('./view/mall'),
	meta: {
		title: '商城'
	}
  },
  {
    name: 'user',
    component: () => import('./view/user'),
    meta: {
      title: '会员中心'
    }
  },
  {
    name: 'cart',
    component: () => import('./view/cart'),
    meta: {
      title: '购物车'
    }
  },
  {
    name: 'products',
    component: () => import('./view/products'),
    meta: {
      title: '商品列表'
    }
  },
  {
    name: 'product',
    component: () => import('./view/product'),
    meta: {
      title: '商品详情'
    }
  }
];

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '');
});

const router = new Router({ routes });

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});

export {
  router
};
