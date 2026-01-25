/**
 * PageContainerContent Component
 * Conteúdo interno do PageContainer (input, cards, lógica de busca)
 */

import {
  validateApiKey,
  fetchCityWeather,
} from '../../lib/index.js';
import { createCityLabel } from '../CityLabel/index.js';
import { createDetailsCardsContainer } from '../DetailsCardsContainer/index.js';
import { createResultElement } from '../ResultElement/index.js';
import { createSearchInput } from '../SearchInput/index.js';
import { createTemperatureCard } from '../TemperatureCard/index.js';

export function createPageContainerContent(container: HTMLDivElement): void {
  // Criar componente de input de busca
  const { wrapper: inputWrapper, input, searchIcon } = createSearchInput();

  // Criar componente de label da cidade
  const cityLabel = createCityLabel();

  // Criar componente de card de temperatura
  const { card: temperatureCard, value: temperatureValue } = createTemperatureCard();

  // Criar componente de container de cards de detalhes
  const {
    container: detailsCardsContainer,
    feelsLikeCard,
    humidityCard,
    windSpeedCard,
  } = createDetailsCardsContainer();

  // Criar componente de elemento de resultado/erro
  const resultElement = createResultElement();

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

    // Validar API key
    const apiValidation = validateApiKey();
    if (!apiValidation.valid) {
      cityLabel.style.display = 'none';
      temperatureCard.style.display = 'none';
      detailsCardsContainer.style.display = 'none';
      resultElement.textContent = apiValidation.error || 'Erro desconhecido';
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
      // Buscar dados da cidade e clima usando a lib
      resultElement.textContent = 'Buscando cidade...';
      const { geo, weather: weatherData } = await fetchCityWeather(cityName);

      // Extrair dados de geolocalização
      const cityNamePt = geo.local_names?.pt || geo.name;
      const country = geo.country || '';
      const state = geo.state || '';

      // Atualizar label com cidade, estado e país
      const locationParts = [cityNamePt];
      if (state) locationParts.push(state);
      if (country) locationParts.push(country);
      cityLabel.textContent = locationParts.join(', ');
      cityLabel.style.display = 'block';

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

      // Verificar se é erro de cidade não encontrada
      if (errorMessage.includes('Nenhuma cidade encontrada')) {
        resultElement.textContent = errorMessage;
        resultElement.style.color = 'var(--md-sys-color-on-surface-variant, #44474F)';
      } else {
        resultElement.textContent = `Erro ao buscar dados: ${errorMessage}`;
        resultElement.style.color = 'var(--md-sys-color-error, #BA1A1A)';
      }
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
  container.appendChild(inputWrapper);
  container.appendChild(cityLabel);
  container.appendChild(temperatureCard);
  container.appendChild(detailsCardsContainer);
  container.appendChild(resultElement);
}
