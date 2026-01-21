/**
 * Mock data para testes da API OpenWeatherMap
 * Use VITE_USE_MOCK_API=true no .env para ativar
 */

// Mock da resposta da API de geolocalização (geo/1.0/direct)
export const mockGeoData = [
  {
    name: 'Brasília',
    local_names: {
      pt: 'Brasília',
      en: 'Brasília',
      es: 'Brasilia',
      fr: 'Brasilia',
    },
    lat: -15.7934036,
    lon: -47.8823172,
    country: 'BR',
    state: 'Federal District',
  },
  {
    name: 'São Paulo',
    local_names: {
      pt: 'São Paulo',
      en: 'São Paulo',
      es: 'São Paulo',
    },
    lat: -23.5505199,
    lon: -46.6333094,
    country: 'BR',
    state: 'São Paulo',
  },
  {
    name: 'Rio de Janeiro',
    local_names: {
      pt: 'Rio de Janeiro',
      en: 'Rio de Janeiro',
      es: 'Río de Janeiro',
    },
    lat: -22.9068467,
    lon: -43.1728965,
    country: 'BR',
    state: 'Rio de Janeiro',
  },
];

// Mock da resposta da API de clima (data/3.0/onecall)
export const mockWeatherData = {
  lat: -15.7934036,
  lon: -47.8823172,
  timezone: 'America/Sao_Paulo',
  timezone_offset: -10800,
  current: {
    dt: 1705680000,
    sunrise: 1705656000,
    sunset: 1705702800,
    temp: 298.15, // 25°C em Kelvin
    feels_like: 299.15, // 26°C em Kelvin
    pressure: 1013,
    humidity: 65,
    dew_point: 290.15,
    uvi: 7.5,
    clouds: 20,
    visibility: 10000,
    wind_speed: 3.5, // m/s (12.6 km/h)
    wind_deg: 180,
    wind_gust: 5.2,
    weather: [
      {
        id: 800,
        main: 'Clear',
        description: 'céu limpo',
        icon: '01d',
      },
    ],
  },
};

// Função para simular delay de requisição
export const simulateApiDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Função para buscar dados mockados de geolocalização
export const mockGeoApi = async (cityName: string) => {
  await simulateApiDelay(300);

  const normalizedCity = cityName.toLowerCase().trim();

  // Buscar cidade que corresponde (parcial ou completa)
  const matches = mockGeoData.filter(
    (city) =>
      city.name.toLowerCase().includes(normalizedCity) ||
      city.local_names?.pt?.toLowerCase().includes(normalizedCity) ||
      city.local_names?.en?.toLowerCase().includes(normalizedCity),
  );

  if (matches.length === 0) {
    return [];
  }

  return matches;
};

// Função para buscar dados mockados do clima
export const mockWeatherApi = async (lat: number, lon: number) => {
  await simulateApiDelay(400);

  // Retornar dados mockados com coordenadas atualizadas
  return {
    ...mockWeatherData,
    lat,
    lon,
    // Variações de temperatura baseadas em coordenadas (simulação)
    current: {
      ...mockWeatherData.current,
      temp: mockWeatherData.current.temp + (Math.random() * 10 - 5), // ±5°C de variação
      feels_like: mockWeatherData.current.feels_like + (Math.random() * 10 - 5),
      humidity: Math.round(mockWeatherData.current.humidity + (Math.random() * 20 - 10)), // ±10%
      wind_speed: mockWeatherData.current.wind_speed + (Math.random() * 2 - 1), // ±1 m/s
    },
  };
};
