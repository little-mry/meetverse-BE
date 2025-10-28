import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    // 1. Grundläggande "ESLint rekommenderade" regler
    ...pluginJs.configs.recommended,
  },
  {
    // 2. TypeScript-specifika regler
    // '...tseslint.configs.recommended' är en array, så vi sprider ut den
    ...tseslint.configs.recommended,
  },
  {
    // 3. Prettier-pluginet (måste vara SIST i "plugin"-listan)
    // Detta stänger av ESLint-regler som krockar med Prettier
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      // Aktivera Prettiers regler som ESLint-fel
      ...eslintConfigPrettier.rules,
      'prettier/prettier': 'error',
    },
  },
  {
    // 4. Globala inställningar 
    languageOptions: {
      globals: {
        ...globals.node, // Lägg till alla Node.js-globaler (process, require, etc.)
        ...globals.es2020,
      },
      // Ställ in parsern för TypeScript
      parser: tseslint.parser,
    },
    // Ignorera filer som inte ska lintas
    ignores: ['dist/', 'node_modules/', '.vscode/'],

    // Dina egna regler kan åsidosätta rekommendationerna
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-console': 'warn',
    },
  },
];