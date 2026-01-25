# 🌤️ Sky Scope

> Aplicação web de clima feita em **React**, focada em velocidade, clareza e boa UX.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)

---

## 📋 Sobre o Projeto

**Sky Scope** permite buscar cidades e exibir **clima atual** e **previsão de 5 dias**, com tratamento robusto de erros e base pronta para evoluir com cache, geolocalização e visualizações interativas.

### ✨ Características Principais

- 🔍 **Busca inteligente** por nome da cidade
- 🌡️ **Clima atual** com informações detalhadas
- 📅 **Previsão de 5 dias** com temperaturas e condições
- 📱 **Design responsivo** (mobile-first)
- ⚡ **Performance otimizada** com estados de loading
- 🛡️ **Tratamento robusto** de erros e casos extremos
- ♿ **Acessibilidade** com navegação por teclado e bom contraste

---

## 🚀 Stack Tecnológica

- **Frontend:** React 18+ com TypeScript
- **Estilização:** CSS Modules (ou Tailwind CSS)
- **API de Clima:** OpenWeatherMap API
- **Gerenciador de Pacotes:** pnpm
- **Linting:** ESLint 9.x (flat config)
- **Formatação:** Prettier
- **Deploy:** Vercel / Netlify / GitHub Pages

---

## 📦 Instalação e Uso

### Pré-requisitos

- Node.js 18+
- pnpm 10+ (ou npm/yarn)
- Chave de API do [OpenWeatherMap](https://openweathermap.org/api)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/herissonneves/sky-scope.git

# Entre no diretório
cd sky-scope

# Instale as dependências
pnpm install
```

### Configuração da API

1. Crie uma conta gratuita no [OpenWeatherMap](https://openweathermap.org/api)
2. Gere sua chave de API
3. Crie um arquivo `.env` na raiz do projeto:

```env
VITE_WEATHER_API_KEY=sua_chave_api_aqui
```

### Executar Localmente

```bash
# Modo de desenvolvimento
pnpm dev

# Build de produção
pnpm build

# Preview do build
pnpm preview

# Lint
pnpm lint

# Formatação
pnpm format
```

A aplicação estará disponível em `http://localhost:5173`

---

## 🎯 Funcionalidades

### ✅ Implementadas

#### Busca & Localização

- ✅ Buscar clima por nome da cidade
- ✅ Nova busca sem recarregar a página
- ✅ Exibição clara de cidade/país consultados

#### Clima Atual

- ✅ Condições atuais (descrição, ícone, temperatura)
- ✅ Informações essenciais (sensação térmica, umidade, vento)
- ✅ Estados de carregamento bem definidos

#### Previsão 5 Dias

- ✅ Previsão para os próximos 5 dias
- ✅ Data, temperatura min/máx e condição
- ✅ Layout responsivo

#### Erros & Robustez

- ✅ Tratamento de erros de rede e limites de API
- ✅ Tratamento de cidade não encontrada
- ✅ Mensagens de erro claras
- ✅ Prevenção de estados quebrados

#### UX & Acessibilidade

- ✅ Interface responsiva (mobile-first)
- ✅ Boa hierarquia visual
- ✅ Labels em inputs
- ✅ Navegação por teclado
- ✅ Estados de foco visíveis
- ✅ Contraste legível

### 🚧 Planejadas (Roadmap)

- [ ] **Caching** de respostas com TTL (localStorage/sessionStorage)
- [ ] **Geolocalização** automática (com permissão do usuário)
- [ ] **Gráficos interativos** (linha de temperatura)
- [ ] Toggle de unidades (°C/°F)
- [ ] Histórico de cidades recentes
- [ ] Skeleton loading e microinterações
- [ ] Suporte a múltiplos idiomas (i18n)
- [ ] Tema claro/escuro

---

## 📁 Estrutura do Projeto

```plaintext
sky-scope/
├── src/
│   ├── components/     # Componentes React
│   ├── services/       # Serviços de API
│   ├── hooks/          # Custom hooks
│   ├── types/          # Tipos TypeScript
│   ├── utils/          # Funções utilitárias
│   ├── styles/         # Estilos globais
│   └── index.ts        # Entry point
├── public/             # Assets estáticos
├── dist/               # Build de produção
├── .eslintrc           # Configuração ESLint
├── .prettierrc         # Configuração Prettier
├── tsconfig.json       # Configuração TypeScript
└── package.json        # Dependências e scripts
```

---

## 🧪 Testes

```bash
# Executar testes
pnpm test

# Testes com coverage
pnpm test:coverage

# Testes em modo watch
pnpm test:watch
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👤 Autor

- GitHub: [@herissonneves](https://github.com/herissonneves)
- LinkedIn: [Herisson Neves](https://linkedin.com/in/herissonneves)

---

## 🙏 Agradecimentos

- [OpenWeatherMap](https://openweathermap.org/) pela API de clima
- [React](https://reactjs.org/) pela biblioteca incrível
- Comunidade open source

---

Feito com ☕ e 💪 por Herisson Neves
