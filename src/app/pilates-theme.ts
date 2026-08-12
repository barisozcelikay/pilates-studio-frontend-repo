import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const DengePilatesPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#f2f6f3',
      100: '#e4ede7',
      200: '#c9dbcf',
      300: '#a9c2b2',
      400: '#86a692',
      500: '#557563',
      600: '#466653',
      700: '#385543',
      800: '#30483a',
      900: '#263b30',
      950: '#18271f',
    },

    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#f8faf8',
          100: '#f4f6f2',
          200: '#e9eeea',
          300: '#e0e6e1',
          400: '#cbd5ce',
          500: '#aab6ae',
          600: '#89968e',
          700: '#718078',
          800: '#59675f',
          900: '#405047',
          950: '#30483a',
        },
      },
    },
  },
});
