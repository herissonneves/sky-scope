# 🧪 Mocks da API OpenWeatherMap

Este diretório contém dados mockados para testes da aplicação sem precisar fazer chamadas reais à API.

## 📋 Como usar

### Ativar modo de mock

Adicione a seguinte variável no seu arquivo `.env`:

```env
VITE_USE_MOCK_API=true
```

Quando essa variável estiver definida como `true`, a aplicação usará os dados mockados em vez de fazer requisições reais à API.

### Cidades disponíveis nos mocks

Os seguintes nomes de cidades funcionam nos mocks:

- **Brasília** (ou "brasilia")
- **São Paulo** (ou "sao paulo", "são paulo")
- **Rio de Janeiro** (ou "rio de janeiro")

Você pode buscar por qualquer parte do nome (ex: "brasil", "paulo", "rio").

### Dados mockados

#### API de Geolocalização (`geo/1.0/direct`)

Retorna um array com informações de cidades incluindo:

- `name`: Nome da cidade
- `local_names`: Nomes em diferentes idiomas
- `lat`: Latitude
- `lon`: Longitude
- `country`: Código do país (BR)
- `state`: Estado/Distrito

#### API de Clima (`data/3.0/onecall`)

Retorna dados do clima atual incluindo:

- `temp`: Temperatura em Kelvin (~25°C)
- `feels_like`: Sensação térmica em Kelvin (~26°C)
- `humidity`: Umidade relativa (~65%)
- `wind_speed`: Velocidade do vento em m/s (~3.5 m/s = 12.6 km/h)

**Nota:** Os dados de temperatura são gerados com pequenas variações aleatórias para simular diferentes condições climáticas.

### Delay simulado

Os mocks incluem delays simulados para imitar o comportamento real da API:

- Geolocalização: ~300ms
- Dados do clima: ~400ms

## 🔧 Estrutura dos arquivos

- `weatherApiMocks.ts`: Contém os dados mockados e funções para simular as requisições

## 💡 Exemplo de uso

1. Configure o `.env`:

   ```env
   VITE_USE_MOCK_API=true
   ```

2. Inicie a aplicação:

   ```bash
   pnpm dev
   ```

3. Busque por uma das cidades disponíveis (ex: "Brasília")

4. A aplicação usará os dados mockados automaticamente!

## 🚀 Vantagens

- ✅ Teste sem necessidade de API key
- ✅ Respostas rápidas e consistentes
- ✅ Não consome limites da API
- ✅ Funciona offline
- ✅ Ideal para desenvolvimento e testes
