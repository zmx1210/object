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
        children: [
            {
              path: 'JS/comObject',
              component: () => import('@/common/js/dataType/Object'),
              name: 'comObject',
              meta: { title: 'JS', icon: 'dashboard', affix: true }
            },{
              path: 'JS/comMap',
              component: () => import('@/common/js/dataType/Map'),
              name: 'comMap',
              meta: { title: 'JS', icon: 'dashboard', affix: true }
            },{
              path: 'CSS/table',
              component: () => import('@/common/css/table/index'),
              name: 'table',
            }
          ]
    }
    ]
})
export default router;