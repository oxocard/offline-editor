import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
}

html {
  /* This defines what 1rem is */
  font-size: 62.5%; /* 1 rem = 10px; 10px/16px = 62.5% */
  -webkit-text-size-adjust: 100%;
  overflow: hidden;
}

/* @media only screen and (max-width: 1480px) {
  html {
    font-size: 56.25%;
  }
} */

/* @media only screen and (max-width: 1440px) {
  html {
    font-size: 50%;
  }
} */

/* @media only screen and (max-width: 599px) {
  html {
    font-size: 43.75%;
  }
} */

body {
  box-sizing: border-box;
}

#root {
  width: 100vw;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  overflow: hidden;
  color: black;
}

/* width */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: none; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #AAA; 
}

::-webkit-scrollbar-corner {
  background: none; 
}

.toast-container {
  font-size: 1.4rem;
}

.Toastify__toast-container--bottom-right:has(div.cartridge_toast) {
    width: auto;
}

`;
