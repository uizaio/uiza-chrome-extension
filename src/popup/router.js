import Vue from 'vue'
import Router from "vue-router"
import Player from './components/Player.vue';

Vue.use(Router)

var router = new Router({
    // mode: 'hash',
    routes: [{
        path: '/',
        name: 'home',
        component: require('./components/Home.vue').default
    }, {
        path: 'banners',
        name: 'banners',
        component: require('./components/Banners.vue').default
    }, {
        path: '/test',
        name: 'test',
        component: require('./components/Test.vue').default
    }, {
        path: '/play/:type/:id',
        name: 'play',
        component: Player
    }]
    // eslint-disable-next-line eol-last
});

router.beforeEach((to, from, next) => {
    console.log('lala', to, from)
    next();
});

// eslint-disable-next-line eol-last
export default router;