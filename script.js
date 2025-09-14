/**
 * FlashStudy - Progressive Web App for Flashcard Studies
 * 
 * A comprehensive flashcard application with deck management,
 * manual and CSV card creation, study sessions, and PWA capabilities.
 * 
 * @author FlashStudy Team
 * @version 1.0.0
 */

class FlashStudyApp {
  constructor() {
      this.currentUser = 'default';
      this.currentDeck = null;
      this.currentView = 'decks';
      this.studySession = {
          deck: null,
          cards: [],
          currentIndex: 0,
          isFlipped: false,
          completed: []
      };
      this.stats = this.loadStats();
      this.themes = ['light', 'dark'];
      this.currentTheme = localStorage.getItem('flashstudy-theme') || 'light';
      
      this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
      try {
          console.log('FlashStudy: Initializing application...');
          await this.showLoadingScreen();
          console.log('FlashStudy: Setting up event listeners...');
          this.setupEventListeners();
          console.log('FlashStudy: Applying theme...');
          this.applyTheme();
          console.log('FlashStudy: Loading data...');
          await this.loadData();
          console.log('FlashStudy: Rendering decks...');
          this.renderDecks();
          console.log('FlashStudy: Rendering stats...');
          this.renderStats();
          console.log('FlashStudy: Setting up PWA...');
          this.setupPWA();
          console.log('FlashStudy: Hiding loading screen...');
          await this.hideLoadingScreen();
          console.log('FlashStudy: Application initialized successfully');
          this.showNotification('success', 'Bem-vindo!', 'FlashStudy carregado com sucesso.');
      } catch (error) {
          console.error('FlashStudy: Error during initialization:', error);
          this.showNotification('error', 'Erro', 'Falha ao carregar o aplicativo.');
          await this.hideLoadingScreen();
      }
  }

  /**
   * Show loading screen with delay
   */
  async showLoadingScreen() {
      const loadingScreen = document.getElementById('loading-screen');
      const app = document.getElementById('app');
      
      if (loadingScreen) {
          loadingScreen.classList.remove('hidden');
      }
      if (app) {
          app.classList.add('hidden');
      }
      
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
  }

  /**
   * Hide loading screen
   */
  async hideLoadingScreen() {
      const loadingScreen = document.getElementById('loading-screen');
      const app = document.getElementById('app');
      
      if (loadingScreen) {
          loadingScreen.classList.add('hidden');
      }
      if (app) {
          app.classList.remove('hidden');
      }
      
      // Remove loading screen from DOM after transition
      setTimeout(() => {
          if (loadingScreen && loadingScreen.parentNode) {
              loadingScreen.remove();
          }
      }, 500);
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
      console.log('FlashStudy: Setting up event listeners...');
      
      // Navigation
      document.querySelectorAll('.nav-item').forEach(item => {
          item.addEventListener('click', (e) => {
              const view = e.target.dataset.view;
              this.switchView(view);
          });
      });

      // Theme toggle
      document.getElementById('theme-toggle').addEventListener('click', () => {
          this.toggleTheme();
      });

      // Deck management
      document.getElementById('create-deck-btn').addEventListener('click', () => {
          this.showDeckModal();
      });

      document.getElementById('save-deck').addEventListener('click', () => {
          this.saveDeck();
      });

      // Card management
      document.getElementById('card-form').addEventListener('submit', (e) => {
          e.preventDefault();
          this.addCard();
      });

      document.getElementById('validate-csv').addEventListener('click', () => {
          this.validateCSV();
      });

      document.getElementById('import-cards').addEventListener('click', () => {
          this.importCards();
      });

      document.getElementById('csv-file').addEventListener('change', (e) => {
          this.handleCSVFile(e.target.files[0]);
      });

      // Card form preview
      const questionInput = document.getElementById('card-question');
      const answerInput = document.getElementById('card-answer');
      
      questionInput.addEventListener('input', () => this.updateCardPreview());
      answerInput.addEventListener('input', () => this.updateCardPreview());

      // Study session
      console.log('FlashStudy: Setting up study session event listeners...');
      
      const backBtn = document.getElementById('back-to-selection');
      if (backBtn) {
          backBtn.addEventListener('click', (e) => {
              e.preventDefault();
              console.log('Back to selection clicked');
              this.endStudySession();
          });
      }

      const flipBtn = document.getElementById('flip-card');
      if (flipBtn) {
          flipBtn.addEventListener('click', (e) => {
              e.preventDefault();
              console.log('Flip card clicked');
              this.flipCard();
          });
      }

      const prevBtn = document.getElementById('prev-card');
      if (prevBtn) {
          prevBtn.addEventListener('click', (e) => {
              e.preventDefault();
              console.log('Previous card clicked');
              this.previousCard();
          });
      }

      const nextBtn = document.getElementById('next-card');
      if (nextBtn) {
          nextBtn.addEventListener('click', (e) => {
              e.preventDefault();
              console.log('Next card clicked');
              this.nextCard();
          });
      }

      const shuffleBtn = document.getElementById('shuffle-cards');
      if (shuffleBtn) {
          shuffleBtn.addEventListener('click', (e) => {
              e.preventDefault();
              console.log('Shuffle cards clicked');
              this.shuffleCards();
          });
      }

      const restartBtn = document.getElementById('restart-session');
      if (restartBtn) {
          restartBtn.addEventListener('click', (e) => {
              e.preventDefault();
              console.log('Restart session clicked');
              this.restartSession();
          });
      }

      const finishBtn = document.getElementById('finish-session');
      if (finishBtn) {
          finishBtn.addEventListener('click', (e) => {
              e.preventDefault();
              console.log('Finish session clicked');
              this.finishSession();
          });
      }

      // Flashcard click to flip
      document.getElementById('flashcard').addEventListener('click', () => {
          this.flipCard();
      });

      // Flashcard keyboard support
      document.getElementById('flashcard').addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.flipCard();
          }
      });

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
          if (this.currentView === 'study' && this.studySession.deck) {
              switch (e.key) {
                  case ' ':
                  case 'Enter':
                      e.preventDefault();
                      this.flipCard();
                      break;
                  case 'ArrowLeft':
                      e.preventDefault();
                      this.previousCard();
                      break;
                  case 'ArrowRight':
                      e.preventDefault();
                      this.nextCard();
                      break;
                  case 'r':
                      if (e.ctrlKey || e.metaKey) {
                          e.preventDefault();
                          this.shuffleCards();
                      }
                      break;
              }
          }
      });

      // Modal handling
      this.setupModalHandlers();

      // Tab switching
      this.setupTabHandlers();

      // Form validation
      this.setupFormValidation();

      // Deck name validation
      document.getElementById('deck-name').addEventListener('input', (e) => {
          this.validateDeckName(e.target.value);
      });

      // Outside click to close dropdowns
      document.addEventListener('click', (e) => {
          if (!e.target.closest('.deck-menu')) {
              document.querySelectorAll('.deck-menu-dropdown.show').forEach(dropdown => {
                  dropdown.classList.remove('show');
              });
          }
      });
  }

  /**
   * Setup modal event handlers
   */
  setupModalHandlers() {
      // Close modal buttons
      document.querySelectorAll('[data-dismiss="modal"]').forEach(btn => {
          btn.addEventListener('click', (e) => {
              const modal = e.target.closest('.modal-overlay');
              this.closeModal(modal);
          });
      });

      // Close modal on overlay click
      document.querySelectorAll('.modal-overlay').forEach(overlay => {
          overlay.addEventListener('click', (e) => {
              if (e.target === overlay) {
                  this.closeModal(overlay);
              }
          });
      });

      // Close modal with Escape key
      document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
              const openModal = document.querySelector('.modal-overlay.show');
              if (openModal) {
                  this.closeModal(openModal);
              }
          }
      });

      // Modal close buttons
      document.querySelectorAll('.modal-close').forEach(btn => {
          btn.addEventListener('click', (e) => {
              const modal = e.target.closest('.modal-overlay');
              this.closeModal(modal);
          });
      });
  }

  /**
   * Setup tab switching handlers
   */
  setupTabHandlers() {
      document.querySelectorAll('.tab-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
              const tabName = e.target.dataset.tab;
              this.switchTab(tabName);
          });
      });
  }

  /**
   * Setup form validation
   */
  setupFormValidation() {
      const deckNameInput = document.getElementById('deck-name');
      
      deckNameInput.addEventListener('blur', () => {
          this.validateDeckName(deckNameInput.value);
      });
  }

  /**
   * Switch between tabs in modals
   * @param {string} tabName - Tab to switch to
   */
  switchTab(tabName) {
      // Update tab buttons
      document.querySelectorAll('.tab-btn').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.tab === tabName);
      });

      // Update tab content
      document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.toggle('active', content.id === `${tabName}-tab`);
      });

      // Update list tab counter
      if (tabName === 'list') {
          this.updateListTabCounter();
      }
  }

  /**
   * Update the counter in the list tab
   */
  updateListTabCounter() {
      const listTab = document.querySelector('[data-tab="list"]');
      const count = this.currentDeck ? this.currentDeck.cards.length : 0;
      listTab.textContent = `Lista (${count})`;
  }

  /**
   * Apply theme to the application
   */
  applyTheme() {
      document.documentElement.setAttribute('data-theme', this.currentTheme);
      const themeToggle = document.getElementById('theme-toggle');
      themeToggle.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
      themeToggle.setAttribute('aria-label', 
          this.currentTheme === 'light' ? 'Mudar para tema escuro' : 'Mudar para tema claro'
      );
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('flashstudy-theme', this.currentTheme);
      this.applyTheme();
      
      const themeName = this.currentTheme === 'light' ? 'claro' : 'escuro';
      this.showNotification('info', 'Tema alterado', `Tema ${themeName} aplicado.`);
  }

  /**
   * Switch between different views
   * @param {string} view - View to switch to
   */
  switchView(view) {
      console.log('switchView called with:', view);
      this.currentView = view;

      // Update navigation
      document.querySelectorAll('.nav-item').forEach(item => {
          item.classList.toggle('active', item.dataset.view === view);
      });

      // Update view content
      document.querySelectorAll('.view').forEach(viewElement => {
          viewElement.classList.toggle('active', viewElement.id === `${view}-view`);
      });

      // Handle view-specific actions
      switch (view) {
          case 'decks':
              this.renderDecks();
              break;
          case 'study':
              this.renderStudyDecks();
              // Don't end study session when switching to study view
              break;
          case 'stats':
              this.renderStats();
              break;
      }
  }

  /**
   * Load data from localStorage
   */
  loadData() {
      try {
          const data = localStorage.getItem(`flashstudy-${this.currentUser}`);
          this.decks = data ? JSON.parse(data) : [];
          
          // Ensure data integrity
          this.decks = this.decks.map(deck => ({
              id: deck.id || this.generateId(),
              name: deck.name || 'Deck sem nome',
              description: deck.description || '',
              cards: Array.isArray(deck.cards) ? deck.cards : [],
              createdAt: deck.createdAt || new Date().toISOString(),
              updatedAt: deck.updatedAt || new Date().toISOString()
          }));
          
      } catch (error) {
          console.error('Erro ao carregar dados:', error);
          this.decks = [];
          this.showNotification('warning', 'Aviso', 'Não foi possível carregar alguns dados.');
      }
  }

  /**
   * Save data to localStorage
   */
  saveData() {
      try {
          localStorage.setItem(`flashstudy-${this.currentUser}`, JSON.stringify(this.decks));
          return true;
      } catch (error) {
          console.error('Erro ao salvar dados:', error);
          
          if (error.name === 'QuotaExceededError') {
              this.showNotification('error', 'Erro de Armazenamento', 
                  'Espaço de armazenamento esgotado. Remova alguns decks ou cards.');
          } else {
              this.showNotification('error', 'Erro', 'Não foi possível salvar os dados.');
          }
          return false;
      }
  }

  /**
   * Load statistics from localStorage
   */
  loadStats() {
      try {
          const stats = localStorage.getItem(`flashstudy-stats-${this.currentUser}`);
          return stats ? JSON.parse(stats) : {
              totalDecks: 0,
              totalCards: 0,
              studySessions: 0,
              cardsStudied: 0,
              timeSpent: 0,
              streak: 0,
              lastStudy: null
          };
      } catch (error) {
          console.error('Erro ao carregar estatísticas:', error);
          return {
              totalDecks: 0,
              totalCards: 0,
              studySessions: 0,
              cardsStudied: 0,
              timeSpent: 0,
              streak: 0,
              lastStudy: null
          };
      }
  }

  /**
   * Save statistics to localStorage
   */
  saveStats() {
      try {
          localStorage.setItem(`flashstudy-stats-${this.currentUser}`, JSON.stringify(this.stats));
      } catch (error) {
          console.error('Erro ao salvar estatísticas:', error);
      }
  }

  /**
   * Update statistics
   * @param {Object} updates - Statistics updates
   */
  updateStats(updates) {
      Object.assign(this.stats, updates);
      this.saveStats();
  }

  /**
   * Generate a unique ID
   * @returns {string} Unique identifier
   */
  generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Show a notification to the user
   * @param {string} type - Notification type (success, error, warning, info)
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   */
  showNotification(type, title, message) {
      const container = document.getElementById('notifications');
      if (!container) {
          console.log('Notification container not found, skipping notification');
          return;
      }

      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      
      const icons = {
          success: '✅',
          error: '❌',
          warning: '⚠️',
          info: 'ℹ️'
      };

      notification.innerHTML = `
          <div class="notification-icon">${icons[type] || icons.info}</div>
          <div class="notification-content">
              <div class="notification-title">${title}</div>
              <div class="notification-message">${message}</div>
          </div>
          <button class="notification-close">&times;</button>
      `;

      // Add close functionality
      const closeBtn = notification.querySelector('.notification-close');
      closeBtn.addEventListener('click', () => {
          this.dismissNotification(notification);
      });

      container.appendChild(notification);

      // Show with animation
      setTimeout(() => notification.classList.add('show'), 100);

      // Auto dismiss after 5 seconds for success/info, 8 seconds for warnings/errors
      const duration = (type === 'success' || type === 'info') ? 5000 : 8000;
      setTimeout(() => {
          if (notification.parentNode) {
              this.dismissNotification(notification);
          }
      }, duration);
  }

  /**
   * Dismiss a notification
   * @param {HTMLElement} notification - Notification element to dismiss
   */
  dismissNotification(notification) {
      notification.classList.remove('show');
      setTimeout(() => {
          if (notification.parentNode) {
              notification.remove();
          }
      }, 300);
  }

  /**
   * Show a modal
   * @param {string} modalId - ID of the modal to show
   */
  showModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
          modal.classList.add('show');
          document.body.style.overflow = 'hidden';
          
          // Focus first input
          setTimeout(() => {
              const firstInput = modal.querySelector('input, textarea, button');
              if (firstInput) firstInput.focus();
          }, 100);
      }
  }

  /**
   * Close a modal
   * @param {HTMLElement} modal - Modal element to close
   */
  closeModal(modal) {
      if (modal) {
          modal.classList.remove('show');
          document.body.style.overflow = '';
          
          // Reset form if present
          const form = modal.querySelector('form');
          if (form) {
              form.reset();
              this.clearFormValidation(form);
          }
          
          // Clear any temporary data
          this.currentDeck = null;
          this.clearCardPreview();
          this.clearImportPreview();
      }
  }

  /**
   * Clear form validation messages
   * @param {HTMLElement} form - Form element
   */
  clearFormValidation(form) {
      form.querySelectorAll('.form-feedback').forEach(feedback => {
          feedback.textContent = '';
          feedback.className = 'form-feedback';
      });
      
      form.querySelectorAll('input, textarea').forEach(input => {
          input.classList.remove('error', 'success');
      });
  }

  /**
   * Show confirmation modal
   * @param {string} title - Modal title
   * @param {string} message - Confirmation message
   * @param {Function} callback - Callback function for confirmation
   */
  showConfirmation(title, message, callback) {
      const modal = document.getElementById('confirm-modal');
      const titleElement = document.getElementById('confirm-title');
      const messageElement = document.getElementById('confirm-message');
      const confirmButton = document.getElementById('confirm-action');

      titleElement.textContent = title;
      messageElement.textContent = message;

      // Remove previous event listeners
      const newConfirmButton = confirmButton.cloneNode(true);
      confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);

      // Add new event listener
      newConfirmButton.addEventListener('click', () => {
          callback();
          this.closeModal(modal);
      });

      this.showModal('confirm-modal');
  }

  /**
   * Render decks in the decks view
   */
  renderDecks() {
      const container = document.getElementById('decks-grid');
      const emptyState = document.getElementById('empty-decks');

      if (this.decks.length === 0) {
          container.style.display = 'none';
          emptyState.classList.remove('hidden');
          
          // Add event listener to empty state button
          const emptyButton = emptyState.querySelector('.btn-primary');
          emptyButton.replaceWith(emptyButton.cloneNode(true));
          emptyState.querySelector('.btn-primary').addEventListener('click', () => {
              this.showDeckModal();
          });
          return;
      }

      container.style.display = 'grid';
      emptyState.classList.add('hidden');

      container.innerHTML = this.decks.map(deck => `
          <div class="deck-card" data-deck-id="${deck.id}">
              <div class="deck-header">
                  <h3 class="deck-title">${this.escapeHtml(deck.name)}</h3>
                  <div class="deck-menu">
                      <button class="deck-menu-btn" aria-label="Menu do deck">⋮</button>
                      <div class="deck-menu-dropdown">
                          <button class="deck-menu-item" onclick="app.editDeck('${deck.id}')">
                              ✏️ Editar
                          </button>
                          <button class="deck-menu-item" onclick="app.manageCards('${deck.id}')">
                              📝 Gerenciar Cards
                          </button>
                          <button class="deck-menu-item" onclick="app.startStudySession('${deck.id}')">
                              🎯 Estudar
                          </button>
                          <button class="deck-menu-item danger" onclick="app.deleteDeck('${deck.id}')">
                              🗑️ Excluir
                          </button>
                      </div>
                  </div>
              </div>
              ${deck.description ? `<p class="deck-description">${this.escapeHtml(deck.description)}</p>` : ''}
              <div class="deck-stats">
                  <div class="deck-count">
                      📄 ${deck.cards.length} flashcard${deck.cards.length !== 1 ? 's' : ''}
                  </div>
                  <div class="deck-actions">
                      <button class="deck-action" onclick="app.manageCards('${deck.id}')">
                          Gerenciar
                      </button>
                      ${deck.cards.length > 0 ? `
                      <button class="deck-action secondary" onclick="app.startStudySession('${deck.id}')">
                          Estudar
                      </button>
                      ` : ''}
                  </div>
              </div>
          </div>
      `).join('');

      // Add menu toggle functionality
      container.querySelectorAll('.deck-menu-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
              e.stopPropagation();
              const dropdown = btn.nextElementSibling;
              const isOpen = dropdown.classList.contains('show');
              
              // Close all other dropdowns
              document.querySelectorAll('.deck-menu-dropdown.show').forEach(d => {
                  d.classList.remove('show');
              });
              
              // Toggle current dropdown
              if (!isOpen) {
                  dropdown.classList.add('show');
              }
          });
      });
  }

  /**
   * Render decks for study selection
   */
  renderStudyDecks() {
      const container = document.getElementById('study-decks-grid');
      const decksWithCards = this.decks.filter(deck => deck.cards.length > 0);

      if (decksWithCards.length === 0) {
          container.innerHTML = `
              <div class="empty-state">
                  <div class="empty-icon">📚</div>
                  <h3>Nenhum deck disponível</h3>
                  <p>Crie decks com flashcards para começar a estudar!</p>
                  <button class="btn-primary" onclick="app.switchView('decks')">
                      Criar Deck
                  </button>
              </div>
          `;
          return;
      }

      container.innerHTML = decksWithCards.map(deck => `
          <div class="deck-card" onclick="app.startStudySession('${deck.id}')">
              <div class="deck-header">
                  <h3 class="deck-title">${this.escapeHtml(deck.name)}</h3>
              </div>
              ${deck.description ? `<p class="deck-description">${this.escapeHtml(deck.description)}</p>` : ''}
              <div class="deck-stats">
                  <div class="deck-count">
                      📄 ${deck.cards.length} flashcard${deck.cards.length !== 1 ? 's' : ''}
                  </div>
                  <div class="deck-actions">
                      <button class="deck-action" onclick="event.stopPropagation(); app.startStudySession('${deck.id}')">
                          🎯 Estudar Agora
                      </button>
                  </div>
              </div>
          </div>
      `).join('');
  }

  /**
   * Render statistics
   */
  renderStats() {
      const container = document.getElementById('stats-content');
      
      // Update current stats
      this.stats.totalDecks = this.decks.length;
      this.stats.totalCards = this.decks.reduce((total, deck) => total + deck.cards.length, 0);
      
      const stats = [
          {
              icon: '📚',
              value: this.stats.totalDecks,
              label: 'Decks Criados',
              color: 'primary'
          },
          {
              icon: '📄',
              value: this.stats.totalCards,
              label: 'Total de Cards',
              color: 'secondary'
          },
          {
              icon: '🎯',
              value: this.stats.studySessions,
              label: 'Sessões de Estudo',
              color: 'accent'
          },
          {
              icon: '🏆',
              value: this.stats.cardsStudied,
              label: 'Cards Estudados',
              color: 'success'
          },
          {
              icon: '⏱️',
              value: this.formatTime(this.stats.timeSpent),
              label: 'Tempo de Estudo',
              color: 'warning'
          },
          {
              icon: '🔥',
              value: this.stats.streak,
              label: 'Sequência Atual',
              color: 'error'
          }
      ];

      container.innerHTML = stats.map(stat => `
          <div class="stat-card">
              <div class="stat-icon">${stat.icon}</div>
              <div class="stat-value">${stat.value}</div>
              <div class="stat-label">${stat.label}</div>
          </div>
      `).join('');

      this.saveStats();
  }

  /**
   * Format time in hours and minutes
   * @param {number} minutes - Time in minutes
   * @returns {string} Formatted time string
   */
  formatTime(minutes) {
      if (minutes < 60) {
          return `${minutes}min`;
      }
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}min`;
  }

  /**
   * Show deck creation/edit modal
   * @param {string} deckId - Optional deck ID for editing
   */
  showDeckModal(deckId = null) {
      const modal = document.getElementById('deck-modal');
      const title = document.getElementById('deck-modal-title');
      const nameInput = document.getElementById('deck-name');
      const descriptionInput = document.getElementById('deck-description');

      if (deckId) {
          const deck = this.decks.find(d => d.id === deckId);
          if (!deck) return;

          title.textContent = 'Editar Deck';
          nameInput.value = deck.name;
          descriptionInput.value = deck.description || '';
          this.currentDeck = deck;
      } else {
          title.textContent = 'Novo Deck';
          nameInput.value = '';
          descriptionInput.value = '';
          this.currentDeck = null;
      }

      this.showModal('deck-modal');
  }

  /**
   * Validate deck name
   * @param {string} name - Deck name to validate
   * @returns {boolean} True if valid
   */
  validateDeckName(name) {
      const feedback = document.getElementById('deck-name-feedback');
      const input = document.getElementById('deck-name');
      
      if (!name.trim()) {
          feedback.textContent = 'Nome é obrigatório';
          feedback.className = 'form-feedback error';
          input.classList.add('error');
          return false;
      }

      if (name.trim().length < 2) {
          feedback.textContent = 'Nome deve ter pelo menos 2 caracteres';
          feedback.className = 'form-feedback error';
          input.classList.add('error');
          return false;
      }

      if (name.trim().length > 50) {
          feedback.textContent = 'Nome deve ter no máximo 50 caracteres';
          feedback.className = 'form-feedback error';
          input.classList.add('error');
          return false;
      }

      // Check for duplicate names (excluding current deck being edited)
      const existingDeck = this.decks.find(deck => 
          deck.name.toLowerCase().trim() === name.toLowerCase().trim() &&
          deck.id !== (this.currentDeck?.id)
      );

      if (existingDeck) {
          feedback.textContent = 'Já existe um deck com este nome';
          feedback.className = 'form-feedback error';
          input.classList.add('error');
          return false;
      }

      feedback.textContent = '';
      feedback.className = 'form-feedback';
      input.classList.remove('error');
      return true;
  }

  /**
   * Save deck (create or update)
   */
  saveDeck() {
      const nameInput = document.getElementById('deck-name');
      const descriptionInput = document.getElementById('deck-description');
      
      const name = nameInput.value.trim();
      const description = descriptionInput.value.trim();

      if (!this.validateDeckName(name)) {
          nameInput.focus();
          return;
      }

      if (this.currentDeck) {
          // Update existing deck
          this.currentDeck.name = name;
          this.currentDeck.description = description;
          this.currentDeck.updatedAt = new Date().toISOString();
          
          this.showNotification('success', 'Deck Atualizado', 'Deck editado com sucesso.');
      } else {
          // Create new deck
          const newDeck = {
              id: this.generateId(),
              name,
              description,
              cards: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
          };
          
          this.decks.push(newDeck);
          this.showNotification('success', 'Deck Criado', 'Novo deck criado com sucesso.');
      }

      if (this.saveData()) {
          this.renderDecks();
          this.renderStats();
          this.closeModal(document.getElementById('deck-modal'));
      }
  }

  /**
   * Edit a deck
   * @param {string} deckId - Deck ID to edit
   */
  editDeck(deckId) {
      this.showDeckModal(deckId);
  }

  /**
   * Delete a deck
   * @param {string} deckId - Deck ID to delete
   */
  deleteDeck(deckId) {
      const deck = this.decks.find(d => d.id === deckId);
      if (!deck) return;

      const cardCount = deck.cards.length;
      const message = cardCount > 0 
          ? `Tem certeza que deseja excluir o deck "${deck.name}"?\n\nEsta ação irá remover permanentemente ${cardCount} flashcard${cardCount !== 1 ? 's' : ''} e não pode ser desfeita.`
          : `Tem certeza que deseja excluir o deck "${deck.name}"?`;

      this.showConfirmation('Excluir Deck', message, () => {
          this.decks = this.decks.filter(d => d.id !== deckId);
          
          if (this.saveData()) {
              this.renderDecks();
              this.renderStats();
              this.showNotification('success', 'Deck Excluído', 
                  `Deck "${deck.name}" foi removido com sucesso.`);
          }
      });
  }

  /**
   * Show cards management modal
   * @param {string} deckId - Deck ID to manage
   */
  manageCards(deckId) {
      const deck = this.decks.find(d => d.id === deckId);
      if (!deck) return;

      this.currentDeck = deck;
      
      const modal = document.getElementById('cards-modal');
      const title = document.getElementById('cards-modal-title');
      
      title.textContent = `Gerenciar Cards - ${deck.name}`;
      
      this.switchTab('manual');
      this.renderCardsList();
      this.updateListTabCounter();
      this.showModal('cards-modal');
  }

  /**
   * Update card preview when user types
   */
  updateCardPreview() {
      const question = document.getElementById('card-question').value.trim();
      const answer = document.getElementById('card-answer').value.trim();
      const preview = document.getElementById('card-preview');
      const previewQuestion = document.getElementById('preview-question');
      const previewAnswer = document.getElementById('preview-answer');

      if (question || answer) {
          preview.style.display = 'block';
          previewQuestion.textContent = question || 'Digite a pergunta...';
          previewAnswer.textContent = answer || 'Digite a resposta...';
      } else {
          preview.style.display = 'none';
      }
  }

  /**
   * Clear card preview
   */
  clearCardPreview() {
      const preview = document.getElementById('card-preview');
      preview.style.display = 'none';
  }

  /**
   * Add a new flashcard
   */
  addCard() {
      if (!this.currentDeck) return;

      const questionInput = document.getElementById('card-question');
      const answerInput = document.getElementById('card-answer');
      
      const question = questionInput.value.trim();
      const answer = answerInput.value.trim();

      if (!question) {
          this.showNotification('error', 'Erro', 'A pergunta é obrigatória.');
          questionInput.focus();
          return;
      }

      if (!answer) {
          this.showNotification('error', 'Erro', 'A resposta é obrigatória.');
          answerInput.focus();
          return;
      }

      if (question.length > 500) {
          this.showNotification('error', 'Erro', 'A pergunta deve ter no máximo 500 caracteres.');
          questionInput.focus();
          return;
      }

      if (answer.length > 500) {
          this.showNotification('error', 'Erro', 'A resposta deve ter no máximo 500 caracteres.');
          answerInput.focus();
          return;
      }

      // Check for duplicate questions
      const existingCard = this.currentDeck.cards.find(card => 
          card.question.toLowerCase().trim() === question.toLowerCase().trim()
      );

      if (existingCard) {
          this.showNotification('warning', 'Aviso', 'Já existe um card com esta pergunta.');
          questionInput.focus();
          return;
      }

      const newCard = {
          id: this.generateId(),
          question,
          answer,
          createdAt: new Date().toISOString()
      };

      this.currentDeck.cards.push(newCard);
      this.currentDeck.updatedAt = new Date().toISOString();

      if (this.saveData()) {
          questionInput.value = '';
          answerInput.value = '';
          this.clearCardPreview();
          
          this.renderCardsList();
          this.updateListTabCounter();
          this.renderDecks();
          
          this.showNotification('success', 'Card Adicionado', 'Flashcard criado com sucesso.');
          questionInput.focus();
      }
  }

  /**
   * Render cards list in the modal
   */
  renderCardsList() {
      const container = document.getElementById('cards-list');
      
      if (!this.currentDeck || this.currentDeck.cards.length === 0) {
          container.innerHTML = `
              <div class="empty-state">
                  <div class="empty-icon">📄</div>
                  <h4>Nenhum flashcard encontrado</h4>
                  <p>Adicione cards usando a aba Manual ou Importar CSV.</p>
              </div>
          `;
          return;
      }

      container.innerHTML = this.currentDeck.cards.map((card, index) => `
          <div class="card-item">
              <div class="card-item-header">
                  <h4 class="card-item-question">${this.escapeHtml(card.question)}</h4>
                  <div class="card-item-actions">
                      <button class="card-action" onclick="app.editCard(${index})" title="Editar">
                          ✏️
                      </button>
                      <button class="card-action danger" onclick="app.deleteCard(${index})" title="Excluir">
                          🗑️
                      </button>
                  </div>
              </div>
              <p class="card-item-answer">${this.escapeHtml(card.answer)}</p>
          </div>
      `).join('');
  }

  /**
   * Edit a flashcard
   * @param {number} index - Card index
   */
  editCard(index) {
      if (!this.currentDeck || !this.currentDeck.cards[index]) return;

      const card = this.currentDeck.cards[index];
      const questionInput = document.getElementById('card-question');
      const answerInput = document.getElementById('card-answer');

      questionInput.value = card.question;
      answerInput.value = card.answer;
      
      this.updateCardPreview();
      this.switchTab('manual');

      // Remove the card temporarily for editing
      this.currentDeck.cards.splice(index, 1);
      this.renderCardsList();
      this.updateListTabCounter();

      this.showNotification('info', 'Editando Card', 'Card carregado para edição.');
      questionInput.focus();
  }

  /**
   * Delete a flashcard
   * @param {number} index - Card index
   */
  deleteCard(index) {
      if (!this.currentDeck || !this.currentDeck.cards[index]) return;

      const card = this.currentDeck.cards[index];
      
      this.showConfirmation(
          'Excluir Flashcard',
          `Tem certeza que deseja excluir este flashcard?\n\nPergunta: "${card.question.substring(0, 50)}${card.question.length > 50 ? '...' : ''}"`,
          () => {
              this.currentDeck.cards.splice(index, 1);
              this.currentDeck.updatedAt = new Date().toISOString();
              
              if (this.saveData()) {
                  this.renderCardsList();
                  this.updateListTabCounter();
                  this.renderDecks();
                  this.showNotification('success', 'Card Excluído', 'Flashcard removido com sucesso.');
              }
          }
      );
  }

  /**
   * Handle CSV file upload
   * @param {File} file - CSV file
   */
  async handleCSVFile(file) {
      if (!file) return;

      if (!file.type.includes('csv') && !file.type.includes('text')) {
          this.showNotification('error', 'Erro', 'Por favor, selecione um arquivo CSV válido.');
          return;
      }

      if (file.size > 1024 * 1024) { // 1MB limit
          this.showNotification('error', 'Erro', 'Arquivo muito grande. Limite máximo: 1MB.');
          return;
      }

      try {
          const text = await file.text();
          document.getElementById('csv-text').value = text;
          this.showNotification('info', 'Arquivo Carregado', 'CSV carregado. Clique em "Validar" para verificar o formato.');
      } catch (error) {
          console.error('Erro ao ler arquivo:', error);
          this.showNotification('error', 'Erro', 'Não foi possível ler o arquivo CSV.');
      }
  }

  /**
   * Validate CSV format
   */
  validateCSV() {
      const csvText = document.getElementById('csv-text').value.trim();
      
      if (!csvText) {
          this.showNotification('error', 'Erro', 'Por favor, cole o texto CSV ou selecione um arquivo.');
          return;
      }

      try {
          const lines = csvText.split('\n').filter(line => line.trim());
          const cards = [];
          const errors = [];

          lines.forEach((line, index) => {
              const trimmedLine = line.trim();
              if (!trimmedLine) return;

              const parts = trimmedLine.split(',');
              
              if (parts.length < 2) {
                  errors.push(`Linha ${index + 1}: Formato inválido. Use: pergunta,resposta`);
                  return;
              }

              const question = parts[0].trim().replace(/^["']|["']$/g, '');
              const answer = parts.slice(1).join(',').trim().replace(/^["']|["']$/g, '');

              if (!question) {
                  errors.push(`Linha ${index + 1}: Pergunta vazia`);
                  return;
              }

              if (!answer) {
                  errors.push(`Linha ${index + 1}: Resposta vazia`);
                  return;
              }

              if (question.length > 500) {
                  errors.push(`Linha ${index + 1}: Pergunta muito longa (máximo 500 caracteres)`);
                  return;
              }

              if (answer.length > 500) {
                  errors.push(`Linha ${index + 1}: Resposta muito longa (máximo 500 caracteres)`);
                  return;
              }

              cards.push({ question, answer });
          });

          this.showImportPreview(cards, errors);

      } catch (error) {
          console.error('Erro ao validar CSV:', error);
          this.showNotification('error', 'Erro', 'Formato CSV inválido.');
      }
  }

  /**
   * Show import preview
   * @param {Array} cards - Valid cards
   * @param {Array} errors - Validation errors
   */
  showImportPreview(cards, errors) {
      const preview = document.getElementById('import-preview');
      const importButton = document.getElementById('import-cards');
      
      preview.style.display = 'block';
      
      const validCount = cards.length;
      const errorCount = errors.length;
      
      let html = `
          <h4>🔍 Resultado da Validação</h4>
          <div class="preview-stats">
              <div class="preview-stat success">
                  <span>✅</span>
                  <span>${validCount} cards válidos</span>
              </div>
      `;
      
      if (errorCount > 0) {
          html += `
              <div class="preview-stat error">
                  <span>❌</span>
                  <span>${errorCount} erros encontrados</span>
              </div>
          `;
      }
      
      html += `</div>`;

      if (validCount > 0) {
          html += `
              <h5>Cards que serão importados:</h5>
              <div class="preview-items">
                  ${cards.slice(0, 5).map(card => `
                      <div class="preview-item">
                          <strong>P:</strong> ${this.escapeHtml(card.question)}<br>
                          <strong>R:</strong> ${this.escapeHtml(card.answer)}
                      </div>
                  `).join('')}
                  ${cards.length > 5 ? `<div class="preview-item">... e mais ${cards.length - 5} cards</div>` : ''}
              </div>
          `;
      }

      if (errorCount > 0) {
          html += `
              <h5>Erros encontrados:</h5>
              <div class="preview-items">
                  ${errors.slice(0, 10).map(error => `
                      <div class="preview-item error">${error}</div>
                  `).join('')}
                  ${errors.length > 10 ? `<div class="preview-item">... e mais ${errors.length - 10} erros</div>` : ''}
              </div>
          `;
      }

      preview.innerHTML = html;
      
      importButton.disabled = validCount === 0;
      this.validatedCards = cards;

      if (validCount > 0) {
          const message = errorCount > 0 
              ? `${validCount} cards válidos encontrados, mas há ${errorCount} erros.`
              : `${validCount} cards válidos encontrados!`;
          
          this.showNotification(
              errorCount > 0 ? 'warning' : 'success',
              'Validação Concluída',
              message
          );
      } else {
          this.showNotification('error', 'Erro na Validação', 
              'Nenhum card válido encontrado. Verifique o formato.');
      }
  }

  /**
   * Clear import preview
   */
  clearImportPreview() {
      const preview = document.getElementById('import-preview');
      preview.style.display = 'none';
      preview.innerHTML = '';
      
      const importButton = document.getElementById('import-cards');
      importButton.disabled = true;
      
      this.validatedCards = null;
  }

  /**
   * Import validated cards
   */
  importCards() {
      if (!this.currentDeck || !this.validatedCards || this.validatedCards.length === 0) {
          this.showNotification('error', 'Erro', 'Nenhum card válido para importar.');
          return;
      }

      let importedCount = 0;
      let skippedCount = 0;

      this.validatedCards.forEach(cardData => {
          // Check for duplicate questions
          const existingCard = this.currentDeck.cards.find(card => 
              card.question.toLowerCase().trim() === cardData.question.toLowerCase().trim()
          );

          if (existingCard) {
              skippedCount++;
              return;
          }

          const newCard = {
              id: this.generateId(),
              question: cardData.question,
              answer: cardData.answer,
              createdAt: new Date().toISOString()
          };

          this.currentDeck.cards.push(newCard);
          importedCount++;
      });

      this.currentDeck.updatedAt = new Date().toISOString();

      if (this.saveData()) {
          // Clear form and preview
          document.getElementById('csv-text').value = '';
          document.getElementById('csv-file').value = '';
          this.clearImportPreview();
          
          // Update UI
          this.renderCardsList();
          this.updateListTabCounter();
          this.renderDecks();
          
          // Show result notification
          let message = `${importedCount} cards importados com sucesso.`;
          if (skippedCount > 0) {
              message += ` ${skippedCount} cards foram ignorados (perguntas duplicadas).`;
          }
          
          this.showNotification('success', 'Importação Concluída', message);
          
          // Switch to list tab to show imported cards
          this.switchTab('list');
      }
  }

  /**
   * Start a study session
   * @param {string} deckId - Deck ID to study
   */
  startStudySession(deckId) {
      console.log('startStudySession called with deckId:', deckId);
      console.log('Available decks:', this.decks);
      
      const deck = this.decks.find(d => d.id === deckId);
      if (!deck) {
          console.log('Deck not found for ID:', deckId);
          this.showNotification('error', 'Erro', 'Deck não encontrado.');
          return;
      }
      if (deck.cards.length === 0) {
          console.log('Deck has no cards');
          this.showNotification('error', 'Erro', 'Este deck não possui flashcards.');
          return;
      }

      console.log('Creating study session with deck:', deck.name, 'cards:', deck.cards.length);
      this.studySession = {
          deck: deck,
          cards: [...deck.cards], // Create a copy
          currentIndex: 0,
          isFlipped: false,
          completed: [],
          startTime: Date.now()
      };

      console.log('Study session created:', this.studySession);
      
      this.shuffleCards();
      this.switchView('study');
      this.showStudySession();
      
      this.showNotification('info', 'Sessão Iniciada', 
          `Estudando "${deck.name}" com ${deck.cards.length} cards.`);
  }

  /**
   * Show study session interface
   */
  showStudySession() {
      console.log('showStudySession called');
      const selection = document.getElementById('deck-selection');
      const session = document.getElementById('study-session');
      
      if (selection) {
          selection.style.display = 'none';
      }
      if (session) {
          session.classList.remove('hidden');
      }
      
      this.updateStudyCard();
  }

  /**
   * Update the current study card
   */
  updateStudyCard() {
      console.log('updateStudyCard called');
      if (!this.studySession.deck) {
          console.log('No study session deck');
          return;
      }

      const currentCard = document.getElementById('current-card');
      const totalCards = document.getElementById('total-cards');
      const flashcard = document.getElementById('flashcard');
      const questionContent = document.getElementById('question-content');
      const answerContent = document.getElementById('answer-content');

      if (!currentCard || !totalCards || !flashcard || !questionContent || !answerContent) {
          console.log('Required elements not found');
          return;
      }

      currentCard.textContent = this.studySession.currentIndex + 1;
      totalCards.textContent = this.studySession.cards.length;

      const card = this.studySession.cards[this.studySession.currentIndex];
      if (card) {
          questionContent.textContent = card.question;
          answerContent.textContent = card.answer;
          console.log('Updated card content:', card.question);
      } else {
          console.log('No card found at index:', this.studySession.currentIndex);
      }

      // Always reset flip state when changing cards
      flashcard.classList.remove('flipped');
      this.studySession.isFlipped = false;

      // Update navigation buttons
      const prevBtn = document.getElementById('prev-card');
      const nextBtn = document.getElementById('next-card');
      
      if (prevBtn && nextBtn) {
          prevBtn.disabled = this.studySession.currentIndex === 0;
          nextBtn.disabled = this.studySession.currentIndex === this.studySession.cards.length - 1;
          console.log('Updated button states - prev disabled:', prevBtn.disabled, 'next disabled:', nextBtn.disabled);
      }
  }

  /**
   * Flip the current flashcard
   */
  flipCard() {
      console.log('flipCard called');
      if (!this.studySession.deck) {
          console.log('No study session deck');
          return;
      }

      const flashcard = document.getElementById('flashcard');
      if (!flashcard) {
          console.log('Flashcard element not found');
          return;
      }

      this.studySession.isFlipped = !this.studySession.isFlipped;
      console.log('Flipped state:', this.studySession.isFlipped);
      
      // Add visual feedback
      flashcard.style.transform = 'scale(0.98)';
      setTimeout(() => {
          flashcard.style.transform = '';
      }, 150);
      
      if (this.studySession.isFlipped) {
          flashcard.classList.add('flipped');
          console.log('Card flipped to show answer');
          // Add haptic feedback if available
          if (navigator.vibrate) {
              navigator.vibrate(50);
          }
      } else {
          flashcard.classList.remove('flipped');
          console.log('Card flipped to show question');
          // Add haptic feedback if available
          if (navigator.vibrate) {
              navigator.vibrate(30);
          }
      }
  }

  /**
   * Go to previous card
   */
  previousCard() {
      console.log('previousCard called');
      if (!this.studySession.deck) {
          console.log('No study session deck');
          return;
      }
      if (this.studySession.currentIndex <= 0) {
          console.log('Already at first card');
          return;
      }

      this.studySession.currentIndex--;
      console.log('Moved to card index:', this.studySession.currentIndex);
      this.updateStudyCard();
  }

  /**
   * Go to next card
   */
  nextCard() {
      console.log('nextCard called');
      if (!this.studySession.deck) {
          console.log('No study session deck');
          return;
      }
      if (this.studySession.currentIndex >= this.studySession.cards.length - 1) {
          console.log('Already at last card');
          return;
      }

      this.studySession.currentIndex++;
      console.log('Moved to card index:', this.studySession.currentIndex);
      this.updateStudyCard();
  }

  /**
   * Shuffle cards in current session
   */
  shuffleCards() {
      if (!this.studySession.deck || !this.studySession.cards) return;

      // Fisher-Yates shuffle algorithm
      for (let i = this.studySession.cards.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.studySession.cards[i], this.studySession.cards[j]] = 
          [this.studySession.cards[j], this.studySession.cards[i]];
      }

      this.studySession.currentIndex = 0;
      this.studySession.isFlipped = false;
      this.updateStudyCard();
      
      this.showNotification('info', 'Cards Embaralhados', 'Ordem dos cards alterada aleatoriamente.');
  }

  /**
   * Restart current study session
   */
  restartSession() {
      if (!this.studySession.deck) return;

      this.showConfirmation(
          'Reiniciar Sessão',
          'Tem certeza que deseja reiniciar a sessão de estudo?',
          () => {
              this.studySession.currentIndex = 0;
              this.studySession.completed = [];
              this.studySession.isFlipped = false;
              this.shuffleCards();
              this.showNotification('info', 'Sessão Reiniciada', 'Voltando ao primeiro card.');
          }
      );
  }

  /**
   * Finish current study session
   */
  finishSession() {
      if (!this.studySession.deck) return;

      const timeSpent = Math.round((Date.now() - this.studySession.startTime) / 1000 / 60);
      const cardsStudied = this.studySession.currentIndex + 1;

      // Update statistics
      this.updateStats({
          studySessions: this.stats.studySessions + 1,
          cardsStudied: this.stats.cardsStudied + cardsStudied,
          timeSpent: this.stats.timeSpent + timeSpent,
          lastStudy: new Date().toISOString()
      });

      this.showNotification('success', 'Sessão Finalizada', 
          `Parabéns! Você estudou ${cardsStudied} cards em ${timeSpent} minutos.`);

      this.endStudySession();
  }

  /**
   * End current study session
   */
  endStudySession() {
      const selection = document.getElementById('deck-selection');
      const session = document.getElementById('study-session');
      
      selection.style.display = 'block';
      session.classList.add('hidden');
      
      this.studySession = {
          deck: null,
          cards: [],
          currentIndex: 0,
          isFlipped: false,
          completed: []
      };
  }

  /**
   * Setup Progressive Web App features
   */
  setupPWA() {
      // Register service worker
      if ('serviceWorker' in navigator) {
          // Check if we're in a supported environment (not StackBlitz)
          const isStackBlitz = window.location.hostname === 'localhost' && window.location.port === '5173';
          
          if (!isStackBlitz) {
              navigator.serviceWorker.register('sw.js')
                  .then(registration => {
                      console.log('Service Worker registrado:', registration);
                  })
                  .catch(error => {
                      console.error('Erro ao registrar Service Worker:', error);
                  });
          } else {
              console.log('Service Worker não registrado: ambiente de desenvolvimento detectado');
          }
      }

      // Handle install prompt
      let deferredPrompt;
      const installBanner = document.getElementById('install-banner');
      const installButton = document.getElementById('install-button');
      const dismissInstall = document.getElementById('dismiss-install');

      window.addEventListener('beforeinstallprompt', (e) => {
          e.preventDefault();
          deferredPrompt = e;
          
          // Show install banner if not dismissed and not installed
          const dismissed = localStorage.getItem('install-banner-dismissed');
          if (!dismissed && !window.matchMedia('(display-mode: standalone)').matches) {
              installBanner.classList.remove('hidden');
          }
      });

      installButton.addEventListener('click', async () => {
          if (deferredPrompt) {
              deferredPrompt.prompt();
              const { outcome } = await deferredPrompt.userChoice;
              
              if (outcome === 'accepted') {
                  this.showNotification('success', 'App Instalado', 
                      'FlashStudy foi instalado com sucesso!');
              }
              
              deferredPrompt = null;
              installBanner.classList.add('hidden');
          }
      });

      dismissInstall.addEventListener('click', () => {
          installBanner.classList.add('hidden');
          localStorage.setItem('install-banner-dismissed', 'true');
      });

      // Handle app installed
      window.addEventListener('appinstalled', () => {
          installBanner.classList.add('hidden');
          this.showNotification('success', 'App Instalado', 
              'FlashStudy foi adicionado à sua tela inicial!');
      });
  }

  /**
   * Escape HTML characters to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
  }
}

// Global app instance
let app;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  app = new FlashStudyApp();
  window.app = app
});

// Handle unload to save data
window.addEventListener('beforeunload', () => {
  if (app) {
      app.saveData();
      app.saveStats();
  }
});

// Handle online/offline status
window.addEventListener('online', () => {
  if (app) {
      app.showNotification('success', 'Online', 'Conexão com a internet restaurada.');
  }
});

window.addEventListener('offline', () => {
  if (app) {
      app.showNotification('info', 'Offline', 'Aplicativo funcionando no modo offline.');
  }
});