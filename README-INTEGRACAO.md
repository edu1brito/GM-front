# 🚀 GymMind Frontend - Integração Completa

## ✅ Status da Integração
**Data:** 17/11/2025
**Status:** ✅ Integrado e pronto para deploy
**Backend URL:** `https://gm-back-production.up.railway.app`

---

## 📝 Alterações Realizadas

### 1. **Criação do Serviço de API Unificado** (`api-service.js`)
- ✅ URL do backend em produção configurada
- ✅ Sistema de autenticação com gerenciamento de tokens
- ✅ Todas as funcionalidades do backend integradas:
  - Registro e login de usuários
  - Geração de dietas
  - Busca de dietas do usuário
  - Processamento de pagamentos
  - Status de assinatura
  - Health check

### 2. **Atualização das Páginas de Autenticação**
- ✅ **login.html** - Integrado com `/api/auth/login`
- ✅ **cadastro.html** - Integrado com `/api/auth/register`
- ✅ Validações completas
- ✅ Tratamento de erros
- ✅ Loading states
- ✅ Redirecionamentos automáticos

### 3. **Integração da Geração de Dietas**
- ✅ **index.html** - Formulário de criação de dietas
- ✅ **frontend-integration.js** - Compatibilidade mantida
- ✅ Integração com endpoint `/api/generate-diet`
- ✅ Download de PDFs do backend

### 4. **Página de Dietas**
- ✅ **dietas.html** - Lista dietas do backend + localStorage
- ✅ Busca automática de dietas do usuário autenticado
- ✅ Download de PDFs gerados

---

## 🔧 Arquivos Modificados

1. **api-service.js** (NOVO)
   - Serviço centralizado de API
   - Gerenciamento de tokens
   - Funções utilitárias

2. **login.html**
   - Integrado com API de autenticação
   - Validações aprimoradas

3. **cadastro.html**
   - Integrado com API de registro
   - Campo `name` corrigido

4. **index.html**
   - Importa api-service.js
   - Pronto para gerar dietas

5. **dietas.html**
   - Lista dietas do backend
   - Integração com `/api/my-diets`

6. **frontend-integration.js**
   - Refatorado para usar apiService
   - Mantém compatibilidade

---

## 🌐 Endpoints Integrados

### Autenticação
- ✅ `POST /api/auth/register` - Criar conta
- ✅ `POST /api/auth/login` - Fazer login
- ✅ `GET /api/auth/profile` - Obter perfil
- ✅ `POST /api/auth/verify-token` - Verificar token

### Dietas
- ✅ `POST /api/generate-diet` - Gerar dieta personalizada
- ✅ `GET /api/my-diets` - Buscar dietas do usuário

### Pagamentos
- ✅ `POST /api/process-payment` - Processar pagamento
- ✅ `GET /api/payment/subscription-status` - Status da assinatura
- ✅ `POST /api/payment/create-checkout` - Criar checkout
- ✅ `POST /api/payment/simulate-payment` - Simular pagamento (dev)

### Sistema
- ✅ `GET /api/health` - Health check
- ✅ `POST /api/test-ai` - Testar IA

---

## 🔐 Sistema de Autenticação

### Fluxo de Autenticação
1. Usuário faz login ou cadastro
2. Backend retorna token JWT
3. Token é salvo em `localStorage`
4. Todas as requisições autenticadas incluem o token no header `Authorization: Bearer {token}`
5. Token é verificado automaticamente em páginas protegidas

### Proteção de Páginas
```javascript
// Exemplo de uso
document.addEventListener('DOMContentLoaded', async function() {
    await protectPage(); // Requer autenticação
});
```

### Verificação de Autenticação
```javascript
if (apiService.isAuthenticated()) {
    // Usuário está logado
}
```

---

## 📦 Estrutura de Dados

### UserData para Geração de Dieta
```javascript
{
  userId: "uid-opcional",
  personal: {
    nome: "João Silva",
    peso: "70",
    altura: "175",
    idade: "25",
    objetivo: "emagrecer",  // emagrecer | emagrecer-massa | ganhar-massa | definicao-massa
    calorias: "2000"
  },
  gender: "masculino",  // masculino | feminino
  meals: {
    cafe: ["🥣 Tapioca", "🍎 Fruta"],
    "lanche-manha": ["🥛 Whey", "🍌 Banana"],
    almoco: ["🍗 Frango", "🍚 Arroz"],
    "lanche-tarde": ["🥤 Whey"],
    jantar: ["🐟 Salmão", "🥗 Salada"]
  }
}
```

---

## 🚀 Deploy

### Opção 1: Deploy Estático (Vercel/Netlify/GitHub Pages)

#### Vercel
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir .
```

#### GitHub Pages
1. Commit e push para o repositório
2. Vá em Settings → Pages
3. Selecione o branch (main)
4. Clique em Save

### Opção 2: Servidor Simples

#### Usando Python
```bash
# Python 3
python -m http.server 8080

# Acesse: http://localhost:8080
```

#### Usando Node.js
```bash
# Instalar http-server
npm install -g http-server

# Executar
http-server -p 8080

# Acesse: http://localhost:8080
```

### Opção 3: Railway (Recomendado)

1. Criar arquivo `package.json`:
```json
{
  "name": "gymmind-frontend",
  "version": "1.0.0",
  "scripts": {
    "start": "npx http-server -p $PORT"
  },
  "dependencies": {
    "http-server": "^14.1.1"
  }
}
```

2. Deploy no Railway:
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

---

## 🔧 Configurações Importantes

### CORS
O backend está configurado para aceitar requisições de:
- `http://localhost:3000`
- `http://localhost:5500`
- `http://localhost:5501`
- `http://127.0.0.1:5500`
- `http://127.0.0.1:5501`

**Para produção:** Adicione a URL do frontend no backend em `FRONTEND_URL`

### Variáveis de Ambiente
Não há variáveis de ambiente no frontend. A URL do backend está hardcoded em `api-service.js`.

Para mudar a URL do backend em produção, edite:
```javascript
// api-service.js, linha 6
const API_BASE_URL = 'https://gm-back-production.up.railway.app/api';
```

---

## 🧪 Testes

### Testar Localmente
1. Abra `index.html` em um servidor local
2. Verifique o console do navegador
3. Deve aparecer: `🚀 GymMind API Service inicializado`

### Testar Conexão com Backend
```javascript
// Abra o console do navegador (F12) e execute:
await checkBackendHealth();
// Deve retornar: true
```

### Testar Autenticação
1. Vá para `cadastro.html`
2. Crie uma conta de teste
3. Verifique se é redirecionado para `dietas.html`
4. Verifique no console se o token foi salvo

---

## 📱 Funcionalidades

### ✅ Implementadas
- [x] Registro de usuários
- [x] Login de usuários
- [x] Geração de dietas personalizadas
- [x] Download de PDFs
- [x] Lista de dietas do usuário
- [x] Proteção de páginas autenticadas
- [x] Tratamento de erros
- [x] Loading states
- [x] Notificações visuais
- [x] Integração completa com backend

### 🚧 Pendentes (Opcionais)
- [ ] Resetar senha
- [ ] Editar perfil
- [ ] Upload de foto de perfil
- [ ] Notificações push
- [ ] Integração com pagamento real (Stripe)
- [ ] Dashboard de progresso

---

## 🐛 Troubleshooting

### Erro: "Failed to fetch"
- Verifique se o backend está online: `https://gm-back-production.up.railway.app/api/health`
- Verifique se há problemas de CORS
- Verifique a conexão com a internet

### Erro: "Token inválido"
- Limpe o localStorage: `localStorage.clear()`
- Faça login novamente

### PDF não abre
- Verifique se o PDF foi gerado corretamente no backend
- Verifique a URL do PDF no console
- Tente acessar a URL diretamente no navegador

### Dietas não aparecem
- Verifique se está logado
- Verifique o console para erros
- Tente gerar uma nova dieta

---

## 📞 Contato

Para dúvidas ou problemas:
1. Verifique o console do navegador (F12)
2. Verifique os logs do backend
3. Teste o endpoint `/api/health`

---

## ✅ Checklist de Deploy

- [x] Backend rodando e acessível
- [x] Frontend integrado com todas as APIs
- [x] Autenticação funcionando
- [x] Geração de dietas funcionando
- [x] PDFs sendo gerados e baixados
- [ ] CORS configurado para URL de produção
- [ ] Testes end-to-end realizados
- [ ] Deploy do frontend realizado
- [ ] URL de produção configurada

---

**Última atualização:** 17/11/2025
**Versão:** 1.0.0
**Status:** ✅ Pronto para deploy
