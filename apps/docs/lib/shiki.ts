import { configDefault } from 'xyzdocs-core/highlight';
import type { ResolvedShikiConfig } from 'xyzdocs-core/highlight/config';

export const shikiConfig: ResolvedShikiConfig = {
  ...configDefault,
  defaultThemes: {
    themes: {
      light: 'github-light',
      dark: 'vesper',
    },
  },
};
