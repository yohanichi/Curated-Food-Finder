<template>
  <div class="auth-shell">

    <!-- ─── Left panel: ambient background ─── -->
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

        <div class="aside-quotes">
          <blockquote
            v-for="(q, i) in quotes"
            :key="i"
            class="aside-quote"
            :class="{ active: activeQuote === i }"
          >
            <p class="aside-quote-text">"{{ q.text }}"</p>
            <footer class="aside-quote-author">— {{ q.author }}</footer>
          </blockquote>
        </div>

        <div class="aside-dots">
          <span
            v-for="(_, i) in quotes"
            :key="i"
            class="aside-dot"
            :class="{ active: activeQuote === i }"
            @click="activeQuote = i"
          />
        </div>
      </div>
    </aside>

    <!-- ─── Right panel: login card ─── -->
    <main class="auth-main">

      <!-- Top nav -->
      <nav class="auth-nav">
        <a href="/" class="nav-logo">
          <span class="nav-fork">🍴</span>
          <span class="nav-brand">Curated<br><strong>Food Finder</strong></span>
        </a>
        <div class="nav-actions">
          <span class="nav-link-quiet">Don't have an account?</span>
          <router-link to="/register" class="btn-outline-sm" id="nav-signup-btn">Sign up</router-link>
        </div>
      </nav>

      <!-- Card -->
      <div class="login-card">

        <!-- Card header -->
        <div class="card-header">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2v5a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V2M12 9v13M16 2c0 0 2 1.5 2 5s-2 5-2 5v9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <p class="card-eyebrow">CURATED FOOD FINDER</p>
          <h1 class="card-title">Welcome back to<br><em>great taste.</em></h1>
          <p class="card-subtitle">
            Sign in to access your saved <span class="accent-text">culinary recommendations</span>,
            neighborhood spots, and personalized taste profile.
          </p>
        </div>

        <!-- Social auth -->
        <div class="social-auth">
          <button id="google-login-btn" class="social-btn" type="button" @click="socialLogin('google')">
            <svg class="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <button id="apple-login-btn" class="social-btn" type="button" @click="socialLogin('apple')">
            <svg class="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="currentColor"/>
            </svg>
            Continue with Apple
          </button>
        </div>

        <!-- Divider -->
        <div class="divider">
          <span>or continue with email</span>
        </div>

        <!-- Login form -->
        <form id="login-form" class="login-form" @submit.prevent="handleLogin" novalidate>
          <!-- Global error -->
          <transition name="fade">
            <div v-if="error" class="form-error-banner" role="alert">
              <svg viewBox="0 0 20 20" fill="currentColor" class="error-icon"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              {{ error }}
            </div>
          </transition>

          <!-- Email field -->
          <div class="form-group" :class="{ 'has-error': fieldErrors.email }">
            <label for="email" class="form-label">EMAIL ADDRESS</label>
            <div class="input-wrapper">
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-input"
                placeholder="curator@epicure.com"
                autocomplete="email"
                @blur="validateEmail"
              />
            </div>
            <span v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</span>
          </div>

          <!-- Password field -->
          <div class="form-group" :class="{ 'has-error': fieldErrors.password }">
            <label for="password" class="form-label">PASSWORD</label>
            <div class="input-wrapper">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="••••••••••••"
                autocomplete="current-password"
              />
              <button
                type="button"
                id="toggle-password-btn"
                class="input-suffix-btn"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
            <span v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</span>
          </div>

          <!-- Remember + Forgot -->
          <div class="form-row">
            <label class="checkbox-label" for="remember-me">
              <input id="remember-me" v-model="form.remember" type="checkbox" class="checkbox-input" />
              <span class="checkbox-custom" />
              <span class="checkbox-text">Remember me</span>
            </label>
            <a href="#" id="forgot-password-link" class="forgot-link" @click.prevent="handleForgotPassword">
              Forgot password?
            </a>
          </div>

          <!-- Submit -->
          <button
            id="signin-btn"
            type="submit"
            class="btn-primary"
            :disabled="loading"
          >
            <span v-if="loading" class="btn-spinner" />
            <span v-else>Sign In</span>
          </button>
        </form>

        <!-- Sign up link -->
        <p class="card-footer-link">
          Don't have an account?&nbsp;
          <router-link to="/register" id="card-signup-link">Sign up</router-link>
        </p>

        <!-- Legal -->
        <p class="legal-text">
          By signing in, you agree to our
          <a href="#" class="legal-link">Terms of Service</a>
          and
          <a href="#" class="legal-link">Privacy Policy</a>.
        </p>
      </div>

      <!-- Currently curating ticker -->
      <div class="curating-ticker">
        <span class="ticker-dot" />
        <span class="ticker-label">Currently curating:</span>
        <span class="ticker-content">{{ tickerItems[tickerIndex] }}</span>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { setAuth } = useAuth();

// ─── Form state ───────────────────────────────────────────────────────────────
const form = ref({ email: '', password: '', remember: false });
const loading = ref(false);
const error = ref('');
const showPassword = ref(false);
const fieldErrors = ref({ email: '', password: '' });

// ─── Validation ───────────────────────────────────────────────────────────────
function validateEmail() {
  if (!form.value.email) {
    fieldErrors.value.email = 'Email is required.';
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    fieldErrors.value.email = 'Please enter a valid email address.';
  } else {
    fieldErrors.value.email = '';
  }
}

function validateForm() {
  validateEmail();
  if (!form.value.password) {
    fieldErrors.value.password = 'Password is required.';
  } else {
    fieldErrors.value.password = '';
  }
  return !fieldErrors.value.email && !fieldErrors.value.password;
}

// ─── Login handler ────────────────────────────────────────────────────────────
async function handleLogin() {
  error.value = '';
  if (!validateForm()) return;

  loading.value = true;
  try {
    const { data } = await api.post('/login', {
      email: form.value.email,
      password: form.value.password,
      remember: form.value.remember,
    });
    setAuth(data.token, data.user);
    router.push('/');
  } catch (err) {
    const msg = err.response?.data?.message
      || err.response?.data?.errors?.email?.[0]
      || 'Login failed. Please try again.';
    error.value = msg;
  } finally {
    loading.value = false;
  }
}

// ─── Social login placeholder ─────────────────────────────────────────────────
function socialLogin(provider) {
  window.location.href = `/auth/${provider}/redirect`;
}

// ─── Forgot password ──────────────────────────────────────────────────────────
async function handleForgotPassword() {
  if (!form.value.email) {
    fieldErrors.value.email = 'Enter your email above first.';
    return;
  }
  try {
    await api.post('/forgot-password', { email: form.value.email });
    error.value = '';
    alert(`Password reset link sent to ${form.value.email}`);
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not send reset link.';
  }
}

// ─── Aside quotes ─────────────────────────────────────────────────────────────
const quotes = [
  { text: 'The discovery of a new dish does more for human happiness than the discovery of a new star.', author: 'Jean Anthelme Brillat-Savarin' },
  { text: 'One cannot think well, love well, sleep well, if one has not dined well.', author: 'Virginia Woolf' },
  { text: 'Food is not rational. Food is culture, habit, craving and identity.', author: 'Jonathan Safran Foer' },
];
const activeQuote = ref(0);
let quoteTimer = null;
onMounted(() => {
  quoteTimer = setInterval(() => {
    activeQuote.value = (activeQuote.value + 1) % quotes.length;
  }, 5000);
});
onUnmounted(() => clearInterval(quoteTimer));

// ─── Curating ticker ──────────────────────────────────────────────────────────
const tickerItems = [
  'Osteria Nonna & Natural Wines • Rome',
  'Gaggan Anand Tasting Menu • Bangkok',
  'Noma Pop-Up Residency • Copenhagen',
  'Atelier Crenn Omakase • San Francisco',
  'Single Thread Farm Dinner • Healdsburg',
];
const tickerIndex = ref(0);
let tickerTimer = null;
onMounted(() => {
  tickerTimer = setInterval(() => {
    tickerIndex.value = (tickerIndex.value + 1) % tickerItems.length;
  }, 3500);
});
onUnmounted(() => clearInterval(tickerTimer));
</script>

<style scoped>
/* ─── Shell ─────────────────────────────────────────────────────────────────── */
.auth-shell {
  display: flex;
  min-height: 100vh;
  background: #faf8f5;
  font-family: 'Inter', sans-serif;
}

/* ─── Aside ─────────────────────────────────────────────────────────────────── */
.auth-aside {
  position: relative;
  display: none;
  width: 42%;
  background: #1a1008;
  overflow: hidden;
}

@media (min-width: 960px) {
  .auth-aside { display: flex; }
}

.aside-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 80%, rgba(139, 69, 19, 0.35) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(180, 110, 40, 0.2) 0%, transparent 50%),
    linear-gradient(160deg, #1a1008 0%, #2c1a0a 50%, #1a1008 100%);
}

/* Decorative food pattern overlay */
.aside-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0);
  background-size: 32px 32px;
}

.aside-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px 52px;
  width: 100%;
}

.aside-logo {
  display: flex;
  align-items: center;
  gap: 16px;
}

.fork-icon-lg {
  width: 40px;
  height: 40px;
  color: #c9903a;
  flex-shrink: 0;
}

.aside-brand-label {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  color: #c9903a;
  margin: 0 0 4px;
}

.aside-tagline {
  font-family: 'Cormorant Garamond', serif;
  font-size: 15px;
  font-style: italic;
  color: rgba(255,255,255,0.5);
  margin: 0;
}

.aside-quotes {
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
  min-height: 200px;
}

.aside-quote {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.7s ease, transform 0.7s ease;
  pointer-events: none;
  margin: 0;
}

.aside-quote.active {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.aside-quote-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 26px;
  font-weight: 500;
  line-height: 1.4;
  color: #fff;
  margin: 0 0 20px;
}

.aside-quote-author {
  font-size: 13px;
  color: rgba(255,255,255,0.45);
  letter-spacing: 0.06em;
}

.aside-dots {
  display: flex;
  gap: 8px;
}

.aside-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  cursor: pointer;
  transition: background 0.3s, width 0.3s;
}

.aside-dot.active {
  background: #c9903a;
  width: 20px;
  border-radius: 3px;
}

/* ─── Main ──────────────────────────────────────────────────────────────────── */
.auth-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 24px 32px;
  background: #faf8f5;
  min-height: 100vh;
}

/* ─── Nav ───────────────────────────────────────────────────────────────────── */
.auth-nav {
  width: 100%;
  max-width: 520px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
}

.nav-fork {
  font-size: 22px;
}

.nav-brand {
  font-family: 'Cormorant Garamond', serif;
  font-size: 15px;
  line-height: 1.2;
  color: #2c1a0a;
}

.nav-brand strong {
  font-weight: 700;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-link-quiet {
  font-size: 13px;
  color: #8a7a6a;
  display: none;
}
@media (min-width: 640px) { .nav-link-quiet { display: inline; } }

.btn-outline-sm {
  padding: 8px 20px;
  border-radius: 999px;
  border: 1.5px solid #8b4513;
  background: #8b4513;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
  cursor: pointer;
}

.btn-outline-sm:hover {
  background: #7a3b0f;
}

/* ─── Card ──────────────────────────────────────────────────────────────────── */
.login-card {
  width: 100%;
  max-width: 480px;
  background: #fff;
  border-radius: 24px;
  padding: 44px 48px;
  box-shadow:
    0 1px 3px rgba(0,0,0,0.04),
    0 8px 32px rgba(44, 26, 10, 0.08),
    0 0 0 1px rgba(0,0,0,0.04);
  margin-top: 8px;
}

@media (max-width: 540px) {
  .login-card { padding: 32px 24px; }
}

/* ─── Card header ───────────────────────────────────────────────────────────── */
.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.card-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  color: #8b4513;
}

.card-icon svg {
  width: 100%;
  height: 100%;
}

.card-eyebrow {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.18em;
  color: #c9903a;
  margin: 0 0 10px;
}

.card-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.2;
  color: #1a0e04;
  margin: 0 0 12px;
}

.card-title em {
  font-style: italic;
  color: #8b4513;
}

.card-subtitle {
  font-size: 13.5px;
  color: #8a7a6a;
  line-height: 1.6;
  margin: 0;
}

.accent-text {
  color: #c9903a;
  font-style: italic;
}

/* ─── Social auth ───────────────────────────────────────────────────────────── */
.social-auth {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 13px 20px;
  border-radius: 12px;
  border: 1.5px solid #e8e0d5;
  background: #fff;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  color: #2c1a0a;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.social-btn:hover {
  background: #faf8f5;
  border-color: #d0c4b0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.social-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* ─── Divider ───────────────────────────────────────────────────────────────── */
.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e8e0d5;
}

.divider span {
  font-size: 12px;
  color: #b0a090;
  white-space: nowrap;
  letter-spacing: 0.02em;
}

/* ─── Form ──────────────────────────────────────────────────────────────────── */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: #7a6a5a;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: 13px 16px;
  border-radius: 12px;
  border: 1.5px solid #e8e0d5;
  background: #fdfcfb;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  color: #2c1a0a;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input::placeholder {
  color: #c0b4a8;
}

.form-input:focus {
  border-color: #c9903a;
  box-shadow: 0 0 0 3px rgba(201, 144, 58, 0.12);
  background: #fff;
}

.has-error .form-input {
  border-color: #c0392b;
  box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.08);
}

.input-suffix-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  color: #b0a090;
  padding: 0;
  transition: color 0.2s;
}

.input-suffix-btn svg {
  width: 17px;
  height: 17px;
}

.input-suffix-btn:hover {
  color: #8b4513;
}

.field-error {
  font-size: 12px;
  color: #c0392b;
}

/* ─── Form error banner ──────────────────────────────────────────────────────── */
.form-error-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 14px;
  border-radius: 10px;
  background: #fdf2f2;
  border: 1px solid #f5c6c6;
  font-size: 13px;
  color: #c0392b;
}

.error-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* ─── Form row ──────────────────────────────────────────────────────────────── */
.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 17px;
  height: 17px;
  border-radius: 5px;
  border: 1.5px solid #d0c4b0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s, background 0.2s;
  flex-shrink: 0;
}

.checkbox-input:checked + .checkbox-custom {
  background: #8b4513;
  border-color: #8b4513;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '';
  display: block;
  width: 5px;
  height: 9px;
  border: 2px solid #fff;
  border-top: none;
  border-left: none;
  transform: rotate(45deg) translateY(-1px);
}

.checkbox-text {
  font-size: 13px;
  color: #6a5a4a;
}

.forgot-link {
  font-size: 13px;
  color: #8b4513;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #c9903a;
  text-decoration: underline;
}

/* ─── Primary button ─────────────────────────────────────────────────────────── */
.btn-primary {
  width: 100%;
  padding: 15px;
  border-radius: 12px;
  border: none;
  background: #8b4513;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.02em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 4px;
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
}

.btn-primary:hover:not(:disabled) {
  background: #7a3b0f;
  box-shadow: 0 4px 16px rgba(139, 69, 19, 0.3);
  transform: translateY(-1px);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ─── Card footer ────────────────────────────────────────────────────────────── */
.card-footer-link {
  text-align: center;
  font-size: 13.5px;
  color: #8a7a6a;
  margin: 20px 0 0;
}

.card-footer-link a {
  color: #8b4513;
  font-weight: 600;
  text-decoration: none;
}

.card-footer-link a:hover {
  text-decoration: underline;
}

.legal-text {
  text-align: center;
  font-size: 11.5px;
  color: #b0a090;
  margin: 14px 0 0;
  line-height: 1.6;
}

.legal-link {
  color: #8a7a6a;
  text-decoration: underline;
}

/* ─── Curating ticker ────────────────────────────────────────────────────────── */
.curating-ticker {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 28px;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(255,255,255,0.7);
  border: 1px solid rgba(0,0,0,0.06);
  backdrop-filter: blur(8px);
  font-size: 13px;
}

.ticker-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #c9903a;
  flex-shrink: 0;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.85); }
}

.ticker-label {
  color: #8a7a6a;
  font-weight: 500;
  white-space: nowrap;
}

.ticker-content {
  color: #2c1a0a;
  font-weight: 500;
  font-style: italic;
  font-family: 'Cormorant Garamond', serif;
  font-size: 14.5px;
  transition: opacity 0.5s;
}

/* ─── Transitions ────────────────────────────────────────────────────────────── */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
