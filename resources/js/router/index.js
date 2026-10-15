import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '@/pages/MainPage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import RegisterPage from '@/pages/RegisterPage.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: MainPage,
    },
    {
        path: '/dashboard',
        redirect: '/',
    },
    {
        path: '/login',
        name: 'login',
        component: LoginPage,
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterPage,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
