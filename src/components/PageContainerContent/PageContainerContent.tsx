import { useCallback, useEffect, useState } from 'react';

import { getCachedGeolocation } from '../../lib/geolocation.js';
import {
  fetchCityWeather,
  fetchWeatherForCoordinates,
  validateApiKey,
} from '../../lib/index.js';
import type { GeoLocationResult, WeatherData } from '../../lib/types.js';
import { CityLabel } from '../CityLabel/CityLabel.js';
import { DetailsCardsContainer } from '../DetailsCardsContainer/DetailsCardsContainer.js';
import resultElementStyles from '../ResultElement/ResultElement.module.css';
import { SearchInput } from '../SearchInput/SearchInput.js';
import { TemperatureCard } from '../TemperatureCard/TemperatureCard.js';

import styles from './PageContainerContent.module.css';

type ResultVariant = 'error' | 'info' | 'default';

export function PageContainerContent() {
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{
    visible: boolean;
    text: string;
    variant: ResultVariant;
  }>({ visible: false, text: '', variant: 'default' });
  const [locationLine, setLocationLine] = useState<string | null>(null);
  const [weather, setWeather] = useState<{
    temp: string;
    feels: string;
    humidity: string;
    wind: string;
  } | null>(null);

  const hidePanels = useCallback(() => {
    setLocationLine(null);
    setWeather(null);
  }, []);

  const showResult = useCallback(
    (text: string, variant: ResultVariant) => {
      hidePanels();
      setResult({ visible: true, text, variant });
    },
    [hidePanels],
  );

  const hideResult = useCallback(() => {
    setResult((r) => ({ ...r, visible: false }));
  }, []);

  const applyWeatherSnapshot = useCallback(
    (geo: GeoLocationResult, weatherData: WeatherData) => {
      const cityNamePt = geo.local_names?.pt || geo.name;
      const country = geo.country || '';
      const state = geo.state || '';
      const locationParts = [cityNamePt];
      if (state) locationParts.push(state);
      if (country) locationParts.push(country);
      setLocationLine(locationParts.join(', '));

      if (weatherData.current && typeof weatherData.current.temp === 'number') {
        const tempCelsius = Math.round(weatherData.current.temp - 273.15);
        const feelsLikeCelsius =
          typeof weatherData.current.feels_like === 'number'
            ? Math.round(weatherData.current.feels_like - 273.15)
            : null;
        const humidity =
          typeof weatherData.current.humidity === 'number' ? weatherData.current.humidity : null;
        const windKmh =
          typeof weatherData.current.wind_speed === 'number'
            ? Math.round(weatherData.current.wind_speed * 3.6)
            : null;

        setWeather({
          temp: `${tempCelsius}°C`,
          feels: feelsLikeCelsius !== null ? `${feelsLikeCelsius}°C` : 'N/A',
          humidity: humidity !== null ? `${humidity}%` : 'N/A',
          wind: windKmh !== null ? `${windKmh} km/h` : 'N/A',
        });
        hideResult();
      } else {
        showResult('Dados de temperatura não disponíveis.', 'info');
      }
    },
    [hideResult, showResult],
  );

  useEffect(() => {
    let cancelled = false;

    const loadLocationWeather = async () => {
      const apiValidation = validateApiKey();
      if (!apiValidation.valid) {
        return;
      }

      setBusy(true);
      showResult('Obtendo localização...', 'default');

      try {
        const pos = await getCachedGeolocation();
        if (cancelled) return;

        if (!pos) {
          hideResult();
          return;
        }

        setResult({ visible: true, text: 'Buscando previsão para sua localização...', variant: 'default' });
        const { geo, weather: weatherData } = await fetchWeatherForCoordinates(
          pos.latitude,
          pos.longitude,
        );
        if (cancelled) return;

        applyWeatherSnapshot(geo, weatherData);
      } catch (error) {
        if (cancelled) return;
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        showResult(`Erro ao carregar clima local: ${errorMessage}`, 'error');
      } finally {
        if (!cancelled) {
          setBusy(false);
        }
      }
    };

    void loadLocationWeather();

    return () => {
      cancelled = true;
    };
  }, [applyWeatherSnapshot, hideResult, showResult]);

  const handleSearch = useCallback(async () => {
    const cityName = query.trim();
    if (!cityName) {
      showResult('Por favor, digite o nome de uma cidade.', 'error');
      return;
    }

    const apiValidation = validateApiKey();
    if (!apiValidation.valid) {
      showResult(apiValidation.error, 'error');
      return;
    }

    showResult('Buscando...', 'default');
    setBusy(true);

    try {
      setResult({ visible: true, text: 'Buscando cidade...', variant: 'default' });
      const { geo, weather: weatherData } = await fetchCityWeather(cityName);
      applyWeatherSnapshot(geo, weatherData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      const isNotFound = errorMessage.includes('Nenhuma cidade encontrada');
      const text = isNotFound ? errorMessage : `Erro ao buscar dados: ${errorMessage}`;
      showResult(text, isNotFound ? 'info' : 'error');
    } finally {
      setBusy(false);
    }
  }, [query, showResult, applyWeatherSnapshot]);

  const resultModifierClass =
    result.variant === 'error'
      ? styles.pageContainerContent__result_error
      : result.variant === 'info'
        ? styles.pageContainerContent__result_info
        : styles.pageContainerContent__result_default;

  return (
    <>
      <SearchInput value={query} onChange={setQuery} onSearch={handleSearch} disabled={busy} />
      <CityLabel visible={Boolean(locationLine)} text={locationLine ?? ''} />
      <TemperatureCard visible={Boolean(weather)} value={weather?.temp ?? ''} />
      <DetailsCardsContainer
        visible={Boolean(weather)}
        feelsLike={weather?.feels ?? 'N/A'}
        humidity={weather?.humidity ?? 'N/A'}
        windSpeed={weather?.wind ?? 'N/A'}
      />
      {result.visible ? (
        <p
          className={`${resultElementStyles.resultElement} ${styles.pageContainerContent__result} ${styles.pageContainerContent__result_visible} ${resultModifierClass}`}
        >
          {result.text}
        </p>
      ) : null}
    </>
  );
}
