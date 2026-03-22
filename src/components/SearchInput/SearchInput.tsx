import { useState, type KeyboardEvent } from 'react';

import layoutStyles from '../PageContainerContent/PageContainerContent.module.css';

import styles from './SearchInput.module.css';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  disabled?: boolean;
}

export function SearchInput({ value, onChange, onSearch, disabled }: SearchInputProps) {
  const [inputFocused, setInputFocused] = useState(false);
  const [iconHover, setIconHover] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div className={styles.searchInput}>
      <input
        type="text"
        className={`${styles.searchInput__input} ${layoutStyles.pageContainerContent__input} ${
          inputFocused ? layoutStyles.pageContainerContent__input_focused : ''
        }`}
        placeholder="Digite o nome da cidade..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
        disabled={disabled}
      />
      <button
        type="button"
        aria-label="Pesquisar cidade"
        className={`${styles.searchInput__searchIcon} ${layoutStyles.pageContainerContent__searchIcon} ${
          inputFocused ? layoutStyles.pageContainerContent__searchIcon_focused : ''
        } ${iconHover ? layoutStyles.pageContainerContent__searchIcon_hover : ''}`}
        onClick={onSearch}
        onMouseEnter={() => setIconHover(true)}
        onMouseLeave={() => setIconHover(false)}
        disabled={disabled}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
}
