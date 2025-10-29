import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  // 1) ESLint rekommenderade regler (JS)
  js.configs.recommended,

  // 2) TypeScript-regler — detta är en ARRAY → sprids på toppnivå
  ...tseslint.configs.recommended,

  // 3) Stäng av regler som krockar med Prettier (flat-config-kompatibel)
  prettierConfig,

  // 4) Projektets egna inställningar/regler
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      // Sätt INTE parser här – tseslint-configs ovan tar hand om det.
      // Vill du köra type-checked-regler? Se kommentaren nedan.
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error', // kör Prettier som regel
      'no-console': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // 5) Ignorerade paths
  {
    ignores: ['dist/', 'node_modules/', '.vscode/'],
  },
];

/* 
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
]; */
