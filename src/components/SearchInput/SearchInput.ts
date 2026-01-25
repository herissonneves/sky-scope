/**
 * SearchInput Component
 * Input de busca com ícone de lupa clicável
 */

export interface SearchInputElements {
  wrapper: HTMLDivElement;
  input: HTMLInputElement;
  searchIcon: HTMLButtonElement;
}

export function createSearchInput(): SearchInputElements {
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

  // Montar estrutura
  inputWrapper.appendChild(input);
  inputWrapper.appendChild(searchIcon);

  return {
    wrapper: inputWrapper,
    input,
    searchIcon,
  };
}
