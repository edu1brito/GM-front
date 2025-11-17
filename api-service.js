// ========================================
// GYMMIND API SERVICE - INTEGRAÇÃO COMPLETA
// ========================================

// URL do backend em produção
// NOTA: Se tiver erro de CORS, adicione o proxy temporário:
// const API_BASE_URL = 'https://cors-anywhere.herokuapp.com/https://gm-back-production.up.railway.app/api';
const API_BASE_URL = 'https://gm-back-production.up.railway.app/api';

/**
 * Serviço centralizado de API do GymMind
 * Gerencia todas as requisições ao backend
 */
class GymMindAPIService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
    this.loadToken();
  }

  /**
   * Carregar token do localStorage
   */
  loadToken() {
    this.token = localStorage.getItem('gymMindToken');
  }

  /**
   * Salvar token no localStorage
   */
  saveToken(token) {
    this.token = token;
    localStorage.setItem('gymMindToken', token);
  }

  /**
   * Remover token do localStorage
   */
  clearToken() {
    this.token = null;
    localStorage.removeItem('gymMindToken');
    localStorage.removeItem('gymMindUser');
  }

  /**
   * Fazer requisição HTTP genérica
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    // Headers padrão
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Adicionar token se disponível
    if (this.token && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers
    };

    try {
      console.log(`🌐 [API] ${config.method || 'GET'} ${url}`);

      const response = await fetch(url, config);
      const data = await response.json();

      console.log(`${response.ok ? '✅' : '❌'} [API] Response:`, data);

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('❌ [API] Erro:', error);
      throw error;
    }
  }

  // ========================================
  // AUTENTICAÇÃO
  // ========================================

  /**
   * Registrar novo usuário
   */
  async register(name, email, password) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });

    if (response.success && response.data?.token) {
      this.saveToken(response.data.token);
      localStorage.setItem('gymMindUser', JSON.stringify(response.data.user));
    }

    return response;
  }

  /**
   * Fazer login
   */
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (response.success && response.data?.token) {
      this.saveToken(response.data.token);
      localStorage.setItem('gymMindUser', JSON.stringify(response.data.user));
    }

    return response;
  }

  /**
   * Obter perfil do usuário
   */
  async getProfile() {
    return await this.request('/auth/profile', {
      method: 'GET'
    });
  }

  /**
   * Verificar se token é válido
   */
  async verifyToken() {
    try {
      return await this.request('/auth/verify-token', {
        method: 'POST'
      });
    } catch (error) {
      this.clearToken();
      return { success: false };
    }
  }

  /**
   * Logout
   */
  logout() {
    this.clearToken();
    window.location.href = 'login.html';
  }

  // ========================================
  // DIETAS
  // ========================================

  /**
   * Gerar dieta personalizada
   */
  async generateDiet(userData) {
    // Adicionar userId do usuário logado se disponível
    const user = this.getCurrentUser();
    if (user?.id) {
      userData.userId = user.id;
    }

    return await this.request('/generate-diet', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  /**
   * Buscar dietas do usuário
   */
  async getMyDiets() {
    return await this.request('/my-diets', {
      method: 'GET'
    });
  }

  // ========================================
  // PAGAMENTOS
  // ========================================

  /**
   * Processar pagamento
   */
  async processPayment(planType, userData) {
    return await this.request('/process-payment', {
      method: 'POST',
      body: JSON.stringify({ planType, userData })
    });
  }

  /**
   * Obter status da assinatura
   */
  async getSubscriptionStatus() {
    return await this.request('/payment/subscription-status', {
      method: 'GET'
    });
  }

  /**
   * Criar checkout
   */
  async createCheckout(planId) {
    return await this.request('/payment/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ planId })
    });
  }

  /**
   * Simular pagamento (desenvolvimento)
   */
  async simulatePayment(planId, action = 'success') {
    return await this.request('/payment/simulate-payment', {
      method: 'POST',
      body: JSON.stringify({ planId, action })
    });
  }

  // ========================================
  // PLANOS
  // ========================================

  /**
   * Listar planos disponíveis
   */
  async getPlans() {
    return await this.request('/plans/health', {
      method: 'GET',
      skipAuth: true
    });
  }

  // ========================================
  // HEALTH CHECK
  // ========================================

  /**
   * Verificar saúde do backend
   */
  async healthCheck() {
    return await this.request('/health', {
      method: 'GET',
      skipAuth: true
    });
  }

  /**
   * Testar IA
   */
  async testAI() {
    return await this.request('/test-ai', {
      method: 'POST',
      skipAuth: true
    });
  }

  // ========================================
  // UTILITÁRIOS
  // ========================================

  /**
   * Obter usuário atual do localStorage
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('gymMindUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      return null;
    }
  }

  /**
   * Verificar se usuário está autenticado
   */
  isAuthenticated() {
    return !!this.token;
  }

  /**
   * Download de PDF
   */
  downloadPDF(url) {
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL.replace('/api', '')}${url}`;
    window.open(fullUrl, '_blank');
  }
}

// Instância global da API
const apiService = new GymMindAPIService();

// Exportar para uso global
window.GymMindAPIService = GymMindAPIService;
window.apiService = apiService;

// ========================================
// FUNÇÕES DE UTILIDADE
// ========================================

/**
 * Verificar se backend está online
 */
async function checkBackendHealth() {
  try {
    const health = await apiService.healthCheck();
    console.log('✅ Backend está online:', health);
    return true;
  } catch (error) {
    console.error('❌ Backend offline:', error);
    return false;
  }
}

/**
 * Proteger página (requer autenticação)
 */
async function protectPage() {
  if (!apiService.isAuthenticated()) {
    console.warn('⚠️ Usuário não autenticado, redirecionando para login');
    window.location.href = 'login.html';
    return false;
  }

  // Verificar se token é válido
  const isValid = await apiService.verifyToken();
  if (!isValid.success) {
    console.warn('⚠️ Token inválido, redirecionando para login');
    apiService.clearToken();
    window.location.href = 'login.html';
    return false;
  }

  return true;
}

/**
 * Redirecionar se já estiver logado
 */
function redirectIfAuthenticated(targetPage = 'dietas.html') {
  if (apiService.isAuthenticated()) {
    window.location.href = targetPage;
  }
}

/**
 * Formatar data
 */
function formatDate(dateString) {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formatar data/hora
 */
function formatDateTime(dateString) {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Mostrar notificação
 */
function showNotification(message, type = 'info', duration = 5000) {
  // Remover notificação existente
  const existing = document.getElementById('notification');
  if (existing) existing.remove();

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  const notification = document.createElement('div');
  notification.id = 'notification';
  notification.className = `fixed top-24 right-4 z-50 ${colors[type]} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3`;
  notification.style.animation = 'slideInRight 0.3s ease-out';

  notification.innerHTML = `
    <span class="text-xl">${icons[type]}</span>
    <span class="font-bold">${message}</span>
    <button onclick="this.parentElement.remove()" class="ml-2 hover:opacity-75">✕</button>
  `;

  document.body.appendChild(notification);

  if (duration > 0) {
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }
}

/**
 * Mostrar loading
 */
function showLoading(message = 'Carregando...') {
  const existing = document.getElementById('globalLoading');
  if (existing) return;

  const loading = document.createElement('div');
  loading.id = 'globalLoading';
  loading.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  loading.innerHTML = `
    <div class="bg-white rounded-2xl p-8 text-center">
      <div class="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-lg font-bold text-gray-800">${message}</p>
    </div>
  `;

  document.body.appendChild(loading);
}

/**
 * Esconder loading
 */
function hideLoading() {
  const loading = document.getElementById('globalLoading');
  if (loading) loading.remove();
}

/**
 * Validar email
 */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Exportar funções utilitárias
window.checkBackendHealth = checkBackendHealth;
window.protectPage = protectPage;
window.redirectIfAuthenticated = redirectIfAuthenticated;
window.formatDate = formatDate;
window.formatDateTime = formatDateTime;
window.showNotification = showNotification;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.validateEmail = validateEmail;

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
`;
document.head.appendChild(style);

console.log('🚀 GymMind API Service inicializado');
console.log('🔗 Backend URL:', API_BASE_URL);
