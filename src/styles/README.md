# 🎨 Sistema de Temas Material Design 3

Sistema completo de temas baseado no Material Design 3, gerado a partir do Material Theme Builder.

## 📁 Estrutura

```plaintext
src/styles/
├── themes/
│   ├── tokens.css          # Tokens de cores (light/dark)
│   ├── palettes.css        # Paletas tonais completas
│   ├── theme.module.css    # Classes CSS Module para componentes
│   └── index.ts            # Utilitários e exports
├── global.css              # Estilos globais e resets
├── index.ts                # Entry point principal
└── README.md               # Este arquivo
```

## 🚀 Uso

### Importar estilos globais

```typescript
import '@/styles';
```

### Inicializar tema

```typescript
import { initTheme } from '@/styles';

// No entry point da aplicação
initTheme();
```

### Usar CSS Variables

```css
.myComponent {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}
```

### Usar CSS Modules

```typescript
import { theme } from '@/styles';

function MyComponent() {
  return <div className={theme.primary}>Conteúdo</div>;
}
```

### Controlar tema programaticamente

```typescript
import { setTheme, getTheme, toggleTheme } from '@/styles';

// Definir tema
setTheme('dark'); // 'light' | 'dark' | 'auto'

// Obter tema atual
const currentTheme = getTheme();

// Alternar entre light e dark
toggleTheme();
```

## 🎨 Cores Disponíveis

### Cores Principais

- **Primary**: Cor principal da aplicação
- **Secondary**: Cor secundária
- **Tertiary**: Cor terciária
- **Error**: Cores de erro

### Cores de Superfície

- **Surface**: Superfície principal
- **Surface Variant**: Variante da superfície
- **Surface Container**: Containers com diferentes elevações
  - Lowest, Low, Default, High, Highest

### Cores de Fundo

- **Background**: Cor de fundo principal
- **On Background**: Texto sobre o fundo

### Cores Inversas

- **Inverse Surface**: Superfície invertida
- **Inverse Primary**: Primary invertido

## 📦 Classes CSS Module Disponíveis

```typescript
import { theme } from '@/styles';

// Cores principais
theme.primary;
theme.primaryContainer;
theme.secondary;
theme.secondaryContainer;
theme.tertiary;
theme.tertiaryContainer;

// Erro
theme.error;
theme.errorContainer;

// Superfícies
theme.surface;
theme.surfaceVariant;
theme.surfaceContainer;
theme.surfaceContainerLowest;
theme.surfaceContainerLow;
theme.surfaceContainerHigh;
theme.surfaceContainerHighest;

// Background
theme.background;

// Utilitários
theme.outline;
theme.outlineVariant;
theme.inverseSurface;
theme.inversePrimary;
```

## 🌗 Temas

### Light Theme

Tema claro padrão seguindo as diretrizes do Material Design 3.

### Dark Theme

Tema escuro com cores otimizadas para visualização em ambientes com pouca luz.

### Auto Theme

Detecta automaticamente a preferência do sistema operacional usando `prefers-color-scheme`.

## 🎯 Paletas Tonais

Cada cor possui uma paleta tonal completa de 0 a 100:

```css
var(--md-ref-palette-primary-0); /* Preto */
var(--md-ref-palette-primary-10);
var(--md-ref-palette-primary-20);
/* ... */
var(--md-ref-palette-primary-90);
var(--md-ref-palette-primary-100); /* Branco */
```

Paletas disponíveis:

- `primary`
- `secondary`
- `tertiary`
- `neutral`
- `neutral-variant`

## 💡 Exemplo Completo

```typescript
import { theme, initTheme, setTheme } from '@/styles';

// Inicializar no entry point
initTheme();

// Em um componente
function WeatherCard() {
  return (
    <div className={theme.surfaceContainer}>
      <h2 className={theme.primary}>São Paulo</h2>
      <p>25°C - Ensolarado</p>
      <button
        className={theme.primaryContainer}
        onClick={() => setTheme('dark')}
      >
        Alternar tema
      </button>
    </div>
  );
}
```

## 🔧 Customização

Para modificar as cores do tema:

1. Acesse [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/)
2. Customize as cores desejadas
3. Exporte o JSON
4. Atualize os arquivos em `src/styles/themes/`

## 📚 Referências

- [Material Design 3](https://m3.material.io/)
- [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/)
- [Color System](https://m3.material.io/styles/color/system/overview)
