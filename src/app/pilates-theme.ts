import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const DengePilatesPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#f7f7f5',
      100: '#e9e9e5',
      200: '#d1d1cb',
      300: '#b1b1aa',
      400: '#888881',
      500: '#66665f',
      600: '#51514a',
      700: '#41413c',
      800: '#32322e',
      900: '#292925',
      950: '#171816',
    },

    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#fffdf7',
          100: '#f8f3e6',
          200: '#eee7d4',
          300: '#ddd3b7',
          400: '#bdb294',
          500: '#958b72',
          600: '#6d6654',
          700: '#514c40',
          800: '#37352f',
          900: '#242521',
          950: '#111210',
        },
      },
    },
  },
});
