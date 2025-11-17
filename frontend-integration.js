// ====================================
// GYMMIND - INTEGRAÇÃO FRONTEND-BACKEND
// ====================================

// Configuração da API (CORRIGIDO PARA PORTA 8000)
const API_BASE_URL = 'http://localhost:3003/api';

// Utilitários para API
class GymMindAPI {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      console.log(`🌐 Fazendo requisição: ${config.method || 'GET'} ${url}`);
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
      }

      console.log('✅ Resposta recebida:', data);
      return data;
    } catch (error) {
      console.error('❌ Erro na requisição:', error);
      throw error;
    }
  }

  static async generateDiet(userData) {
    return await this.request('/generate-diet', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  static async processPayment(userData, planType) {
    return await this.request('/process-payment', {
      method: 'POST', 
      body: JSON.stringify({ userData, planType })
    });
  }

  static async testAI() {
    return await this.request('/test-ai', {
      method: 'POST'
    });
  }

  static async healthCheck() {
    return await this.request('/health');
  }
}

// ====================================
// INTEGRAÇÃO PLANOS.HTML
// ====================================

// Substituir função selectPlan no planos.html
function selectPlan(planType) {
  localStorage.setItem('selectedPlan', planType);
  
  const userData = JSON.parse(localStorage.getItem('gymMindUserData') || '{}');
  
  const plans = {
    'emagrecimento': {
      name: 'Dieta Emagrecimento',
      price: 9.99,
      features: ['Dieta Personalizada', 'Calorias ajustadas', 'Horários das refeições', 'Ebook personalizado']
    },
    'dieta-treino': {
      name: 'Dieta + Treino',
      price: 14.99,
      features: ['Dieta Personalizada', 'Treinos personalizados', 'Para casa ou academia', 'Ebook completo']
    },
    'nutricionista': {
      name: 'Acompanhamento com Nutricionista',
      price: 19.99,
      features: ['Dieta modificada pela nutri', 'Consulta via WhatsApp', 'Ajustes na dieta', 'Acompanhamento completo']
    },
    'emagrecer-massa': {
      name: 'Dieta Emagrecer + Massa',
      price: 10.99,
      features: ['Dieta Personalizada', 'Para emagrecer e definir', 'Calorias ajustadas']
    },
    'ganho-massa': {
      name: 'Dieta Ganho de Massa',
      price: 15.99,
      features: ['Dieta para ganho de massa', 'Alto valor calórico', 'Proteínas adequadas']
    },
    'definicao-massa': {
      name: 'Dieta Definição + Massa',
      price: 16.99,
      features: ['Dieta para definição', 'Manutenção de massa', 'Cutting controlado']
    }
  };

  const selectedPlan = plans[planType];
  
  if (selectedPlan) {
    showPaymentModalIntegrated(selectedPlan, userData, planType);
  }
}

function showPaymentModalIntegrated(plan, userData, planType) {
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
  
  modalOverlay.innerHTML = `
    <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
      <button onclick="closeModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
      
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-green-600 text-2xl">🎯</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Confirmar Plano</h3>
        <p class="text-gray-600">Você está prestes a adquirir:</p>
      </div>

      <div class="bg-gray-50 rounded-xl p-6 mb-6">
        <h4 class="font-bold text-lg text-gray-800 mb-2">${plan.name}</h4>
        <div class="text-3xl font-bold text-green-600 mb-4">R$ ${plan.price.toFixed(2)}</div>
        <ul class="space-y-2">
          ${plan.features.map(feature => `
            <li class="flex items-center text-sm text-gray-700">
              <span class="text-green-500 mr-2">✓</span>
              ${feature}
            </li>
          `).join('')}
        </ul>
      </div>

      <div class="space-y-3">
        <button onclick="proceedToPaymentIntegrated('${planType}')" class="w-full bg-green-500 text-white py-4 rounded-xl font-semibold hover:bg-green-600 transition">
          💳 Prosseguir para Pagamento
        </button>
        <button onclick="closeModal()" class="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition">
          Cancelar
        </button>
      </div>

      <div class="text-center mt-6">
        <div class="inline-flex items-center text-sm text-gray-600">
          <span class="text-green-500 mr-1">🔒</span>
          Pagamento 100% seguro
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);
  modalOverlay.onclick = (e) => {
    if (e.target === modalOverlay) closeModal();
  };
}

async function proceedToPaymentIntegrated(planType) {
  const userData = JSON.parse(localStorage.getItem('gymMindUserData') || '{}');
  
  if (!userData.personal || !userData.meals || !userData.gender) {
    alert('Dados insuficientes! Volte e preencha todas as informações na página inicial.');
    return;
  }

  closeModal();
  
  // Mostrar loading
  const loadingOverlay = document.createElement('div');
  loadingOverlay.className = 'fixed inset-0 bg-green-500 bg-opacity-95 flex items-center justify-center z-50';
  loadingOverlay.innerHTML = `
    <div class="text-center text-white max-w-md mx-auto p-8">
      <div class="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
      <h3 class="text-2xl font-bold mb-4">Processando...</h3>
      <p class="text-lg opacity-90 mb-4">Gerando sua dieta personalizada com IA</p>
      <div class="text-sm opacity-75">
        <p>✅ Analisando seus dados pessoais</p>
        <p>✅ Processando alimentos preferidos</p> 
        <p>✅ Calculando calorias e macros</p>
        <p>🤖 Gerando com inteligência artificial...</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(loadingOverlay);
  
  try {
    console.log('🚀 Iniciando processamento do pagamento e geração de dieta...');
    
    // Chamar API real do backend
    const response = await GymMindAPI.processPayment(userData, planType);
    
    if (response.success && response.paymentApproved) {
      // Salvar dieta gerada no localStorage
      const dietData = {
        id: 'diet-' + Date.now(),
        name: response.planType === 'dieta-treino' ? 'Dieta + Treino' : 'Dieta Personalizada',
        type: response.planType.includes('treino') ? 'diet-training' : 'diet-only',
        status: 'active',
        createdDate: new Date().toISOString().split('T')[0],
        calories: response.data.dietPlan.objetivos?.calorias_diarias || 2000,
        duration: 30,
        objective: userData.personal.objetivo || 'Personalizado',
        progress: 0,
        planType: response.planType,
        aiGenerated: true,
        dietPlan: response.data.dietPlan,
        pdfUrl: response.data.pdf?.downloadUrl,
        generatedAt: response.data.generatedAt
      };

      // Salvar na lista de dietas do usuário
      const existingDiets = JSON.parse(localStorage.getItem('userDiets') || '[]');
      existingDiets.unshift(dietData); // Adicionar no início
      localStorage.setItem('userDiets', JSON.stringify(existingDiets));
      
      // Marcar acesso como autorizado
      localStorage.setItem('gymMindAccess', 'granted');
      localStorage.setItem('paymentSuccess', 'true');
      
      loadingOverlay.remove();
      showSuccessMessageIntegrated(response.data);
    } else {
      throw new Error('Falha no processamento do pagamento');
    }
    
  } catch (error) {
    console.error('❌ Erro no processamento:', error);
    loadingOverlay.remove();
    
    // Mostrar erro
    const errorOverlay = document.createElement('div');
    errorOverlay.className = 'fixed inset-0 bg-red-500 bg-opacity-95 flex items-center justify-center z-50';
    errorOverlay.innerHTML = `
      <div class="text-center text-white max-w-md mx-auto p-8">
        <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span class="text-2xl">❌</span>
        </div>
        <h3 class="text-2xl font-bold mb-4">Erro no Processamento</h3>
        <p class="text-lg opacity-90 mb-6">${error.message || 'Tente novamente em alguns minutos'}</p>
        <button onclick="this.parentElement.parentElement.remove()" class="bg-white text-red-600 px-6 py-3 rounded-xl font-semibold">
          Fechar
        </button>
      </div>
    `;
    document.body.appendChild(errorOverlay);
  }
}

function showSuccessMessageIntegrated(data) {
  const successOverlay = document.createElement('div');
  successOverlay.className = 'fixed inset-0 bg-white flex items-center justify-center z-50 p-4';
  successOverlay.innerHTML = `
    <div class="text-center max-w-md mx-auto">
      <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h2 class="text-3xl font-bold text-gray-800 mb-4">Dieta Gerada com Sucesso!</h2>
      <p class="text-lg text-gray-600 mb-8">Sua dieta personalizada foi criada com inteligência artificial e está pronta para usar!</p>
      
      <div class="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
        <p class="text-sm text-green-800">
          <strong>✅ Dieta personalizada criada</strong><br>
          ✅ PDF profissional gerado<br>
          ✅ Baseado nos seus alimentos preferidos<br>
          ✅ Cálculos personalizados de calorias
        </p>
      </div>
      
      <div class="space-y-4">
        <button onclick="goToUserDashboardIntegrated()" class="w-full bg-green-500 text-white py-4 rounded-xl font-semibold hover:bg-green-600 transition">
          🍽️ Ver Minha Dieta Agora
        </button>
        ${data.pdf ? `
          <button onclick="downloadDietPDF('${data.pdf.downloadUrl}')" class="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition">
            📄 Baixar PDF da Dieta
          </button>
        ` : ''}
        <button onclick="goToHome()" class="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition">
          🏠 Voltar ao Início
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(successOverlay);
}

function goToUserDashboardIntegrated() {
  window.location.href = 'dietas.html';
}

function downloadDietPDF(url) {
  if (url) {
    // Garantir que a URL seja absoluta
    const fullUrl = url.startsWith('http') ? url : `http://localhost:8000${url}`;
    window.open(fullUrl, '_blank');
  }
}

function goToHome() {
  window.location.href = 'index.html';
}

// ====================================
// INTEGRAÇÃO DIETAS.HTML
// ====================================

// Substituir função loadUserDiets no dietas.html
function loadUserDietsIntegrated() {
  const savedDiets = localStorage.getItem('userDiets');
  
  if (savedDiets) {
    userDiets = JSON.parse(savedDiets);
  } else {
    // Se não há dietas salvas, criar algumas de exemplo
    userDiets = [];
    localStorage.setItem('userDiets', JSON.stringify(userDiets));
  }
  
  // Verificar se há dados de dieta gerada pela IA
  const latestDiet = userDiets.find(diet => diet.aiGenerated);
  if (latestDiet && latestDiet.dietPlan) {
    console.log('🤖 Dieta gerada por IA encontrada:', latestDiet);
  }
}

// Substituir função viewDiet para mostrar dados reais da IA
function viewDietIntegrated(dietId) {
  const diet = userDiets.find(d => d.id === dietId);
  if (!diet) return;
  
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
  
  let dietContent = '';
  
  if (diet.aiGenerated && diet.dietPlan) {
    // Mostrar dados reais da IA
    const plan = diet.dietPlan;
    dietContent = `
      <div class="bg-green-50 p-4 rounded-xl mb-4">
        <h3 class="font-semibold mb-3 text-green-800">🤖 Gerado com Inteligência Artificial</h3>
        <p class="text-sm text-green-700">${plan.resumo || 'Plano personalizado criado especialmente para você.'}</p>
      </div>
      
      ${plan.plano_alimentar ? `
        <div class="bg-gray-50 p-4 rounded-xl mb-4">
          <h3 class="font-semibold mb-3">🍽️ Suas Refeições</h3>
          <div class="space-y-3">
            ${plan.plano_alimentar.refeicoes?.map(refeicao => `
              <div class="bg-white p-3 rounded-lg border border-gray-200">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-medium text-gray-800">${refeicao.nome} - ${refeicao.horario}</span>
                  <span class="text-sm text-gray-600">${refeicao.calorias} kcal</span>
                </div>
                ${refeicao.alimentos_com_quantidades ? `
                  <div class="text-sm text-gray-700">
                    ${refeicao.alimentos_com_quantidades.slice(0, 3).map(alimento => 
                      `<span class="inline-block bg-gray-100 px-2 py-1 rounded mr-1 mb-1">${alimento}</span>`
                    ).join('')}
                  </div>
                ` : ''}
              </div>
            `).join('') || ''}
          </div>
        </div>
      ` : ''}
      
      ${plan.dicas_gerais ? `
        <div class="bg-yellow-50 p-4 rounded-xl">
          <h3 class="font-semibold mb-3 text-yellow-800">💡 Dicas Personalizadas</h3>
          <ul class="text-sm text-yellow-700 space-y-1">
            ${plan.dicas_gerais.slice(0, 3).map(dica => `<li>• ${dica}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    `;
  } else {
    // Mostrar dados básicos para dietas não geradas por IA
    dietContent = `
      <div class="bg-gray-50 p-4 rounded-xl mb-6">
        <h3 class="font-semibold mb-3">Informações Gerais</h3>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-600">Tipo:</span>
            <span class="font-semibold ml-2">${diet.planType}</span>
          </div>
          <div>
            <span class="text-gray-600">Status:</span>
            <span class="font-semibold ml-2">${diet.status === 'active' ? 'Ativa' : 'Concluída'}</span>
          </div>
          <div>
            <span class="text-gray-600">Calorias:</span>
            <span class="font-semibold ml-2">${diet.calories} kcal/dia</span>
          </div>
          <div>
            <span class="text-gray-600">Progresso:</span>
            <span class="font-semibold ml-2">${diet.progress}%</span>
          </div>
        </div>
      </div>
    `;
  }
  
  modal.innerHTML = `
    <div class="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">${diet.name}</h2>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
      </div>
      
      <div class="space-y-6">
        ${dietContent}
        
        <div class="flex gap-3">
          ${diet.pdfUrl ? `
            <button onclick="downloadDietPDF('${diet.pdfUrl}')" class="btn-primary text-white px-6 py-3 rounded-xl font-semibold flex-1">
              📥 Baixar PDF Completo
            </button>
          ` : `
            <button onclick="downloadDiet(${diet.id})" class="btn-primary text-white px-6 py-3 rounded-xl font-semibold flex-1">
              📥 Baixar Dieta
            </button>
          `}
          <button onclick="duplicateDiet(${diet.id})" class="btn-secondary text-white px-6 py-3 rounded-xl font-semibold">
            📋 Duplicar
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
}

// ====================================
// UTILITÁRIOS GERAIS
// ====================================

// Testar conectividade com backend
async function testBackendConnection() {
  try {
    const health = await GymMindAPI.healthCheck();
    console.log('✅ Backend conectado:', health);
    
    // Testar IA se as chaves estiverem configuradas
    if (health.services?.ai === 'Configurado' || health.services?.anthropic === 'Configurado') {
      try {
        const aiTest = await GymMindAPI.testAI();
        console.log('🤖 IA funcionando:', aiTest);
      } catch (aiError) {
        console.warn('⚠️ IA não configurada:', aiError.message);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Backend não conectado:', error);
    return false;
  }
}

// Fechar modal (utilitário global)
function closeModal() {
  const modals = document.querySelectorAll('.fixed.inset-0');
  modals.forEach(modal => modal.remove());
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Iniciando GymMind Frontend Integration...');
  
  // Testar conexão com backend
  const backendConnected = await testBackendConnection();
  
  if (!backendConnected) {
    console.warn('⚠️ Rodando em modo offline - algumas funcionalidades podem não funcionar');
  }
  
  // Substituir funções se estiver na página correta
  if (window.location.pathname.includes('dietas.html')) {
    // Substituir loadUserDiets
    if (typeof loadUserDiets === 'function') {
      loadUserDiets = loadUserDietsIntegrated;
    }
    
    // Substituir viewDiet
    if (typeof viewDiet === 'function') {
      viewDiet = viewDietIntegrated;  
    }
  }
});

// Exportar para uso global
window.GymMindAPI = GymMindAPI;
window.testBackendConnection = testBackendConnection;
window.closeModal = closeModal;
window.downloadDietPDF = downloadDietPDF;