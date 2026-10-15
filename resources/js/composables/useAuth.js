import { ref, computed } from 'vue';
import api from '@/services/api';

const user = ref(null);
const token = ref(localStorage.getItem('auth_token') || null);
const loading = ref(false);
const initialFetchDone = ref(false);

export function useAuth() {
    const isAuthenticated = computed(() => !!token.value);

    async function fetchUser() {
        if (!token.value) {
            user.value = null;
            initialFetchDone.value = true;
            return null;
        }

        try {
            loading.value = true;
            const { data } = await api.get('/user');
            user.value = data;
            return data;
        } catch (err) {
            // Token is invalid or expired
            token.value = null;
            user.value = null;
            localStorage.removeItem('auth_token');
            return null;
        } finally {
            loading.value = false;
            initialFetchDone.value = true;
        }
    }

    async function logout() {
        try {
            if (token.value) {
                await api.post('/logout').catch(() => {});
            }
        } finally {
            token.value = null;
            user.value = null;
            localStorage.removeItem('auth_token');
        }
    }

    function setAuth(newToken, newUser) {
        token.value = newToken;
        user.value = newUser;
        if (newToken) {
            localStorage.setItem('auth_token', newToken);
        } else {
            localStorage.removeItem('auth_token');
        }
    }

    return {
        user,
        token,
        loading,
        initialFetchDone,
        isAuthenticated,
        fetchUser,
        logout,
        setAuth,
    };
}
