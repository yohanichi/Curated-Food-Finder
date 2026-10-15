<template>
  <div class="app-layout">
    <!-- ─── Collapsible Sidebar ──────────────────────────────────────────────── -->
    <aside
      class="sidebar"
      :class="{ 'sidebar-collapsed': isSidebarCollapsed }"
      aria-label="Sidebar navigation"
    >
      <div class="sidebar-inner">
        <!-- Top: Brand Header -->
        <div class="sidebar-header">
          <div class="brand-badge" @click="handleNewChat" role="button" tabindex="0" title="Curated Food Finder Home">
            <svg class="fork-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2v5a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V2M12 9v13M16 2c0 0 2 1.5 2 5s-2 5-2 5v9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="brand-text" v-if="!isSidebarCollapsed">
            <span class="brand-title">Curated</span>
            <span class="brand-subtitle">Food Finder</span>
          </div>
        </div>

        <!-- New Chat Pill Button -->
        <button
          id="new-chat-btn"
          class="new-chat-btn"
          @click="handleNewChat"
          :title="isSidebarCollapsed ? 'New chat' : ''"
        >
          <svg class="new-chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <span v-if="!isSidebarCollapsed" class="new-chat-label">New chat</span>
        </button>

        <!-- Recent conversations list / Saved spots -->
        <div class="sidebar-content" v-if="!isSidebarCollapsed">
          <div class="recent-section">
            <p class="recent-header">RECENT EXPLORATIONS</p>
            <div class="recent-list">
              <button
                v-for="item in recentSearches"
                :key="item.id"
                class="recent-item"
                :class="{ 'recent-active': activeSearchId === item.id }"
                @click="loadSearch(item)"
              >
                <span class="recent-icon">{{ item.icon }}</span>
                <span class="recent-text">{{ item.query }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Sidebar Bottom Footer -->
        <div class="sidebar-footer">
          <!-- Settings button -->
          <button
            id="settings-btn"
            class="sidebar-nav-btn"
            @click="showSettingsModal = true"
            :title="isSidebarCollapsed ? 'Settings' : ''"
          >
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span v-if="!isSidebarCollapsed" class="nav-label">Settings</span>
          </button>

          <!-- Account button -->
          <button
            id="account-btn"
            class="sidebar-nav-btn"
            @click="handleAccountClick"
            :title="isSidebarCollapsed ? (isAuthenticated ? user?.name : 'Account') : ''"
          >
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span v-if="!isSidebarCollapsed" class="nav-label">
              {{ isAuthenticated ? (user?.name || 'Account') : 'Account' }}
            </span>
          </button>
        </div>
      </div>

      <!-- Sidebar Toggle Pill Button (floating on right edge of sidebar) -->
      <button
        id="sidebar-toggle-btn"
        class="sidebar-toggle-btn"
        @click="toggleSidebar"
        :aria-label="isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        :title="isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      >
        <svg v-if="!isSidebarCollapsed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </aside>

    <!-- ─── Main Content Area ────────────────────────────────────────────────── -->
    <main class="main-content">
      <!-- Top Navigation Bar -->
      <header class="top-nav">
        <div class="top-nav-left">
          <!-- Mobile toggle button if needed -->
          <button class="mobile-menu-btn" @click="toggleSidebar" aria-label="Toggle menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="top-nav-right">
          <!-- When Logged Out: Show Login and Sign up -->
          <template v-if="!isAuthenticated">
            <router-link to="/login" class="nav-link-login" id="nav-login-link">
              Login
            </router-link>
            <router-link to="/register" class="btn-signup" id="nav-signup-link">
              Sign up
            </router-link>
          </template>

          <!-- When Logged In: Show User profile & Dropdown -->
          <div v-else class="user-profile-menu" ref="userMenuRef">
            <button
              id="user-profile-btn"
              class="user-profile-btn"
              @click="isUserMenuOpen = !isUserMenuOpen"
              aria-haspopup="true"
              :aria-expanded="isUserMenuOpen"
            >
              <div class="user-avatar" :style="{ backgroundColor: getAvatarColor(user?.name) }">
                {{ getUserInitials(user?.name) }}
              </div>
              <span class="user-name">{{ user?.name || 'My Account' }}</span>
              <svg class="dropdown-chevron" :class="{ 'chevron-rotate': isUserMenuOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <!-- User Dropdown Menu -->
            <transition name="dropdown-fade">
              <div v-if="isUserMenuOpen" class="user-dropdown">
                <div class="dropdown-header">
                  <p class="dropdown-user-name">{{ user?.name }}</p>
                  <p class="dropdown-user-email">{{ user?.email }}</p>
                </div>
                <div class="dropdown-divider" />
                <button class="dropdown-item" @click="openSavedModal">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="dropdown-item-icon">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>Saved Places ({{ savedSpots.length }})</span>
                </button>
                <button class="dropdown-item" @click="showSettingsModal = true; isUserMenuOpen = false;">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="dropdown-item-icon">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <span>Preferences</span>
                </button>
                <div class="dropdown-divider" />
                <button id="logout-btn" class="dropdown-item logout-item" @click="handleLogout">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="dropdown-item-icon">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Sign out</span>
                </button>
              </div>
            </transition>
          </div>
        </div>
      </header>

      <!-- Center Hero & Search Section (Default View) -->
      <section v-if="!currentRecommendations && !isSearching" class="hero-container">
        <!-- Fork & Knife Icon Badge -->
        <div class="center-icon-badge" aria-hidden="true">
          <svg class="fork-icon-sm" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2v5a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V2M12 9v13M16 2c0 0 2 1.5 2 5s-2 5-2 5v9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <!-- Main Heading -->
        <h1 class="hero-title">Where do you want to eat?</h1>

        <!-- Subtitle -->
        <p class="hero-subtitle">
          A craving, an occasion, a neighborhood. Start with whatever’s on your mind.
        </p>

        <!-- Search Input Card -->
        <div class="search-card" :class="{ 'card-focused': isInputFocused }">
          <div class="textarea-wrapper">
            <textarea
              id="food-search-input"
              ref="searchInputRef"
              v-model="searchQuery"
              class="search-textarea"
              placeholder="Ask for your next great meal..."
              rows="3"
              @focus="isInputFocused = true"
              @blur="isInputFocused = false"
              @keydown.enter.exact.prevent="submitSearch"
            ></textarea>
          </div>

          <!-- Bottom Card Toolbar -->
          <div class="search-card-footer">
            <!-- Location Selector Dropdown -->
            <div class="location-picker-wrapper" ref="locationPickerRef">
              <button
                id="location-picker-btn"
                type="button"
                class="location-btn"
                @click="isLocationMenuOpen = !isLocationMenuOpen"
              >
                <svg class="location-pin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span class="location-text">{{ selectedLocation || 'Add a location' }}</span>
                <svg class="location-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <!-- Location Menu Popover -->
              <transition name="dropdown-fade">
                <div v-if="isLocationMenuOpen" class="location-menu">
                  <div class="location-search-box">
                    <input
                      v-model="customLocationInput"
                      type="text"
                      placeholder="Type a city or area..."
                      class="location-search-input"
                      @keydown.enter.prevent="selectLocation(customLocationInput)"
                    />
                  </div>
                  <div class="location-options">
                    <button
                      v-for="loc in popularLocations"
                      :key="loc"
                      class="location-option"
                      :class="{ 'location-option-selected': selectedLocation === loc }"
                      @click="selectLocation(loc)"
                    >
                      <span>{{ loc }}</span>
                      <svg v-if="selectedLocation === loc" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </button>
                    <button
                      v-if="selectedLocation"
                      class="location-option clear-location"
                      @click="selectLocation('')"
                    >
                      Clear location
                    </button>
                  </div>
                </div>
              </transition>
            </div>

            <!-- Submit Button (Terracotta Circle with Up Arrow) -->
            <button
              id="search-submit-btn"
              type="button"
              class="submit-arrow-btn"
              :class="{ 'submit-active': searchQuery.trim().length > 0 }"
              :disabled="!searchQuery.trim()"
              @click="submitSearch"
              aria-label="Submit query"
            >
              <svg class="arrow-up-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Inspiration Chips -->
        <div class="inspiration-section">
          <p class="inspiration-header">A LITTLE INSPIRATION</p>
          <div class="inspiration-chips">
            <button
              v-for="chip in inspirationChips"
              :key="chip.text"
              class="inspiration-chip"
              @click="selectInspiration(chip)"
            >
              <span class="chip-icon">{{ chip.icon }}</span>
              <span class="chip-label">{{ chip.text }}</span>
            </button>
          </div>
        </div>

        <!-- Bottom Tagline -->
        <div class="hero-footer-tagline">
          <em>Good food starts with a conversation.</em>
        </div>
      </section>

      <!-- Active Search Loading State -->
      <section v-else-if="isSearching" class="loading-results-view">
        <div class="searching-card">
          <div class="searching-spinner" />
          <h2 class="searching-title">Curating dining recommendations...</h2>
          <p class="searching-subtitle">
            Analyzing reviews, ambiance, culinary style, and {{ selectedLocation || 'local' }} gems for:
            <strong>"{{ activeQuery }}"</strong>
          </p>
        </div>
      </section>

      <!-- Recommendation Results View -->
      <section v-else class="results-view">
        <div class="results-container">
          <!-- Conversation Header -->
          <div class="results-header">
            <div class="user-query-pill">
              <span class="query-avatar">💬</span>
              <span class="query-text">"{{ activeQuery }}"</span>
              <span v-if="activeLocation" class="query-location">in {{ activeLocation }}</span>
            </div>
            <button class="btn-new-chat-top" @click="handleNewChat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Ask another</span>
            </button>
          </div>

          <!-- Curator Response Note -->
          <div class="curator-intro-card">
            <div class="curator-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="curator-star-icon">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>Curator's Notes</span>
            </div>
            <p class="curator-summary">{{ currentRecommendations.summary }}</p>
          </div>

          <!-- Cards Grid -->
          <div class="restaurants-grid">
            <article
              v-for="spot in currentRecommendations.spots"
              :key="spot.id"
              class="restaurant-card"
            >
              <div class="card-img-wrapper">
                <img :src="spot.image" :alt="spot.name" class="card-img" loading="lazy" />
                <div class="card-img-gradient" />
                <button
                  class="bookmark-btn"
                  :class="{ 'bookmarked': isSpotSaved(spot.id) }"
                  @click="toggleSaveSpot(spot)"
                  :title="isSpotSaved(spot.id) ? 'Remove from saved' : 'Save spot'"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
                <div class="card-price-badge">{{ spot.price }}</div>
              </div>

              <div class="card-details">
                <div class="card-meta-row">
                  <span class="card-neighborhood">{{ spot.neighborhood }}</span>
                  <div class="card-rating">
                    <span class="rating-star">★</span>
                    <span class="rating-score">{{ spot.rating }}</span>
                    <span class="rating-reviews">({{ spot.reviews }})</span>
                  </div>
                </div>

                <h3 class="spot-name">{{ spot.name }}</h3>
                <p class="spot-cuisine">{{ spot.cuisine }}</p>

                <div class="spot-highlights">
                  <span v-for="tag in spot.tags" :key="tag" class="spot-tag">{{ tag }}</span>
                </div>

                <p class="spot-description">{{ spot.description }}</p>

                <div class="spot-standout">
                  <span class="standout-label">Curator's Pick:</span>
                  <span class="standout-dish">{{ spot.standoutDish }}</span>
                </div>

                <div class="card-actions">
                  <button class="btn-card-reserve" @click="handleAction(spot, 'reserve')">
                    Reserve Table
                  </button>
                  <button class="btn-card-details" @click="handleAction(spot, 'details')">
                    View Details
                  </button>
                </div>
              </div>
            </article>
          </div>

          <!-- Follow-up input bar fixed at bottom -->
          <div class="followup-bar-wrapper">
            <div class="followup-input-card">
              <input
                v-model="followUpQuery"
                type="text"
                class="followup-input"
                placeholder="Ask follow-up (e.g. 'Any of these have great natural wine?' or 'Filter by patio')..."
                @keydown.enter.prevent="submitFollowUp"
              />
              <button
                class="followup-submit-btn"
                :disabled="!followUpQuery.trim()"
                @click="submitFollowUp"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="arrow-up-sm">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- ─── Settings Modal ───────────────────────────────────────────────────── -->
    <transition name="modal-fade">
      <div v-if="showSettingsModal" class="modal-overlay" @click.self="showSettingsModal = false">
        <div class="settings-modal" role="dialog" aria-modal="true">
          <div class="modal-header">
            <div>
              <h2 class="modal-title">Curation Preferences</h2>
              <p class="modal-subtitle">Personalize your taste profile and dietary needs.</p>
            </div>
            <button class="modal-close-btn" @click="showSettingsModal = false" aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <!-- Dietary Restrictions -->
            <div class="pref-group">
              <label class="pref-label">DIETARY PREFERENCES</label>
              <div class="pref-chips">
                <button
                  v-for="d in dietaryOptions"
                  :key="d"
                  class="pref-chip"
                  :class="{ 'pref-chip-active': userPreferences.dietary.includes(d) }"
                  @click="togglePreference('dietary', d)"
                >
                  {{ d }}
                </button>
              </div>
            </div>

            <!-- Price Preference -->
            <div class="pref-group">
              <label class="pref-label">PRICE COMFORT</label>
              <div class="price-options">
                <button
                  v-for="p in ['$', '$$', '$$$', '$$$$']"
                  :key="p"
                  class="price-btn"
                  :class="{ 'price-btn-active': userPreferences.price === p }"
                  @click="userPreferences.price = p"
                >
                  {{ p }}
                </button>
              </div>
            </div>

            <!-- Default Neighborhood -->
            <div class="pref-group">
              <label class="pref-label">HOME BASE / DEFAULT REGION</label>
              <input
                v-model="userPreferences.defaultCity"
                type="text"
                class="pref-input"
                placeholder="e.g. Lower Manhattan, NY or Shinjuku, Tokyo"
              />
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="showSettingsModal = false">Close</button>
            <button class="btn-save-prefs" @click="savePreferences">Save Preferences</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ─── Saved Places Modal ───────────────────────────────────────────────── -->
    <transition name="modal-fade">
      <div v-if="showSavedModal" class="modal-overlay" @click.self="showSavedModal = false">
        <div class="settings-modal" role="dialog" aria-modal="true">
          <div class="modal-header">
            <div>
              <h2 class="modal-title">Saved Dining Spots</h2>
              <p class="modal-subtitle">Your personal curated gastronomy wishlist.</p>
            </div>
            <button class="modal-close-btn" @click="showSavedModal = false" aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div v-if="savedSpots.length === 0" class="empty-saved">
              <span class="empty-icon">🔖</span>
              <p>No saved spots yet. Click the bookmark icon on any curated recommendation to save it here!</p>
            </div>
            <div v-else class="saved-list">
              <div v-for="spot in savedSpots" :key="spot.id" class="saved-row">
                <img :src="spot.image" :alt="spot.name" class="saved-thumb" />
                <div class="saved-info">
                  <h4 class="saved-name">{{ spot.name }}</h4>
                  <p class="saved-sub">{{ spot.cuisine }} · {{ spot.neighborhood }} · {{ spot.price }}</p>
                </div>
                <button class="saved-remove-btn" @click="toggleSaveSpot(spot)" title="Remove">✕</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { user, isAuthenticated, fetchUser, logout } = useAuth();

// ─── Sidebar state ────────────────────────────────────────────────────────────
const isSidebarCollapsed = ref(false);
function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
}

// ─── User Menu Dropdown state ─────────────────────────────────────────────────
const isUserMenuOpen = ref(false);
const userMenuRef = ref(null);

function handleAccountClick() {
  if (isAuthenticated.value) {
    isUserMenuOpen.value = !isUserMenuOpen.value;
  } else {
    router.push('/login');
  }
}

async function handleLogout() {
  isUserMenuOpen.value = false;
  await logout();
  // stays on main page seamlessly in guest mode
}

function getUserInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

function getAvatarColor(name) {
  const colors = ['#8b3e23', '#2d4b3e', '#7b4b28', '#3b4358', '#944428'];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Close menus on outside click
function handleDocumentClick(e) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target)) {
    isUserMenuOpen.value = false;
  }
  if (locationPickerRef.value && !locationPickerRef.value.contains(e.target)) {
    isLocationMenuOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
  fetchUser();
});

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick);
});

// ─── Search / Query state ─────────────────────────────────────────────────────
const searchQuery = ref('');
const isInputFocused = ref(false);
const searchInputRef = ref(null);
const isSearching = ref(false);
const activeQuery = ref('');
const activeLocation = ref('');
const activeSearchId = ref(null);
const followUpQuery = ref('');
const currentRecommendations = ref(null);

// ─── Location Picker ──────────────────────────────────────────────────────────
const isLocationMenuOpen = ref(false);
const locationPickerRef = ref(null);
const selectedLocation = ref('');
const customLocationInput = ref('');
const popularLocations = [
  'New York, NY',
  'Tokyo, Japan',
  'Paris, France',
  'San Francisco, CA',
  'London, UK',
  'Rome, Italy',
  'Barcelona, Spain',
];

function selectLocation(loc) {
  selectedLocation.value = loc;
  isLocationMenuOpen.value = false;
  customLocationInput.value = '';
}

// ─── Inspiration Chips ────────────────────────────────────────────────────────
const inspirationChips = [
  { icon: '📍', text: 'A cozy date-night spot' },
  { icon: '🍴', text: 'The best pasta nearby' },
  { icon: '🥞', text: 'Brunch with friends' },
];

function selectInspiration(chip) {
  searchQuery.value = chip.text;
  submitSearch();
}

// ─── Recent Searches ──────────────────────────────────────────────────────────
const recentSearches = ref([
  { id: '1', icon: '🍷', query: 'A cozy date-night spot' },
  { id: '2', icon: '🍝', query: 'The best pasta nearby' },
  { id: '3', icon: '🥞', query: 'Brunch with friends' },
]);

// ─── Knowledge / Curation Database Simulation ─────────────────────────────────
const curatedDatabase = {
  pasta: {
    summary: 'For pasta lovers, we prioritized eateries known for handmade extrusion, heirloom durum wheat, and heritage sauces with cozy, candlelit ambiance.',
    spots: [
      {
        id: 'p1',
        name: 'Osteria Emilia',
        neighborhood: 'West Village',
        cuisine: 'Northern Italian & Handmade Pasta',
        rating: 4.9,
        reviews: 412,
        price: '$$$',
        image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80',
        tags: ['Fresh Extruded', 'Natural Wine', 'Romantic'],
        description: 'Warm, exposed brick tavern serving seasonal agnolotti del plin and hand-rolled tagliatelle bathed in 36-month Parmigiano-Reggiano emulsion.',
        standoutDish: 'Truffled Tajarin with butter and mountain thyme',
      },
      {
        id: 'p2',
        name: 'Via Pastificio',
        neighborhood: 'SoHo',
        cuisine: 'Rustic Italian Trattoria',
        rating: 4.8,
        reviews: 328,
        price: '$$',
        image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800&auto=format&fit=crop&q=80',
        tags: ['Counter Seating', 'Cacio e Pepe', 'Cozy Patio'],
        description: 'Intimate open-kitchen pastificio where cooks roll silk-thin pappardelle before your eyes. The wild boar ragù is simmered for 14 hours.',
        standoutDish: 'Classic Cacio e Pepe in pecorino wheel',
      },
      {
        id: 'p3',
        name: 'Bar Primi Luce',
        neighborhood: 'East Village',
        cuisine: 'Contemporary Italian & Apertivo',
        rating: 4.7,
        reviews: 284,
        price: '$$$',
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?w=800&auto=format&fit=crop&q=80',
        tags: ['House Cocktails', 'Squid Ink Pasta', 'Great Energy'],
        description: 'Vibrant corner spot renowned for squid ink campanelle with tender diver scallops, spicy calabrian chili butter, and toasted pangrattato.',
        standoutDish: 'Fiore di Carciofi with mint butter',
      },
    ],
  },
  datenight: {
    summary: 'Handpicked intimate hideaways characterized by subdued candlelight, acoustic warmth, thoughtful wine curation, and shareable plates built for lingering.',
    spots: [
      {
        id: 'd1',
        name: 'L’Ombre Bistro',
        neighborhood: 'Greenwich Village',
        cuisine: 'French Neo-Bistro & Natural Wines',
        rating: 4.9,
        reviews: 518,
        price: '$$$',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
        tags: ['Candlelit', 'Sommelier Selection', 'Vinyl Jazz'],
        description: 'Hidden beneath a leafy townhouse canopy, this bistro pairs slow-braised duck leg confit with organic Jura wines and velvet booth nooks.',
        standoutDish: 'Seared Duck Breast with elderberry jus and parsnip purée',
      },
      {
        id: 'd2',
        name: 'Moonlight Yakitori',
        neighborhood: 'Lower East Side',
        cuisine: 'Charcoal Yakitori & Sake Parlor',
        rating: 4.8,
        reviews: 340,
        price: '$$$',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
        tags: ['Intimate Counter', 'Rare Sakes', 'Binchotan Grilled'],
        description: 'Just 14 bar seats surrounding glowing white binchotan coals. Watch skewers of heritage chicken, tsukune meatballs, and maitake mushrooms grilled to perfection.',
        standoutDish: 'Tsukune chicken meatball skewer with organic egg yolk dip',
      },
      {
        id: 'd3',
        name: 'Flora Botanical Cellar',
        neighborhood: 'Gramercy',
        cuisine: 'Modern Mediterranean & Tapas',
        rating: 4.8,
        reviews: 295,
        price: '$$',
        image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&auto=format&fit=crop&q=80',
        tags: ['Garden Terrace', 'Shared Small Plates', 'Artisanal Cocktails'],
        description: 'An indoor botanical greenhouse with trailing ivy and low wicker lamps. Outstanding grilled octopus, blistered shishitos, and warm sourdough with smoked ricotta.',
        standoutDish: 'Charred Spanish Octopus with saffron potato purée',
      },
    ],
  },
  brunch: {
    summary: 'Sunny, design-forward destinations with artisanal sourdough bakers, exceptional specialty coffee roasts, and elevated breakfast comfort plates.',
    spots: [
      {
        id: 'b1',
        name: 'Maison Farine',
        neighborhood: 'NoHo',
        cuisine: 'Artisanal Bakery & Day Café',
        rating: 4.9,
        reviews: 620,
        price: '$$',
        image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&auto=format&fit=crop&q=80',
        tags: ['Brioche French Toast', 'Pour Over Coffee', 'Sunlit Skylight'],
        description: 'Famous for laminated pastries and brioche French toast soaked in orange blossom custard, served alongside house single-origin espresso.',
        standoutDish: 'Brûléed Orange Brioche French Toast with clotted cream',
      },
      {
        id: 'b2',
        name: 'The Greenhouse Table',
        neighborhood: 'DUMBO',
        cuisine: 'Farm-to-Table Brunch & Botanicals',
        rating: 4.8,
        reviews: 475,
        price: '$$',
        image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80',
        tags: ['Waterfront Views', 'Poached Eggs', 'Mimosa Flights'],
        description: 'Sun-drenched loft overlooking cobblestone streets. Features poached eggs over smoked salmon rosti, avocado green goddess salad, and fresh peach bellinis.',
        standoutDish: 'Crispy Potato Rosti with poached hen eggs and house gravlax',
      },
      {
        id: 'b3',
        name: 'Café Clementine',
        neighborhood: 'Tribeca',
        cuisine: 'Australian-Style All Day Breakfast',
        rating: 4.7,
        reviews: 390,
        price: '$$',
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80',
        tags: ['Flat Whites', 'Ricotta Hotcakes', 'Outdoor Benches'],
        description: 'Vibrant Aussie café with featherlight honeycomb hotcakes, chili scrambled eggs on sourdough, and silky Melbourne-style flat whites.',
        standoutDish: 'Whipped Ricotta Hotcakes with honeycomb butter',
      },
    ],
  },
};

function submitSearch() {
  const query = searchQuery.value.trim();
  if (!query) return;

  activeQuery.value = query;
  activeLocation.value = selectedLocation.value;
  isSearching.value = true;
  currentRecommendations.value = null;

  // Add to recent searches if unique
  if (!recentSearches.value.some(s => s.query.toLowerCase() === query.toLowerCase())) {
    recentSearches.value.unshift({
      id: Date.now().toString(),
      icon: '🍴',
      query,
    });
    if (recentSearches.value.length > 6) recentSearches.value.pop();
  }

  // Simulate smooth AI curation latency (600ms)
  setTimeout(() => {
    const qLower = query.toLowerCase();
    let result = curatedDatabase.datenight;
    if (qLower.includes('pasta') || qLower.includes('italian') || qLower.includes('carbs')) {
      result = curatedDatabase.pasta;
    } else if (qLower.includes('brunch') || qLower.includes('breakfast') || qLower.includes('friends') || qLower.includes('pancake')) {
      result = curatedDatabase.brunch;
    }

    currentRecommendations.value = result;
    isSearching.value = false;
  }, 650);
}

function submitFollowUp() {
  if (!followUpQuery.value.trim()) return;
  searchQuery.value = `${activeQuery.value} · ${followUpQuery.value.trim()}`;
  followUpQuery.value = '';
  submitSearch();
}

function handleNewChat() {
  currentRecommendations.value = null;
  isSearching.value = false;
  searchQuery.value = '';
  followUpQuery.value = '';
  activeSearchId.value = null;
}

function loadSearch(item) {
  activeSearchId.value = item.id;
  searchQuery.value = item.query;
  submitSearch();
}

// ─── Saved Spots ──────────────────────────────────────────────────────────────
const savedSpots = ref([]);
const showSavedModal = ref(false);

function openSavedModal() {
  isUserMenuOpen.value = false;
  showSavedModal.value = true;
}

function isSpotSaved(id) {
  return savedSpots.value.some(s => s.id === id);
}

function toggleSaveSpot(spot) {
  const index = savedSpots.value.findIndex(s => s.id === spot.id);
  if (index > -1) {
    savedSpots.value.splice(index, 1);
  } else {
    savedSpots.value.push(spot);
  }
}

function handleAction(spot, type) {
  if (type === 'reserve') {
    alert(`Reservation request initiated for ${spot.name} in ${spot.neighborhood}!`);
  } else {
    alert(`${spot.name}\n\nStandout: ${spot.standoutDish}\nPrice: ${spot.price}\nRating: ${spot.rating} (${spot.reviews} reviews)\nTags: ${spot.tags.join(', ')}`);
  }
}

// ─── Settings / Preferences Modal ─────────────────────────────────────────────
const showSettingsModal = ref(false);
const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Pescatarian', 'Dairy-Free'];
const userPreferences = reactive({
  dietary: ['Vegetarian'],
  price: '$$$',
  defaultCity: 'New York, NY',
});

function togglePreference(category, item) {
  const arr = userPreferences[category];
  const idx = arr.indexOf(item);
  if (idx > -1) {
    arr.splice(idx, 1);
  } else {
    arr.push(item);
  }
}

function savePreferences() {
  showSettingsModal.value = false;
  if (userPreferences.defaultCity && !selectedLocation.value) {
    selectedLocation.value = userPreferences.defaultCity;
  }
}
</script>

<style scoped>
/* ─── Base Layout ──────────────────────────────────────────────────────────── */
.app-layout {
  display: flex;
  height: 100vh;
  max-height: 100vh;
  width: 100%;
  background-color: #faf7f2;
  color: #241810;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
  position: relative;
}

/* ─── Collapsible Sidebar ──────────────────────────────────────────────────── */
.sidebar {
  position: relative;
  height: 100vh;
  width: 256px;
  min-width: 256px;
  background-color: #f0ece3;
  border-right: 1px solid #e5dfd3;
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 30;
  flex-shrink: 0;
  overflow: visible;
}

.sidebar.sidebar-collapsed {
  width: 0;
  min-width: 0;
  border-right-color: transparent;
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  width: 256px;
  height: 100vh;
  padding: 24px 16px;
  overflow-y: auto;
  overflow-x: hidden;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
}

.sidebar.sidebar-collapsed .sidebar-inner {
  transform: translateX(-100%);
  opacity: 0;
  pointer-events: none;
}

/* Sidebar Header / Brand */
.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.brand-badge {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background-color: #f7f4ed;
  border: 1px solid #e6ded2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b3e23;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.2s, background-color 0.2s;
}

.brand-badge:hover {
  background-color: #ffffff;
  transform: scale(1.04);
}

.fork-icon {
  width: 20px;
  height: 20px;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  white-space: nowrap;
}

.brand-title {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #241810;
}

.brand-subtitle {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #241810;
}

/* New Chat Button */
.new-chat-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  border-radius: 12px;
  border: none;
  background-color: #e5ded2;
  color: #2c1a0e;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, transform 0.1s;
  white-space: nowrap;
}

.sidebar.sidebar-collapsed .new-chat-btn {
  justify-content: center;
  padding: 10px;
}

.new-chat-btn:hover {
  background-color: #dcd4c6;
}

.new-chat-icon {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  color: #554437;
}

/* Sidebar middle content (Recent searches) */
.sidebar-content {
  flex: 1;
  margin-top: 24px;
  overflow-y: auto;
}

.recent-header {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #8d7e70;
  margin-bottom: 8px;
  padding-left: 6px;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #4a3b30;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-item:hover {
  background-color: #e5ded2;
  color: #1a0e06;
}

.recent-active {
  background-color: #dfd7ca;
  font-weight: 500;
  color: #8b3e23;
}

.recent-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.recent-text {
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Sidebar Footer */
.sidebar-footer {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #e5ded2;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sidebar-nav-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 9px 10px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #5d4e43;
  font-size: 13.5px;
  font-weight: 450;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
  white-space: nowrap;
}

.sidebar.sidebar-collapsed .sidebar-nav-btn {
  justify-content: center;
  padding: 9px 0;
}

.sidebar-nav-btn:hover {
  background-color: #e5ded2;
  color: #201309;
}

.nav-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* Sidebar Toggle Arrow (on border) */
.sidebar-toggle-btn {
  position: absolute;
  top: 50%;
  right: -13px;
  transform: translateY(-50%);
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 1px solid #dfd7ca;
  box-shadow: 0 1px 4px rgba(44, 26, 10, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7b6d60;
  cursor: pointer;
  z-index: 30;
  transition: background-color 0.15s, color 0.15s, transform 0.15s;
}

.sidebar-toggle-btn:hover {
  background-color: #faf7f2;
  color: #8b3e23;
  transform: translateY(-50%) scale(1.08);
}

.sidebar-toggle-btn svg {
  width: 14px;
  height: 14px;
}

/* ─── Main Content ─────────────────────────────────────────────────────────── */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-height: 100vh;
  position: relative;
  background-color: #faf7f2;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Top Navigation Bar */
.top-nav {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 36px;
  position: sticky;
  top: 0;
  background-color: rgba(250, 247, 242, 0.92);
  backdrop-filter: blur(8px);
  z-index: 10;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: #4a3b30;
  cursor: pointer;
  padding: 6px;
}

.mobile-menu-btn svg {
  width: 22px;
  height: 22px;
}

.top-nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: auto;
}

/* Login link */
.nav-link-login {
  color: #3b2a1e;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  transition: color 0.15s, background-color 0.15s;
}

.nav-link-login:hover {
  color: #8b3e23;
  background-color: rgba(139, 62, 35, 0.05);
}

/* Sign up button (pill terracotta) */
.btn-signup {
  background-color: #8b3e23;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  padding: 9px 22px;
  border-radius: 9999px;
  box-shadow: 0 2px 8px rgba(139, 62, 35, 0.2);
  transition: background-color 0.2s, transform 0.1s, box-shadow 0.2s;
}

.btn-signup:hover {
  background-color: #76341d;
  box-shadow: 0 4px 12px rgba(139, 62, 35, 0.3);
  transform: translateY(-1px);
}

/* User profile button (When Logged In) */
.user-profile-menu {
  position: relative;
}

.user-profile-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px 6px 8px;
  border-radius: 9999px;
  border: 1px solid #e5ded2;
  background-color: #ffffff;
  color: #241810;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(44, 26, 10, 0.04);
  transition: background-color 0.15s, border-color 0.15s, box-shadow 0.15s;
}

.user-profile-btn:hover {
  border-color: #d5ccbe;
  box-shadow: 0 2px 6px rgba(44, 26, 10, 0.08);
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: #ffffff;
  font-size: 11.5px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.02em;
}

.user-name {
  font-size: 13.5px;
  font-weight: 500;
  color: #241810;
}

.dropdown-chevron {
  width: 14px;
  height: 14px;
  color: #8d7e70;
  transition: transform 0.2s ease;
}

.chevron-rotate {
  transform: rotate(180deg);
}

/* User Dropdown */
.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 220px;
  background-color: #ffffff;
  border: 1px solid #e7e0d4;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(44, 26, 10, 0.1);
  padding: 8px;
  z-index: 50;
}

.dropdown-header {
  padding: 8px 12px;
}

.dropdown-user-name {
  font-size: 13.5px;
  font-weight: 600;
  color: #201309;
  margin: 0;
}

.dropdown-user-email {
  font-size: 12px;
  color: #8a7a6c;
  margin: 2px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-divider {
  height: 1px;
  background-color: #f0ece3;
  margin: 6px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #3b2c21;
  font-size: 13px;
  font-weight: 450;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s, color 0.15s;
}

.dropdown-item:hover {
  background-color: #f7f3ec;
  color: #8b3e23;
}

.dropdown-item-icon {
  width: 16px;
  height: 16px;
  color: #7d6e62;
}

.logout-item:hover {
  background-color: #fdf2f2;
  color: #c0392b;
}

.logout-item:hover .dropdown-item-icon {
  color: #c0392b;
}

/* ─── Center Hero Section ──────────────────────────────────────────────────── */
.hero-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 24px 60px;
  max-width: 800px;
  margin: auto auto;
  width: 100%;
  text-align: center;
}

.center-icon-badge {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #ece6dc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b3e23;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(44, 26, 10, 0.05);
}

.fork-icon-sm {
  width: 22px;
  height: 22px;
}

.hero-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 48px;
  font-weight: 500;
  line-height: 1.15;
  color: #1e130a;
  margin: 0 0 16px;
  letter-spacing: -0.01em;
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 34px;
  }
}

.hero-subtitle {
  font-size: 15.5px;
  line-height: 1.6;
  color: #7b6d60;
  margin: 0 0 36px;
  max-width: 540px;
}

/* Search Card */
.search-card {
  width: 100%;
  max-width: 650px;
  background-color: #ffffff;
  border: 1px solid #e7e0d4;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(44, 26, 10, 0.04), 0 1px 4px rgba(44, 26, 10, 0.02);
  padding: 20px 22px 16px;
  text-align: left;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-card.card-focused {
  border-color: #c9903a;
  box-shadow: 0 6px 28px rgba(44, 26, 10, 0.07), 0 0 0 3px rgba(201, 144, 58, 0.08);
}

.textarea-wrapper {
  width: 100%;
}

.search-textarea {
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  background: transparent;
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 15.5px;
  line-height: 1.5;
  color: #241810;
  min-height: 64px;
}

.search-textarea::placeholder {
  color: #a49789;
}

/* Bottom toolbar of search card */
.search-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f4f0e8;
}

/* Location Selector */
.location-picker-wrapper {
  position: relative;
}

.location-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: #736456;
  font-size: 13px;
  font-weight: 450;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 8px;
  transition: background-color 0.15s, color 0.15s;
}

.location-btn:hover {
  background-color: #f6f2ea;
  color: #241810;
}

.location-pin-icon {
  width: 15px;
  height: 15px;
  color: #8b3e23;
}

.location-chevron {
  width: 13px;
  height: 13px;
  color: #9d8e80;
}

.location-menu {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 0;
  width: 250px;
  background-color: #ffffff;
  border: 1px solid #e7e0d4;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(44, 26, 10, 0.1);
  padding: 8px;
  z-index: 40;
}

.location-search-box {
  padding: 4px 6px 8px;
  border-bottom: 1px solid #f0ece3;
}

.location-search-input {
  width: 100%;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid #e5ded2;
  font-size: 12.5px;
  outline: none;
}

.location-search-input:focus {
  border-color: #c9903a;
}

.location-options {
  max-height: 200px;
  overflow-y: auto;
  padding-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.location-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 7px 10px;
  border-radius: 6px;
  border: none;
  background: transparent;
  font-size: 13px;
  color: #3e3025;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.12s;
}

.location-option:hover {
  background-color: #f7f3eb;
  color: #8b3e23;
}

.location-option-selected {
  font-weight: 600;
  color: #8b3e23;
  background-color: #fbf7f0;
}

.check-icon {
  width: 14px;
  height: 14px;
}

.clear-location {
  color: #a04030;
  font-size: 12px;
  border-top: 1px solid #f2ede5;
  margin-top: 4px;
  padding-top: 8px;
}

/* Submit Arrow Button (Terracotta circle) */
.submit-arrow-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background-color: #8b3e23;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.15s, opacity 0.2s;
}

.submit-arrow-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.submit-arrow-btn:not(:disabled):hover {
  background-color: #76341d;
  transform: scale(1.06);
}

.arrow-up-icon {
  width: 18px;
  height: 18px;
}

/* Inspiration Section */
.inspiration-section {
  margin-top: 36px;
  width: 100%;
}

.inspiration-header {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: #9d8e80;
  margin-bottom: 14px;
}

.inspiration-chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.inspiration-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 9999px;
  background-color: #ffffff;
  border: 1px solid #e8e1d6;
  color: #2b1d14;
  font-size: 13.5px;
  font-weight: 450;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(44, 26, 10, 0.02);
  transition: background-color 0.15s, border-color 0.15s, transform 0.1s, box-shadow 0.15s;
}

.inspiration-chip:hover {
  background-color: #ffffff;
  border-color: #c9903a;
  color: #8b3e23;
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(44, 26, 10, 0.06);
}

.chip-icon {
  font-size: 14px;
}

.chip-label {
  letter-spacing: 0.01em;
}

/* Tagline */
.hero-footer-tagline {
  margin-top: 64px;
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 15px;
  font-style: italic;
  color: #9d8e80;
}

/* ─── Loading / Searching View ─────────────────────────────────────────────── */
.loading-results-view {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 60px 24px;
}

.searching-card {
  text-align: center;
  max-width: 480px;
  background-color: #ffffff;
  border-radius: 20px;
  border: 1px solid #e7e0d4;
  padding: 44px 36px;
  box-shadow: 0 4px 24px rgba(44, 26, 10, 0.04);
}

.searching-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #f0ece3;
  border-top-color: #8b3e23;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.searching-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 26px;
  font-weight: 600;
  color: #1e130a;
  margin: 0 0 10px;
}

.searching-subtitle {
  font-size: 14px;
  color: #7d6e62;
  line-height: 1.6;
}

.searching-subtitle strong {
  color: #8b3e23;
}

/* ─── Recommendations View ─────────────────────────────────────────────────── */
.results-view {
  padding: 24px 36px 120px;
  max-width: 1040px;
  margin: 0 auto;
  width: 100%;
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
}

.user-query-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #ffffff;
  border: 1px solid #e6ded2;
  padding: 8px 16px;
  border-radius: 9999px;
  font-size: 14px;
  color: #241810;
  box-shadow: 0 1px 3px rgba(44, 26, 10, 0.03);
}

.query-text {
  font-weight: 500;
}

.query-location {
  color: #8b3e23;
  font-size: 13px;
  font-weight: 500;
}

.btn-new-chat-top {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #f0ece3;
  border: 1px solid #e0d8ca;
  padding: 8px 14px;
  border-radius: 9999px;
  color: #4a3b30;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
}

.btn-new-chat-top:hover {
  background-color: #e5ded2;
  color: #1a0e06;
}

.btn-icon {
  width: 14px;
  height: 14px;
}

/* Curator intro note card */
.curator-intro-card {
  background: linear-gradient(135deg, #ffffff 0%, #faf6ef 100%);
  border: 1px solid #e6dfd4;
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 28px;
  box-shadow: 0 2px 10px rgba(44, 26, 10, 0.03);
}

.curator-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #8b3e23;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.curator-star-icon {
  width: 14px;
  height: 14px;
  color: #c9903a;
  fill: #c9903a;
}

.curator-summary {
  font-size: 14.5px;
  color: #44352a;
  line-height: 1.6;
  margin: 0;
}

/* Restaurants Grid */
.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 24px;
}

.restaurant-card {
  background-color: #ffffff;
  border: 1px solid #e8e2d6;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(44, 26, 10, 0.04);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.restaurant-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(44, 26, 10, 0.08);
  border-color: #d8cebf;
}

.card-img-wrapper {
  position: relative;
  height: 180px;
  width: 100%;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.restaurant-card:hover .card-img {
  transform: scale(1.04);
}

.card-img-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%);
}

.bookmark-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #44352a;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;
}

.bookmark-btn svg {
  width: 16px;
  height: 16px;
}

.bookmark-btn:hover {
  background: #ffffff;
  transform: scale(1.1);
  color: #8b3e23;
}

.bookmark-btn.bookmarked {
  background: #8b3e23;
  color: #ffffff;
}

.bookmark-btn.bookmarked svg {
  fill: currentColor;
}

.card-price-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(26, 16, 8, 0.75);
  backdrop-filter: blur(4px);
  color: #ffffff;
  font-size: 11.5px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
}

.card-details {
  padding: 18px 20px 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.card-neighborhood {
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8b3e23;
}

.card-rating {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12.5px;
}

.rating-star {
  color: #c9903a;
}

.rating-score {
  font-weight: 600;
  color: #1e130a;
}

.rating-reviews {
  color: #8d7e70;
  font-size: 11.5px;
}

.spot-name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 22px;
  font-weight: 600;
  color: #1e130a;
  margin: 0 0 2px;
  line-height: 1.25;
}

.spot-cuisine {
  font-size: 12.5px;
  color: #7b6d60;
  margin: 0 0 10px;
}

.spot-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 12px;
}

.spot-tag {
  font-size: 11px;
  background-color: #f7f3ec;
  color: #554437;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 450;
}

.spot-description {
  font-size: 13px;
  color: #4a3b30;
  line-height: 1.5;
  margin: 0 0 14px;
  flex: 1;
}

.spot-standout {
  background-color: #faf6f0;
  border-left: 3px solid #c9903a;
  padding: 8px 10px;
  border-radius: 0 6px 6px 0;
  font-size: 12px;
  margin-bottom: 16px;
}

.standout-label {
  font-weight: 600;
  color: #7d5a23;
  margin-right: 4px;
}

.standout-dish {
  color: #241810;
  font-style: italic;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.btn-card-reserve {
  flex: 1;
  background-color: #8b3e23;
  color: #ffffff;
  border: none;
  border-radius: 9px;
  padding: 9px 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s;
}

.btn-card-reserve:hover {
  background-color: #76341d;
}

.btn-card-details {
  background-color: #f2ece2;
  color: #4a3b30;
  border: none;
  border-radius: 9px;
  padding: 9px 12px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s;
}

.btn-card-details:hover {
  background-color: #e5ded2;
}

/* Floating Follow-up Input Bar at Bottom */
.followup-bar-wrapper {
  position: fixed;
  bottom: 24px;
  left: 280px;
  right: 24px;
  display: flex;
  justify-content: center;
  pointer-events: none;
  z-index: 25;
}

.sidebar.sidebar-collapsed ~ .main-content .followup-bar-wrapper {
  left: 80px;
}

.followup-input-card {
  pointer-events: auto;
  width: 100%;
  max-width: 680px;
  background: #ffffff;
  border: 1px solid #e2dad0;
  border-radius: 9999px;
  box-shadow: 0 8px 30px rgba(44, 26, 10, 0.12);
  display: flex;
  align-items: center;
  padding: 6px 8px 6px 20px;
}

.followup-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #241810;
}

.followup-submit-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #8b3e23;
  border: none;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.15s;
}

.followup-submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.arrow-up-sm {
  width: 16px;
  height: 16px;
}

/* ─── Modals ───────────────────────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26, 16, 8, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 100;
}

.settings-modal {
  width: 100%;
  max-width: 500px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 16px 40px rgba(44, 26, 10, 0.15);
  border: 1px solid #e7e0d4;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #f2ede5;
}

.modal-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 24px;
  font-weight: 600;
  color: #1e130a;
  margin: 0 0 4px;
}

.modal-subtitle {
  font-size: 13px;
  color: #7b6d60;
  margin: 0;
}

.modal-close-btn {
  background: none;
  border: none;
  color: #8d7e70;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: color 0.15s;
}

.modal-close-btn:hover {
  color: #241810;
}

.modal-close-btn svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 65vh;
  overflow-y: auto;
}

.pref-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pref-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #8b796c;
}

.pref-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pref-chip {
  padding: 7px 14px;
  border-radius: 9999px;
  border: 1.5px solid #e5ded2;
  background-color: #faf7f2;
  color: #4a3b30;
  font-size: 13px;
  font-weight: 450;
  cursor: pointer;
  transition: all 0.15s;
}

.pref-chip-active {
  background-color: #8b3e23;
  border-color: #8b3e23;
  color: #ffffff;
}

.price-options {
  display: flex;
  gap: 8px;
}

.price-btn {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: 1.5px solid #e5ded2;
  background-color: #faf7f2;
  font-size: 14px;
  font-weight: 600;
  color: #4a3b30;
  cursor: pointer;
  transition: all 0.15s;
}

.price-btn-active {
  background-color: #8b3e23;
  border-color: #8b3e23;
  color: #ffffff;
}

.pref-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1.5px solid #e5ded2;
  font-size: 14px;
  color: #241810;
  outline: none;
}

.pref-input:focus {
  border-color: #c9903a;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #f2ede5;
  background-color: #faf7f2;
}

.btn-cancel {
  padding: 9px 16px;
  border-radius: 8px;
  border: 1px solid #e5ded2;
  background: #ffffff;
  color: #4a3b30;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.btn-save-prefs {
  padding: 9px 20px;
  border-radius: 8px;
  border: none;
  background: #8b3e23;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s;
}

.btn-save-prefs:hover {
  background: #76341d;
}

/* Saved items list in modal */
.empty-saved {
  text-align: center;
  padding: 30px 16px;
  color: #8d7e70;
  font-size: 13.5px;
}

.empty-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 12px;
}

.saved-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.saved-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px;
  border-radius: 10px;
  background: #faf7f2;
  border: 1px solid #ece6db;
}

.saved-thumb {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}

.saved-info {
  flex: 1;
}

.saved-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e130a;
  margin: 0;
}

.saved-sub {
  font-size: 12px;
  color: #7b6d60;
  margin: 2px 0 0;
}

.saved-remove-btn {
  background: none;
  border: none;
  color: #a04030;
  cursor: pointer;
  padding: 6px 10px;
  font-size: 14px;
}

/* ─── Transitions ──────────────────────────────────────────────────────────── */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* ─── Responsive ───────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    transform: translateX(0);
    box-shadow: 2px 0 16px rgba(0,0,0,0.1);
  }

  .sidebar.sidebar-collapsed {
    transform: translateX(-100%);
    width: 256px;
    min-width: 256px;
  }

  .mobile-menu-btn {
    display: block;
  }

  .followup-bar-wrapper {
    left: 20px;
    right: 20px;
  }
}
</style>
