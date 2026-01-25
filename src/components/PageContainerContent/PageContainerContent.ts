/**
 * PageContainerContent Component
 * Conteúdo interno do PageContainer (input, cards, lógica de busca)
 */

import { mockGeoApi, mockWeatherApi } from '../../mocks/weatherApiMocks.js';

export function createPageContainerContent(container: HTMLDivElement): void {
  // Container do input com ícone
  const inputWrapper = document.createElement('div');
  inputWrapper.style.cssText = `
    position: relative;
    width: 100%;
    max-width: 400px;
  `;

  // Caixa de texto
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Digite o nome da cidade...';
  input.style.cssText = `
    width: 100%;
    padding: 0.75rem 3rem 0.75rem 1rem;
    font-size: 1rem;
    border: 1px solid var(--md-sys-color-outline, #74777F);
    border-radius: 8px;
    background-color: var(--md-sys-color-surface, #F9F9FF);
    color: var(--md-sys-color-on-surface, #1A1B20);
    outline: none;
    transition: border-color 0.2s ease;
    box-sizing: border-box;
  `;

  // Ícone de lupa (SVG)
  const searchIcon = document.createElement('button');
  searchIcon.type = 'button';
  searchIcon.setAttribute('aria-label', 'Pesquisar cidade');
  searchIcon.style.cssText = `
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 2rem;
    height: 2rem;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    color: var(--md-sys-color-on-surface-variant, #44474F);
    transition: color 0.2s ease;
    border-radius: 4px;
  `;

  // SVG da lupa
  searchIcon.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
    </svg>
  `;

  // Label para exibir cidade, estado e país
  const cityLabel = document.createElement('div');
  cityLabel.style.cssText = `
    margin-top: 1rem;
    max-width: 400px;
    width: 100%;
    font-size: 1rem;
    color: var(--md-sys-color-on-surface, #1A1B20);
    text-align: center;
    font-weight: 500;
    min-height: 1.5rem;
    display: none;
  `;

  // Card para exibir temperatura
  const temperatureCard = document.createElement('div');
  temperatureCard.style.cssText = `
    margin-top: 1rem;
    padding: 1.5rem;
    max-width: 400px;
    width: 100%;
    background-color: var(--md-sys-color-surface-container-low);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15);
    border-radius: 0.75rem;
    text-align: center;
    display: none;
  `;

  const temperatureValue = document.createElement('div');
  temperatureValue.style.cssText = `
    font-size: 3rem;
    font-weight: 600;
    color: var(--md-sys-color-primary, #435E91);
    line-height: 1;
  `;

  const temperatureLabel = document.createElement('div');
  temperatureLabel.style.cssText = `
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--md-sys-color-on-surface-variant, #44474F);
  `;
  temperatureLabel.textContent = 'Temperatura Atual';

  temperatureCard.appendChild(temperatureValue);
  temperatureCard.appendChild(temperatureLabel);

  // Container para os cards menores
  const detailsCardsContainer = document.createElement('div');
  detailsCardsContainer.style.cssText = `
    margin-top: 1rem;
    max-width: 400px;
    width: 100%;
    display: none;
    flex-direction: row;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
  `;

  // Função auxiliar para criar um card menor
  const createDetailCard = (label: string) => {
    const card = document.createElement('div');
    card.style.cssText = `
      flex: 1;
      min-width: 110px;
      padding: 1rem;
      background-color: var(--md-sys-color-surface-container-low);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15);
      border-radius: 0.75rem;
      text-align: center;
    `;

    const value = document.createElement('div');
    value.style.cssText = `
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--md-sys-color-primary, #435E91);
      line-height: 1.2;
      margin-bottom: 0.25rem;
    `;

    const labelElement = document.createElement('div');
    labelElement.style.cssText = `
      font-size: 0.75rem;
      color: var(--md-sys-color-on-surface-variant, #44474F);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    `;
    labelElement.textContent = label;

    card.appendChild(value);
    card.appendChild(labelElement);

    return { card, value };
  };

  // Cards de detalhes
  const feelsLikeCard = createDetailCard('Sensação');
  const humidityCard = createDetailCard('Umidade');
  const windSpeedCard = createDetailCard('Vento');

  detailsCardsContainer.appendChild(feelsLikeCard.card);
  detailsCardsContainer.appendChild(humidityCard.card);
  detailsCardsContainer.appendChild(windSpeedCard.card);

  // Elemento para exibir erros
  const resultElement = document.createElement('p');
  resultElement.style.cssText = `
    margin-top: 1rem;
    padding: 1rem;
    max-width: 400px;
    width: 100%;
    font-size: 0.875rem;
    color: var(--md-sys-color-on-surface, #1A1B20);
    background-color: var(--md-sys-color-surface-container, #EDEDF4);
    border-radius: 8px;
    word-wrap: break-word;
    white-space: pre-wrap;
    min-height: 1.5rem;
    display: none;
  `;

  // Função de pesquisa
  const handleSearch = async () => {
    const cityName = input.value.trim();

    if (!cityName) {
      cityLabel.style.display = 'none';
      temperatureCard.style.display = 'none';
      detailsCardsContainer.style.display = 'none';
      resultElement.textContent = 'Por favor, digite o nome de uma cidade.';
      resultElement.style.color = 'var(--md-sys-color-error, #BA1A1A)';
      resultElement.style.display = 'block';
      return;
    }

    // Verificar se deve usar mocks
    const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

    // Obter API key do ambiente (não obrigatória se usar mocks)
    const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

    if (!useMockApi && !apiKey) {
      cityLabel.style.display = 'none';
      temperatureCard.style.display = 'none';
      detailsCardsContainer.style.display = 'none';
      resultElement.textContent = 'Erro: API key não configurada. Verifique o arquivo .env';
      resultElement.style.color = 'var(--md-sys-color-error, #BA1A1A)';
      resultElement.style.display = 'block';
      return;
    }

    // Esconder elementos anteriores e mostrar estado de carregamento
    cityLabel.style.display = 'none';
    temperatureCard.style.display = 'none';
    detailsCardsContainer.style.display = 'none';
    resultElement.textContent = 'Buscando...';
    resultElement.style.color = 'var(--md-sys-color-on-surface, #1A1B20)';
    resultElement.style.display = 'block';
    searchIcon.disabled = true;
    input.disabled = true;

    try {
      let geoData;

      if (useMockApi) {
        // Usar dados mockados
        resultElement.textContent = 'Buscando cidade...';
        geoData = await mockGeoApi(cityName);
      } else {
        // Primeira requisição: buscar coordenadas da cidade
        const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=5&appid=${apiKey}`;

        resultElement.textContent = 'Buscando cidade...';
        const geoResponse = await fetch(geoUrl);

        if (!geoResponse.ok) {
          throw new Error(
            `Erro na requisição de geolocalização: ${geoResponse.status} ${geoResponse.statusText}`,
          );
        }

        geoData = await geoResponse.json();
      }

      // Verificar se encontrou resultados
      if (!Array.isArray(geoData) || geoData.length === 0) {
        cityLabel.style.display = 'none';
        temperatureCard.style.display = 'none';
        detailsCardsContainer.style.display = 'none';
        resultElement.textContent = 'Nenhuma cidade encontrada com esse nome.';
        resultElement.style.color = 'var(--md-sys-color-on-surface-variant, #44474F)';
        resultElement.style.display = 'block';
        return;
      }

      // Extrair dados do primeiro elemento
      const firstResult = geoData[0];
      const { lat, lon } = firstResult;

      // Salvar propriedades: local_names.pt, country e state
      const cityNamePt = firstResult.local_names?.pt || firstResult.name;
      const country = firstResult.country || '';
      const state = firstResult.state || '';

      // Atualizar label com cidade, estado e país
      const locationParts = [cityNamePt];
      if (state) locationParts.push(state);
      if (country) locationParts.push(country);
      cityLabel.textContent = locationParts.join(', ');
      cityLabel.style.display = 'block';

      if (!lat || !lon) {
        throw new Error('Coordenadas não encontradas na resposta da API');
      }

      // Segunda requisição: buscar dados do clima
      resultElement.textContent = 'Buscando dados do clima...';

      let weatherData;

      if (useMockApi) {
        // Usar dados mockados
        weatherData = await mockWeatherApi(lat, lon);
      } else {
        const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&exclude=minutely,hourly,daily,alerts`;

        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
          throw new Error(
            `Erro na requisição do clima: ${weatherResponse.body} ${weatherResponse.status} ${weatherResponse.statusText}`,
          );
        }

        weatherData = await weatherResponse.json();
      }

      // Exibir temperatura atual e detalhes
      if (weatherData.current && typeof weatherData.current.temp === 'number') {
        // Converter de Kelvin para Celsius
        const tempCelsius = Math.round(weatherData.current.temp - 273.15);
        temperatureValue.textContent = `${tempCelsius}°C`;
        temperatureCard.style.display = 'block';

        // Preencher cards de detalhes
        if (typeof weatherData.current.feels_like === 'number') {
          const feelsLikeCelsius = Math.round(weatherData.current.feels_like - 273.15);
          feelsLikeCard.value.textContent = `${feelsLikeCelsius}°C`;
        } else {
          feelsLikeCard.value.textContent = 'N/A';
        }

        if (typeof weatherData.current.humidity === 'number') {
          humidityCard.value.textContent = `${weatherData.current.humidity}%`;
        } else {
          humidityCard.value.textContent = 'N/A';
        }

        if (typeof weatherData.current.wind_speed === 'number') {
          // Converter de m/s para km/h
          const windKmh = Math.round(weatherData.current.wind_speed * 3.6);
          windSpeedCard.value.textContent = `${windKmh} km/h`;
        } else {
          windSpeedCard.value.textContent = 'N/A';
        }

        detailsCardsContainer.style.display = 'flex';
        detailsCardsContainer.style.flexDirection = 'row';
        resultElement.style.display = 'none';
      } else {
        cityLabel.style.display = 'none';
        temperatureCard.style.display = 'none';
        detailsCardsContainer.style.display = 'none';
        resultElement.textContent = 'Dados de temperatura não disponíveis.';
        resultElement.style.color = 'var(--md-sys-color-on-surface-variant, #44474F)';
        resultElement.style.display = 'block';
      }
    } catch (error) {
      // Tratar erros
      cityLabel.style.display = 'none';
      temperatureCard.style.display = 'none';
      detailsCardsContainer.style.display = 'none';
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      resultElement.textContent = `Erro ao buscar dados: ${errorMessage}`;
      resultElement.style.color = 'var(--md-sys-color-error, #BA1A1A)';
      resultElement.style.display = 'block';
    } finally {
      // Reabilitar input e botão
      searchIcon.disabled = false;
      input.disabled = false;
    }
  };

  // Eventos de foco no input
  input.addEventListener('focus', () => {
    input.style.borderColor = 'var(--md-sys-color-primary, #435E91)';
    searchIcon.style.color = 'var(--md-sys-color-primary, #435E91)';
  });

  input.addEventListener('blur', () => {
    input.style.borderColor = 'var(--md-sys-color-outline, #74777F)';
    searchIcon.style.color = 'var(--md-sys-color-on-surface-variant, #44474F)';
  });

  // Pesquisar ao pressionar Enter
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  });

  // Pesquisar ao clicar no ícone
  searchIcon.addEventListener('click', handleSearch);

  // Hover no ícone
  searchIcon.addEventListener('mouseenter', () => {
    searchIcon.style.color = 'var(--md-sys-color-primary, #435E91)';
    searchIcon.style.backgroundColor = 'var(--md-sys-color-primary-container, #D8E2FF)';
  });

  searchIcon.addEventListener('mouseleave', () => {
    const isFocused = document.activeElement === input;
    searchIcon.style.color = isFocused
      ? 'var(--md-sys-color-primary, #435E91)'
      : 'var(--md-sys-color-on-surface-variant, #44474F)';
    searchIcon.style.backgroundColor = 'transparent';
  });

  // Montar estrutura
  inputWrapper.appendChild(input);
  inputWrapper.appendChild(searchIcon);
  container.appendChild(inputWrapper);
  container.appendChild(cityLabel);
  container.appendChild(temperatureCard);
  container.appendChild(detailsCardsContainer);
  container.appendChild(resultElement);
}
