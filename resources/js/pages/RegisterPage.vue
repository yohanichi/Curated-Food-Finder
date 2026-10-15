<template>
  <div class="auth-shell">
    <!-- Aside (mirrors login) -->
    <aside class="auth-aside" aria-hidden="true">
      <div class="aside-overlay" />
      <div class="aside-content">
        <div class="aside-logo">
          <svg class="fork-icon-lg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2v5a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V2M12 9v13M16 2c0 0 2 1.5 2 5s-2 5-2 5v9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div>
            <p class="aside-brand-label">CURATED FOOD FINDER</p>
            <p class="aside-tagline">Good food starts with a conversation.</p>
          </div>
        </div>
        <div class="aside-center">
          <h2 class="aside-heading">Join a community of<br><em>passionate food lovers.</em></h2>
          <p class="aside-body">Get personalized recommendations, discover hidden culinary gems, and build your own curated food map.</p>
        </div>
        <div class="aside-features">
          <div v-for="f in features" :key="f.label" class="aside-feature">
            <span class="aside-feature-icon">{{ f.icon }}</span>
            <span class="aside-feature-label">{{ f.label }}</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <main class="auth-main">
      <nav class="auth-nav">
        <a href="/" class="nav-logo">
          <span class="nav-fork">🍴</span>
          <span class="nav-brand">Curated<br><strong>Food Finder</strong></span>
        </a>
        <div class="nav-actions">
          <span class="nav-link-quiet">Already have an account?</span>
          <router-link to="/login" class="btn-outline-sm" id="nav-login-btn">Sign in</router-link>
        </div>
      </nav>

      <div class="login-card">
        <div class="card-header">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2v5a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V2M12 9v13M16 2c0 0 2 1.5 2 5s-2 5-2 5v9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <p class="card-eyebrow">CURATED FOOD FINDER</p>
          <h1 class="card-title">Start your<br><em>culinary journey.</em></h1>
          <p class="card-subtitle">Create your free account and discover curated food experiences tailored to your taste.</p>
        </div>

        <form id="register-form" class="login-form" @submit.prevent="handleRegister" novalidate>
          <transition name="fade">
            <div v-if="error" class="form-error-banner" role="alert">
              <svg viewBox="0 0 20 20" fill="currentColor" class="error-icon"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              {{ error }}
            </div>
          </transition>

          <div class="form-group" :class="{ 'has-error': fieldErrors.name }">
            <label for="reg-name" class="form-label">FULL NAME</label>
            <input id="reg-name" v-model="form.name" type="text" class="form-input" placeholder="Your name" autocomplete="name" />
            <span v-if="fieldErrors.name" class="field-error">{{ fieldErrors.name }}</span>
          </div>

          <div class="form-group" :class="{ 'has-error': fieldErrors.email }">
            <label for="reg-email" class="form-label">EMAIL ADDRESS</label>
            <input id="reg-email" v-model="form.email" type="email" class="form-input" placeholder="you@example.com" autocomplete="email" />
            <span v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</span>
          </div>

          <div class="form-group" :class="{ 'has-error': fieldErrors.password }">
            <label for="reg-password" class="form-label">PASSWORD</label>
            <div class="input-wrapper">
              <input id="reg-password" v-model="form.password" :type="showPassword ? 'text' : 'password'" class="form-input" placeholder="Min. 8 characters" autocomplete="new-password" />
              <button type="button" id="reg-toggle-pwd" class="input-suffix-btn" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
            <span v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</span>
          </div>

          <div class="form-group" :class="{ 'has-error': fieldErrors.password_confirmation }">
            <label for="reg-confirm" class="form-label">CONFIRM PASSWORD</label>
            <input id="reg-confirm" v-model="form.password_confirmation" type="password" class="form-input" placeholder="Repeat password" autocomplete="new-password" />
            <span v-if="fieldErrors.password_confirmation" class="field-error">{{ fieldErrors.password_confirmation }}</span>
          </div>

          <button id="create-account-btn" type="submit" class="btn-primary" :disabled="loading">
            <span v-if="loading" class="btn-spinner" />
            <span v-else>Create Account</span>
          </button>
        </form>

        <p class="card-footer-link">
          Already have an account?&nbsp;
          <router-link to="/login" id="card-login-link">Sign in</router-link>
        </p>

        <p class="legal-text">
          By signing up, you agree to our
          <a href="#" class="legal-link">Terms of Service</a>
          and
          <a href="#" class="legal-link">Privacy Policy</a>.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { setAuth } = useAuth();
const form = ref({ name: '', email: '', password: '', password_confirmation: '' });
const loading = ref(false);
const error = ref('');
const showPassword = ref(false);
const fieldErrors = ref({ name: '', email: '', password: '', password_confirmation: '' });

const features = [
  { icon: '🗺️', label: 'Personalized food maps' },
  { icon: '⭐', label: 'Expert curation & reviews' },
  { icon: '🔔', label: 'New spot alerts near you' },
];

async function handleRegister() {
  error.value = '';
  fieldErrors.value = { name: '', email: '', password: '', password_confirmation: '' };

  if (!form.value.name) fieldErrors.value.name = 'Name is required.';
  if (!form.value.email) fieldErrors.value.email = 'Email is required.';
  if (!form.value.password || form.value.password.length < 8) fieldErrors.value.password = 'Password must be at least 8 characters.';
  if (form.value.password !== form.value.password_confirmation) fieldErrors.value.password_confirmation = 'Passwords do not match.';
  if (Object.values(fieldErrors.value).some(Boolean)) return;

  loading.value = true;
  try {
    const { data } = await api.post('/register', form.value);
    setAuth(data.token, data.user);
    router.push('/');
  } catch (err) {
    const errors = err.response?.data?.errors;
    if (errors) {
      Object.keys(errors).forEach(k => { fieldErrors.value[k] = errors[k][0]; });
    } else {
      error.value = err.response?.data?.message || 'Registration failed.';
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Reuse the same styles as LoginPage via class names — they share the same structure */
.auth-shell { display: flex; min-height: 100vh; background: #faf8f5; font-family: 'Inter', sans-serif; }
.auth-aside { position: relative; display: none; width: 42%; background: #1a1008; overflow: hidden; }
@media (min-width: 960px) { .auth-aside { display: flex; } }
.aside-overlay { position: absolute; inset: 0; background: radial-gradient(ellipse at 20% 80%, rgba(139, 69, 19, 0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(180, 110, 40, 0.2) 0%, transparent 50%), linear-gradient(160deg, #1a1008 0%, #2c1a0a 50%, #1a1008 100%); }
.aside-overlay::after { content: ''; position: absolute; inset: 0; background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0); background-size: 32px 32px; }
.aside-content { position: relative; z-index: 1; display: flex; flex-direction: column; justify-content: space-between; padding: 48px 52px; width: 100%; }
.aside-logo { display: flex; align-items: center; gap: 16px; }
.fork-icon-lg { width: 40px; height: 40px; color: #c9903a; flex-shrink: 0; }
.aside-brand-label { font-size: 11px; font-weight: 600; letter-spacing: 0.18em; color: #c9903a; margin: 0 0 4px; }
.aside-tagline { font-family: 'Cormorant Garamond', serif; font-size: 15px; font-style: italic; color: rgba(255,255,255,0.5); margin: 0; }
.aside-center { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.aside-heading { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 600; line-height: 1.25; color: #fff; margin: 0 0 16px; }
.aside-heading em { color: #c9903a; font-style: italic; }
.aside-body { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.7; margin: 0; }
.aside-features { display: flex; flex-direction: column; gap: 12px; }
.aside-feature { display: flex; align-items: center; gap: 12px; }
.aside-feature-icon { font-size: 18px; }
.aside-feature-label { font-size: 13px; color: rgba(255,255,255,0.6); }
.auth-main { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 0 24px 32px; background: #faf8f5; min-height: 100vh; }
.auth-nav { width: 100%; max-width: 520px; display: flex; align-items: center; justify-content: space-between; padding: 24px 0; }
.nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; color: inherit; }
.nav-fork { font-size: 22px; }
.nav-brand { font-family: 'Cormorant Garamond', serif; font-size: 15px; line-height: 1.2; color: #2c1a0a; }
.nav-brand strong { font-weight: 700; }
.nav-actions { display: flex; align-items: center; gap: 12px; }
.nav-link-quiet { font-size: 13px; color: #8a7a6a; display: none; }
@media (min-width: 640px) { .nav-link-quiet { display: inline; } }
.btn-outline-sm { padding: 8px 20px; border-radius: 999px; border: 1.5px solid #8b4513; background: #8b4513; color: #fff; font-size: 13px; font-weight: 500; font-family: 'Inter', sans-serif; text-decoration: none; transition: background 0.2s; cursor: pointer; }
.btn-outline-sm:hover { background: #7a3b0f; }
.login-card { width: 100%; max-width: 480px; background: #fff; border-radius: 24px; padding: 44px 48px; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(44, 26, 10, 0.08), 0 0 0 1px rgba(0,0,0,0.04); margin-top: 8px; }
@media (max-width: 540px) { .login-card { padding: 32px 24px; } }
.card-header { text-align: center; margin-bottom: 28px; }
.card-icon { width: 48px; height: 48px; margin: 0 auto 16px; color: #8b4513; }
.card-icon svg { width: 100%; height: 100%; }
.card-eyebrow { font-size: 10px; font-weight: 600; letter-spacing: 0.18em; color: #c9903a; margin: 0 0 10px; }
.card-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 600; line-height: 1.2; color: #1a0e04; margin: 0 0 12px; }
.card-title em { font-style: italic; color: #8b4513; }
.card-subtitle { font-size: 13.5px; color: #8a7a6a; line-height: 1.6; margin: 0; }
.login-form { display: flex; flex-direction: column; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 10.5px; font-weight: 600; letter-spacing: 0.12em; color: #7a6a5a; }
.input-wrapper { position: relative; display: flex; align-items: center; }
.form-input { width: 100%; padding: 13px 16px; border-radius: 12px; border: 1.5px solid #e8e0d5; background: #fdfcfb; font-size: 14px; font-family: 'Inter', sans-serif; color: #2c1a0a; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
.form-input::placeholder { color: #c0b4a8; }
.form-input:focus { border-color: #c9903a; box-shadow: 0 0 0 3px rgba(201, 144, 58, 0.12); background: #fff; }
.has-error .form-input { border-color: #c0392b; box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.08); }
.input-suffix-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: none; background: none; cursor: pointer; color: #b0a090; padding: 0; transition: color 0.2s; }
.input-suffix-btn svg { width: 17px; height: 17px; }
.input-suffix-btn:hover { color: #8b4513; }
.field-error { font-size: 12px; color: #c0392b; }
.form-error-banner { display: flex; align-items: center; gap: 8px; padding: 11px 14px; border-radius: 10px; background: #fdf2f2; border: 1px solid #f5c6c6; font-size: 13px; color: #c0392b; }
.error-icon { width: 16px; height: 16px; flex-shrink: 0; }
.btn-primary { width: 100%; padding: 15px; border-radius: 12px; border: none; background: #8b4513; color: #fff; font-size: 15px; font-weight: 600; font-family: 'Inter', sans-serif; letter-spacing: 0.02em; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 4px; transition: background 0.2s, box-shadow 0.2s, transform 0.1s; }
.btn-primary:hover:not(:disabled) { background: #7a3b0f; box-shadow: 0 4px 16px rgba(139, 69, 19, 0.3); transform: translateY(-1px); }
.btn-primary:active:not(:disabled) { transform: translateY(0); }
.btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
.btn-spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.card-footer-link { text-align: center; font-size: 13.5px; color: #8a7a6a; margin: 20px 0 0; }
.card-footer-link a { color: #8b4513; font-weight: 600; text-decoration: none; }
.card-footer-link a:hover { text-decoration: underline; }
.legal-text { text-align: center; font-size: 11.5px; color: #b0a090; margin: 14px 0 0; line-height: 1.6; }
.legal-link { color: #8a7a6a; text-decoration: underline; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
