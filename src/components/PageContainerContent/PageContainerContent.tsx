import { useCallback, useEffect, useMemo, useState } from 'react';

import { getCachedGeolocation } from '../../lib/geolocation.js';
import {
  fetchCityWeather,
  fetchWeatherData,
  fetchWeatherForCoordinates,
  getStoredTemperatureUnits,
  setStoredTemperatureUnits,
  validateApiKey,
} from '../../lib/index.js';
import type { TemperatureUnit } from '../../lib/temperatureUnitsStorage.js';
import type { GeoLocationResult, WeatherData } from '../../lib/types.js';
import { formatWeatherForDisplay } from '../../lib/weatherDisplayFormat.js';
import { CityLabel } from '../CityLabel/CityLabel.js';
import { DailyForecast } from '../DailyForecast/DailyForecast.js';
import { DetailsCardsContainer } from '../DetailsCardsContainer/DetailsCardsContainer.js';
import resultElementStyles from '../ResultElement/ResultElement.module.css';
import { SearchInput } from '../SearchInput/SearchInput.js';
import { TemperatureCard } from '../TemperatureCard/TemperatureCard.js';
import { TemperatureUnitsToggle } from '../TemperatureUnitsToggle/TemperatureUnitsToggle.js';

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
  const [units, setUnits] = useState<TemperatureUnit>(() => getStoredTemperatureUnits());
  const [snapshot, setSnapshot] = useState<{
    geo: GeoLocationResult;
    weather: WeatherData;
  } | null>(null);

  const displayWeather = useMemo(() => {
    if (!snapshot) {
      return null;
    }
    return formatWeatherForDisplay(snapshot.weather, units);
  }, [snapshot, units]);

  const hidePanels = useCallback(() => {
    setLocationLine(null);
    setSnapshot(null);
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

      if (!weatherData.current || typeof weatherData.current.temp !== 'number') {
        showResult('Dados de temperatura não disponíveis.', 'info');
        return;
      }

      setSnapshot({ geo, weather: weatherData });
      hideResult();
    },
    [hideResult, showResult],
  );

  const handleUnitsChange = useCallback(
    async (newUnits: TemperatureUnit) => {
      if (newUnits === units) {
        return;
      }
      if (!snapshot) {
        setStoredTemperatureUnits(newUnits);
        setUnits(newUnits);
        return;
      }

      setBusy(true);
      try {
        const weather = await fetchWeatherData(snapshot.geo.lat, snapshot.geo.lon, newUnits);
        setStoredTemperatureUnits(newUnits);
        setUnits(newUnits);
        setSnapshot({ geo: snapshot.geo, weather });
        hideResult();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        showResult(`Erro ao atualizar unidades: ${errorMessage}`, 'error');
      } finally {
        setBusy(false);
      }
    },
    [snapshot, units, hideResult, showResult],
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
        const u = getStoredTemperatureUnits();
        const { geo, weather: weatherData } = await fetchWeatherForCoordinates(
          pos.latitude,
          pos.longitude,
          u,
        );
        if (cancelled) return;

        setUnits(u);
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
      const { geo, weather: weatherData } = await fetchCityWeather(cityName, units);
      applyWeatherSnapshot(geo, weatherData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      const isNotFound = errorMessage.includes('Nenhuma cidade encontrada');
      const text = isNotFound ? errorMessage : `Erro ao buscar dados: ${errorMessage}`;
      showResult(text, isNotFound ? 'info' : 'error');
    } finally {
      setBusy(false);
    }
  }, [query, showResult, applyWeatherSnapshot, units]);

  const resultModifierClass =
    result.variant === 'error'
      ? styles.pageContainerContent__result_error
      : result.variant === 'info'
        ? styles.pageContainerContent__result_info
        : styles.pageContainerContent__result_default;

  return (
    <>
      <SearchInput value={query} onChange={setQuery} onSearch={handleSearch} disabled={busy} />
      <TemperatureUnitsToggle value={units} onChange={handleUnitsChange} disabled={busy} />
      <CityLabel visible={Boolean(locationLine)} text={locationLine ?? ''} />
      <TemperatureCard visible={Boolean(displayWeather)} value={displayWeather?.temp ?? ''} />
      <DetailsCardsContainer
        visible={Boolean(displayWeather)}
        feelsLike={displayWeather?.feels ?? 'N/A'}
        humidity={displayWeather?.humidity ?? 'N/A'}
        windSpeed={displayWeather?.wind ?? 'N/A'}
      />
      <DailyForecast
        visible={Boolean(displayWeather && displayWeather.dailyForecast.length > 0)}
        days={displayWeather?.dailyForecast ?? []}
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
