# FinLearn Client

This folder contains all the code regarding the client

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Folder Structure](#folder-structure)
  - [Styles](styles)
- [NPM Scripts](#npm-scripts)

## Folder Structure

### Styles

The Styles Folder is based of an SCSS Folder Pattern
called [7-1](https://sass-guidelin.es/#the-7-1-pattern)
which consists of the following

| Folder/File   | Description                                                                                                                                                                                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `abstracts/`  | Contains [variables](https://sass-lang.com/documentation/variables), [functions](https://sass-lang.com/documentation/at-rules/function), [mixins](https://sass-lang.com/documentation/at-rules/mixin), and [placeholders](https://sass-lang.com/documentation/style-rules/placeholder-selectors). |
| `base/`       | Contains bolierplate code related to typography, and others.                                                                                                                                                                                                                                      |
| `components/` | Contains styles about specific components used across the site.                                                                                                                                                                                                                                   |
| `layout/`     | Contains styles related to the layout of content like footer, navbar and others.                                                                                                                                                                                                                  |
| `pages/`      | Contains styles related to each page.                                                                                                                                                                                                                                                             |
| `main.scss`   | This file brings together all of code through `@import`.                                                                                                                                                                                                                                          |

## NPM Scripts

These are all the commands that can be run

- `npm run dev`: Compile and Start the Client
- `npm run build`: Compile the Code
- `npm run lint`: Runs ESLint on Code
- `npm run lint:fix`: Runs ESLint and makes fixes
