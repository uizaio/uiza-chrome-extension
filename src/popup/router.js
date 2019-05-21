import Vue from 'vue'
import Router from "vue-router"

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'home',
        component: require('./components/Home.vue').default
    }, {
        path: '/test',
        name: 'test',
        component: require('./components/Test.vue').default
    }, {
        path: 'play/:type/:id',
        name: 'play',
        component: require('./components/Player.vue').default
    }]
    // eslint-disable-next-line eol-last
})