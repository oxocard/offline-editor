import { css } from 'styled-components';
import type { Interpolation } from 'styled-components';

/*
MEDIA QUERY MANAGER
0 - 600px:      Phone
600 - 900px:    Tablet portrait
900 - 1200px:   Tablet landscape
[1200 - 1800] is where our normal styles apply
1800px + :      Big desktop
*/
export enum Breakpoints {
  phone = '599px',
  tabPort = '899px',
  tabLand = '1199px',
  bigDesktop = '1800px',
}

export const respondMax = (breakpoint: Breakpoints) => {
  return (style: TemplateStringsArray, ...params: Interpolation<object>[]) => css`
    @media (max-width: ${breakpoint}) {
      ${css(style, ...params)};
    }
  `;
};

export const respondMin = (breakpoint: Breakpoints) => {
  return (style: TemplateStringsArray, ...params: Interpolation<object>[]) => css`
    @media (min-width: ${breakpoint}) {
      ${css(style, ...params)};
    }
  `;
};
