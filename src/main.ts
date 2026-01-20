/// <reference types="vite/client" />

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  // Container centralizado
  const container = document.createElement('div');
  container.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 100vh;
    padding-top: 2rem;
  `;

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

  // Elemento para exibir resultado
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
  `;

  // Função de pesquisa
  const handleSearch = async () => {
    const cityName = input.value.trim();

    if (!cityName) {
      resultElement.textContent = 'Por favor, digite o nome de uma cidade.';
      resultElement.style.color = 'var(--md-sys-color-error, #BA1A1A)';
      return;
    }

    // Obter API key do ambiente
    const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

    if (!apiKey) {
      resultElement.textContent = 'Erro: API key não configurada. Verifique o arquivo .env';
      resultElement.style.color = 'var(--md-sys-color-error, #BA1A1A)';
      return;
    }

    // Mostrar estado de carregamento
    resultElement.textContent = 'Buscando...';
    resultElement.style.color = 'var(--md-sys-color-on-surface, #1A1B20)';
    searchIcon.disabled = true;
    input.disabled = true;

    try {
      // Primeira requisição: buscar coordenadas da cidade
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=5&appid=${apiKey}`;

      resultElement.textContent = 'Buscando cidade...';
      const geoResponse = await fetch(geoUrl);

      if (!geoResponse.ok) {
        throw new Error(`Erro na requisição de geolocalização: ${geoResponse.status} ${geoResponse.statusText}`);
      }

      const geoData = await geoResponse.json();

      // Verificar se encontrou resultados
      if (!Array.isArray(geoData) || geoData.length === 0) {
        resultElement.textContent = 'Nenhuma cidade encontrada com esse nome.';
        resultElement.style.color = 'var(--md-sys-color-on-surface-variant, #44474F)';
        return;
      }

      // Extrair lat e lon do primeiro elemento
      const firstResult = geoData[0];
      const { lat, lon } = firstResult;

      if (!lat || !lon) {
        throw new Error('Coordenadas não encontradas na resposta da API');
      }

      // Segunda requisição: buscar dados do clima
      resultElement.textContent = 'Buscando dados do clima...';
      const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&exclude=minutely,hourly,daily,alerts`;

      const weatherResponse = await fetch(weatherUrl);

      if (!weatherResponse.ok) {
        throw new Error(`Erro na requisição do clima: ${weatherResponse.body} ${weatherResponse.status} ${weatherResponse.statusText}`);
      }

      const weatherData = await weatherResponse.json();

      // Exibir resultado da segunda requisição formatado
      resultElement.textContent = JSON.stringify(weatherData, null, 2);
      resultElement.style.color = 'var(--md-sys-color-on-surface, #1A1B20)';
    } catch (error) {
      // Tratar erros
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      resultElement.textContent = `Erro ao buscar dados: ${errorMessage}`;
      resultElement.style.color = 'var(--md-sys-color-error, #BA1A1A)';
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
  container.appendChild(resultElement);
  app.appendChild(container);
}
