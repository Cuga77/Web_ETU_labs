import {createRouter, createWebHashHistory} from 'vue-router';

const routes = [
    {
        path: '/', name: 'StartPage',
        component: () => import('./components/StartPage.vue'),
    },
    {
        path: "/admin", name: 'AdminPanel',
        component: () => import('./components/AdminPanel.vue')
    },
    {
        path: "/exchange", name: 'StockExchange',
        component: () => import('./components/Exchange.vue'),
    },
    {
        path: "/login", name: 'LoginComponent',
        component: () => import('./components/Login.vue'),
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;