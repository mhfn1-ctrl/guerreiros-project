# Studio 24 Fitness — Sistema Completo

## Arquivos

| Arquivo | Descrição |
|---|---|
| `public/index.html` | Catálogo público (clientes) |
| `public/gestao.html` | Sistema de gestão (protegido por senha) |
| `netlify/functions/db.js` | API do banco de dados na nuvem |
| `netlify.toml` | Configuração do Netlify |

## Login da Gestão

- **Usuário:** `nicolas`
- **Senha:** `1107/Nic`

---

## Como publicar no Netlify (passo a passo)

### 1. Instale o Netlify CLI
```bash
npm install -g netlify-cli
```

### 2. Faça login
```bash
netlify login
```

### 3. Dentro da pasta `studio24`, inicialize o projeto
```bash
cd studio24
npm install
netlify init
```
Escolha: **Create & configure a new site**

### 4. Ative o Netlify Blobs (banco de dados)
No painel do Netlify (app.netlify.com):
- Vá em **Storage → Blobs**
- Clique em **Enable Blobs** para o seu site

### 5. Publique
```bash
netlify deploy --prod
```

---

## Como funciona a sincronização

```
Catálogo (cliente faz pedido)
        │
        ▼
  Netlify Function /api/db  ←→  Netlify Blobs (banco de dados na nuvem)
        │
        ▼
Gestão (nicolas vê estoque, vendas, etc.)
```

- O **catálogo** puxa produtos e estoque da nuvem a cada 30 segundos
- Quando um **pedido é feito**, o estoque e vendas são salvos na nuvem imediatamente
- A **gestão** puxa dados da nuvem ao abrir e sincroniza automaticamente a cada 3 segundos após edição
- Funciona em **qualquer aparelho** com internet: celular, tablet, computador

## URLs após publicar

- **Catálogo:** `https://seu-site.netlify.app/`
- **Gestão:** `https://seu-site.netlify.app/gestao.html`

---

## Funcionalidades da Gestão

- 🔐 **Login protegido** (nicolas / 1107/Nic)
- 📦 **Cadastro de produtos** — adicione, edite, ative/desative produtos
- 🗃️ **Gestão de estoque** — por tamanho, com alertas de estoque baixo
- 🛒 **Nova venda** — com desconto, forma de pagamento, cliente
- 📊 **Dashboard** — receita, lucro, ticket médio, fluxo de caixa 6 meses
- 📋 **Histórico** — todas as vendas com filtro por mês
- 👤 **Clientes** — ranking por gasto total
- 💸 **Despesas** — controle por categoria
- ☁️ **Sincronização em nuvem** — status visível no topo da tela

## Funcionalidades do Catálogo

- Reflete exatamente os produtos cadastrados na gestão (ativos)
- Estoque em tempo real (atualiza a cada 30s)
- Pedidos decrementam estoque automaticamente na nuvem
- Carrinho, checkout, confirmação por WhatsApp
