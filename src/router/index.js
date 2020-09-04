import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

import Layout from '@/layout';

const router = new Router({
    routes:[
    {
        path: '/',
        component: Layout,
        hidden: true,
    }
    ]
})
export default router;