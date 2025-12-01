# 🚀 Guia de Deploy - GymMind Frontend na Vercel

## ✅ Status da Aplicação
- **Backend URL:** https://gm-back-production.up.railway.app/api
- **Frontend:** Pronto para deploy na Vercel
- **Integração:** Completa e funcional

---

## 📦 Pré-requisitos Concluídos

✅ Todas as dependências instaladas
✅ Arquivo `.gitignore` criado
✅ Arquivo `vercel.json` configurado
✅ API integrada com backend
✅ Todas as páginas HTML conectadas ao `api-service.js`

---

## 🎯 Deploy na Vercel (Passo a Passo)

### Opção 1: Deploy via CLI (Recomendado)

```bash
# 1. Instalar Vercel CLI (se ainda não tiver)
npm install -g vercel

# 2. Fazer login na Vercel
vercel login

# 3. Deploy em produção
vercel --prod
```

### Opção 2: Deploy via GitHub (Automático)

1. **Commit e Push do código:**
```bash
git add .
git commit -m "Preparar projeto para deploy na Vercel"
git push origin claude/check-deployment-readiness-01NUJt99U7gz4KMpexuooL5a
```

2. **Conectar ao Vercel:**
   - Acesse https://vercel.com
   - Clique em "New Project"
   - Importe o repositório `edu1brito/GM-front`
   - Selecione o branch `claude/check-deployment-readiness-01NUJt99U7gz4KMpexuooL5a` (ou main)
   - Clique em "Deploy"

3. **Configurações no Vercel:**
   - Framework Preset: **Other**
   - Build Command: deixe vazio
   - Output Directory: `.` (ponto)
   - Install Command: `npm install`

---

## 🔧 Configurações Importantes

### Backend CORS
Depois que o frontend estiver no ar, você precisa adicionar a URL do Vercel no backend:

No **gm-back**, adicione a variável de ambiente:
```
FRONTEND_URL=https://seu-projeto.vercel.app
```

Ou atualize o array de CORS permitidos para incluir o domínio da Vercel.

### Verificação Pós-Deploy

Após o deploy, teste:

1. **Backend está acessível:**
```bash
curl https://gm-back-production.up.railway.app/api/health
```

2. **Frontend carregou corretamente:**
   - Abra a URL do Vercel
   - Abra o Console do navegador (F12)
   - Deve aparecer: `🚀 GymMind API Service inicializado`

3. **Fluxo completo funcional:**
   - Registre um novo usuário
   - Faça login
   - Gere uma dieta
   - Baixe o PDF

---

## 📋 Estrutura de Arquivos

```
GM-front/
├── .gitignore              ✅ Criado
├── vercel.json             ✅ Criado
├── package.json            ✅ Configurado
├── api-service.js          ✅ Integrado
├── frontend-integration.js ✅ Integrado
├── index.html              ✅ Pronto
├── login.html              ✅ Pronto
├── cadastro.html           ✅ Pronto
├── dietas.html             ✅ Pronto
├── planos.html             ✅ Pronto
├── perfil.html             ✅ Pronto
├── sobre.html              ✅ Pronto
├── style.css               ✅ Pronto
└── assets/                 ✅ Pronto
```

---

## 🌐 URLs Importantes

- **Backend:** https://gm-back-production.up.railway.app
- **Health Check:** https://gm-back-production.up.railway.app/api/health
- **Frontend (após deploy):** https://seu-projeto.vercel.app

---

## 🐛 Troubleshooting

### Erro: "Failed to fetch"
✅ **Solução:** Verifique se o backend está online e se o CORS está configurado

### Erro: "Token inválido"
✅ **Solução:** Limpe o localStorage e faça login novamente
```javascript
localStorage.clear()
```

### Erro: "PDF não abre"
✅ **Solução:** Verifique se a IA do backend está configurada (variáveis ANTHROPIC_API_KEY ou OPENAI_API_KEY)

### Deploy falhou na Vercel
✅ **Solução:** Verifique se:
- `package.json` está correto
- `vercel.json` está configurado
- Não há erros de sintaxe nos arquivos HTML/JS

---

## 🎉 Próximos Passos Após Deploy

1. ✅ Testar fluxo completo de cadastro/login
2. ✅ Testar geração de dietas
3. ✅ Configurar domínio customizado (opcional)
4. ✅ Configurar variáveis de ambiente no Vercel (se necessário)
5. ✅ Configurar analytics (opcional)

---

## 📞 Suporte

Em caso de problemas:
1. Verifique o console do navegador (F12)
2. Verifique os logs do Vercel
3. Verifique os logs do Railway (backend)

---

**Data:** 01/12/2025
**Status:** ✅ **PRONTO PARA DEPLOY**

🚀 **Bora colocar no ar!**
