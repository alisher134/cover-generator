import stylistic from '@stylistic/eslint-plugin';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';
import checkFile from 'eslint-plugin-check-file';
import perfectionist from 'eslint-plugin-perfectionist';
import reactPlugin from 'eslint-plugin-react';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...tseslint.config({
    extends: [...tseslint.configs.strictTypeChecked, ...tseslint.configs.stylisticTypeChecked],
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // 1. Настройка @typescript-eslint/naming-convention
      '@typescript-eslint/naming-convention': [
        'error',
        // Все переменные, функции и параметры функций должны быть в camelCase или PascalCase (для компонентов React)
        {
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow',
          selector: 'variableLike',
        },
        // Булевы переменные должны иметь префиксы is, has, should, can, did, was
        {
          format: ['camelCase', 'PascalCase'],
          prefix: ['is', 'has', 'should', 'can', 'did', 'was'],
          selector: 'variable',
          types: ['boolean'],
        },
        // Классы, Интерфейсы, Типы и Enums должны быть в PascalCase
        {
          format: ['PascalCase'],
          selector: 'typeLike',
        },
        // Интерфейсы НЕ должны начинаться с буквы "I"
        {
          custom: {
            match: false,
            regex: '^I[A-Z]',
          },
          format: ['PascalCase'],
          selector: 'interface',
        },
        // Константы на уровне модуля могут быть в UPPER_CASE
        {
          format: ['camelCase', 'UPPER_CASE'],
          modifiers: ['const', 'global'],
          selector: 'variable',
        },
        // ИГНОРИРОВАТЬ свойства в кавычках (для работы со сторонними API / snake_case)
        {
          format: null,
          modifiers: ['requiresQuotes'],
          selector: [
            'classProperty',
            'objectLiteralProperty',
            'typeProperty',
            'classMethod',
            'objectLiteralMethod',
            'typeMethod',
          ],
        },
      ],
      // 5. Запрет на пустые интерфейсы и конструкции
      '@typescript-eslint/no-empty-object-type': 'error',
      // 7. Другие строгие правила типизации
      '@typescript-eslint/no-explicit-any': 'error',
      // 3. Запрет на использование non-null assertion (оператор !)
      '@typescript-eslint/no-non-null-assertion': 'error',
      // 2. Полный запрет на использование типов-заглушек
      '@typescript-eslint/no-restricted-types': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unnecessary-type-arguments': 'error',
      // 4. Контроль безопасного каста типов
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      // 8. Запрет использования React.FC в пользу нативной типизации
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      // 6. Строгое перечисление в switch (Exhaustive Check)
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
    },
  }),
  {
    plugins: {
      'check-file': checkFile,
    },
    rules: {
      // ------------------------------------------------------------
      // 1. ПРАВИЛА ДЛЯ ФАЙЛОВ
      // ------------------------------------------------------------
      'check-file/filename-naming-convention': [
        'error',
        {
          // Все остальные файлы проекта (.ts, .tsx, .js) по умолчанию в camelCase
          // (хуки, утилиты, сервисы, типы)
          'src/!(components)/**/*.{ts,js}': 'CAMEL_CASE',
        },
        {
          // Игнорируем системные файлы Next.js в папке app (page.tsx, layout.tsx, и т.д.)
          // Они всегда пишутся маленькими буквами.
          ignoreMiddleExtensions: false,
        },
      ],

      // ------------------------------------------------------------
      // 2. ПРАВИЛА ДЛЯ ПАПОК
      // ------------------------------------------------------------
      'check-file/folder-naming-convention': [
        'error',
        {
          // Все остальные папки в проекте (кроме app) должны быть в kebab-case
          'src/!(components|app)/**/': 'KEBAB_CASE',

          // Специальное регулярное выражение для папки src/app (Next.js App Router).
          'src/app/**/': 'NEXT_JS_APP_ROUTER_CASE',

          // Внутри папки components все подпапки (кроме ui) должны быть строго в PascalCase
          'src/components/!(ui)/**/': 'PASCAL_CASE',
        },
      ],
    },
  },
  {
    plugins: {
      '@stylistic': stylistic,
      perfectionist: perfectionist,
      react: reactPlugin,
    },
    rules: {
      // ------------------------------------------------------------
      // 2. ОТСТУПЫ МЕЖДУ JSX / HTML ЭЛЕМЕНТАМИ И ТЕГАМИ
      // ------------------------------------------------------------
      // Требует разделять многострочные JSX-теги пустой строкой, чтобы верстка в React-компонентах не сливалась
      '@stylistic/jsx-newline': [
        'error',
        {
          allowMultilines: true,
          prevent: true,
        },
      ],

      // ------------------------------------------------------------
      // 1. ОТСТУПЫ МЕЖДУ ПЕРЕМЕННЫМИ, ФУНКЦИЯМИ И КЛАССАМИ (TS/JS)
      // ------------------------------------------------------------
      '@stylistic/padding-line-between-statements': [
        'error',
        // Обязательная пустая строка ПЕРЕД каждым return
        { blankLine: 'always', next: 'return', prev: '*' },

        // Обязательная пустая строка ПОСЛЕ блока импортов
        { blankLine: 'always', next: '*', prev: 'import' },
        { blankLine: 'any', next: 'import', prev: 'import' }, // между самими импортами строки не нужны

        // Обязательная пустая строка МЕЖДУ функциями, классами и интерфейсами
        { blankLine: 'always', next: ['function', 'class', 'interface', 'type'], prev: '*' },
        { blankLine: 'always', next: '*', prev: ['function', 'class', 'interface', 'type'] },

        // Отделяем группы переменных (const/let) от остального кода
        { blankLine: 'always', next: '*', prev: ['const', 'let'] },
        { blankLine: 'any', next: ['const', 'let'], prev: ['const', 'let'] }, // внутри группы переменных пустые строки не обязательны

        // Обязательная пустая строка перед циклами и условиями (if, for, switch, try)
        { blankLine: 'always', next: ['if', 'for', 'switch', 'try', 'while'], prev: '*' },
        { blankLine: 'always', next: '*', prev: ['if', 'for', 'switch', 'try', 'while'] },
      ],

      // ------------------------------------------------------------
      // 3. СОРТИРОВКА ИМПОРТОВ, ПРОПСОВ И ОБЪЕКТОВ (PERFECTIONIST)
      // ------------------------------------------------------------
      'perfectionist/sort-imports': [
        'error',
        {
          customGroups: [
            {
              elementNamePattern: '^@/api(/.*)?$',
              groupName: 'internal-api',
            },
            {
              elementNamePattern: '^@/services(/.*)?$',
              groupName: 'internal-services',
            },
            {
              elementNamePattern: '^@/hooks(/.*)?$',
              groupName: 'internal-hooks',
            },
            {
              elementNamePattern: '^@/components(/.*)?$',
              groupName: 'internal-components',
            },
            {
              elementNamePattern: '^@/types(/.*)?$',
              groupName: 'internal-types',
            },
          ],
          groups: [
            'side-effect',
            'builtin',
            'external',
            'internal-api',
            'internal-services',
            'internal-hooks',
            'internal-components',
            'internal-types',
            ['parent', 'sibling', 'index'],
            'unknown',
          ],
          ignoreCase: true,
          newlinesBetween: 1,
          order: 'asc',
          type: 'alphabetical',
        },
      ],
      'perfectionist/sort-jsx-props': [
        'error',
        {
          customGroups: [
            {
              elementNamePattern: '^on[A-Z]',
              groupName: 'callback',
            },
          ],
          groups: ['multiline-prop', 'shorthand-prop', 'unknown', 'callback'],
          ignoreCase: true,
          order: 'asc',
          type: 'alphabetical',
        },
      ],
      'perfectionist/sort-objects': [
        'error',
        {
          order: 'asc',
          type: 'alphabetical',
        },
      ],
      // Запрет инлайновых стрелочных компонентов (повышает читаемость в DevTools)
      'react/display-name': 'error',
      // ------------------------------------------------------------
      // 4. СТАНДАРТЫ И БЕЗОПАСНОСТЬ JSX И КОМПОНЕНТОВ (REACT)
      // ------------------------------------------------------------
      // Стандарт объявления: именованные функции для обычных компонентов, стрелочные для коллбэков
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'arrow-function',
        },
      ],
      // Запрет создания компонентов внутри других компонентов (защита от утечек и перерисовок)
      'react/no-unstable-nested-components': ['error', { allowAsProps: false }],
      // Требование самозакрывающихся тегов для пустых компонентов
      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
    },
  },
  eslintConfigPrettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
