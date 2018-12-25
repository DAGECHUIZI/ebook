import Vue from 'vue'
import Router from 'vue-router'
import ebook from '../ebook'
import homepage from '../homepage'

Vue.use(Router)

export default new Router({
routes: [
    {
        path: '/',
        redirect: '/homepage'
    },
    {
        path: '/ebook',
        name: 'ebook',
        component: ebook
    },
    {
        path: '/homepage',
        name: 'homepage',
        component: homepage
    }

]
})
