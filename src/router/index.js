import Vue from 'vue'
import Router from 'vue-router'
import ebook from '../ebook'

Vue.use(Router)

export default new Router({
routes: [
    {
        path: '/',
        redirect: '/ebook'
    },
    {
        path: '/ebook',
        component: ebook
    }

]
})
