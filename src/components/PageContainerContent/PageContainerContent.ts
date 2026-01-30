/**
 * PageContainerContent Component
 * Conteúdo interno do PageContainer (input, cards, lógica de busca)
 */

import { validateApiKey, fetchCityWeather } from '../../lib/index.js';
import { createCityLabel } from '../CityLabel/index.js';
import { createDetailsCardsContainer } from '../DetailsCardsContainer/index.js';
import { createResultElement } from '../ResultElement/index.js';
import { createSearchInput } from '../SearchInput/index.js';
import { createTemperatureCard } from '../TemperatureCard/index.js';

import styles from './PageContainerContent.module.css';

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

  // Classes BEM (estilos condicionais)
  const c = {
    cityLabel: styles.pageContainerContent__cityLabel,
    cityLabelVisible: styles.pageContainerContent__cityLabel_visible,
    temperatureCard: styles.pageContainerContent__temperatureCard,
    temperatureCardVisible: styles.pageContainerContent__temperatureCard_visible,
    detailsCards: styles.pageContainerContent__detailsCards,
    detailsCardsVisible: styles.pageContainerContent__detailsCards_visible,
    result: styles.pageContainerContent__result,
    resultVisible: styles.pageContainerContent__result_visible,
    resultError: styles.pageContainerContent__result_error,
    resultInfo: styles.pageContainerContent__result_info,
    resultDefault: styles.pageContainerContent__result_default,
    input: styles.pageContainerContent__input,
    inputFocused: styles.pageContainerContent__input_focused,
    searchIcon: styles.pageContainerContent__searchIcon,
    searchIconFocused: styles.pageContainerContent__searchIcon_focused,
    searchIconHover: styles.pageContainerContent__searchIcon_hover,
  };
  const resultModifiers = [c.resultError, c.resultInfo, c.resultDefault];

  // Aplicar classes base - elementos ocultos por padrão
  cityLabel.classList.add(c.cityLabel);
  temperatureCard.classList.add(c.temperatureCard);
  detailsCardsContainer.classList.add(c.detailsCards);
  resultElement.classList.add(c.result);
  input.classList.add(c.input);
  searchIcon.classList.add(c.searchIcon);

  const hideContentPanels = () => {
    cityLabel.classList.remove(c.cityLabelVisible);
    temperatureCard.classList.remove(c.temperatureCardVisible);
    detailsCardsContainer.classList.remove(c.detailsCardsVisible);
  };

  const showResultMessage = (text: string, modifier: string) => {
    hideContentPanels();
    resultElement.classList.remove(...resultModifiers);
    resultElement.classList.add(modifier, c.resultVisible);
    resultElement.textContent = text;
  };

  const hideResult = () => {
    resultElement.classList.remove(c.resultVisible, ...resultModifiers);
  };

  // Função de pesquisa
  const handleSearch = async () => {
    const cityName = input.value.trim();

    if (!cityName) {
      showResultMessage('Por favor, digite o nome de uma cidade.', c.resultError);
      return;
    }

    // Validar API key
    const apiValidation = validateApiKey();
    if (!apiValidation.valid) {
      showResultMessage(apiValidation.error || 'Erro desconhecido', c.resultError);
      return;
    }

    // Esconder elementos anteriores e mostrar estado de carregamento
    showResultMessage('Buscando...', c.resultDefault);
    searchIcon.disabled = true;
    input.disabled = true;

    try {
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
      cityLabel.classList.add(c.cityLabelVisible);

      // Exibir temperatura atual e detalhes
      if (weatherData.current && typeof weatherData.current.temp === 'number') {
        // Converter de Kelvin para Celsius
        const tempCelsius = Math.round(weatherData.current.temp - 273.15);
        temperatureValue.textContent = `${tempCelsius}°C`;
        temperatureCard.classList.add(c.temperatureCardVisible);

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

        detailsCardsContainer.classList.add(c.detailsCardsVisible);
        hideResult();
      } else {
        showResultMessage('Dados de temperatura não disponíveis.', c.resultInfo);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      const isNotFound = errorMessage.includes('Nenhuma cidade encontrada');
      const text = isNotFound ? errorMessage : `Erro ao buscar dados: ${errorMessage}`;
      showResultMessage(text, isNotFound ? c.resultInfo : c.resultError);
    } finally {
      searchIcon.disabled = false;
      input.disabled = false;
    }
  };

  // Eventos de foco no input
  input.addEventListener('focus', () => {
    input.classList.add(c.inputFocused);
    searchIcon.classList.add(c.searchIconFocused);
  });

  input.addEventListener('blur', () => {
    input.classList.remove(c.inputFocused);
    searchIcon.classList.remove(c.searchIconFocused);
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
    searchIcon.classList.add(c.searchIconHover);
  });

  searchIcon.addEventListener('mouseleave', () => {
    searchIcon.classList.remove(c.searchIconHover);
  });

  // Montar estrutura
  container.appendChild(inputWrapper);
  container.appendChild(cityLabel);
  container.appendChild(temperatureCard);
  container.appendChild(detailsCardsContainer);
  container.appendChild(resultElement);
}
