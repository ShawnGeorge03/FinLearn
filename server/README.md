# FinLearn Server

This folder contains all the code regarding the server

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Folder Structure](#folder-structure)
- [NPM Scripts](#npm-scripts)

## Folder Structure

This Folder Structure is based on a blog from [LogRocket](https://blog.logrocket.com/organizing-express-js-project-structure-better-productivity/).

The main entry point of the server is the [`server.ts`](https://github.com/CSCC012023/final-project-s23-agile-avengers/blob/main/server/src/server.ts) which is inside the [`src`](https://github.com/CSCC012023/final-project-s23-agile-avengers/blob/main/server/src) folder and can be run by using this command `npm run dev`. All routes and middleware will be included in this folder.

| Folder        | Description                                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `configs`     | Allows connection to MongoDB Atlas.                                                                                             |
| `controllers` | Contains all the Controller functions to process requests with the database and if required send a JSON response to the Client. |
| `mock`        | Contains all the Mock Data JSON for Database.                                                                                   |
| `middlewares` | Contains any code for any middleware like authentication and logging.                                                           |
| `models`      | Contains all the MongoDB Schema that will be need for the database.                                                             |
| `routes`      | Contains all the supported endpoints for each router used.                                                                      |
| `services`    | Contains complex business logic.                                                                                                |
| `types`       | Contains all types information.                                                                                                 |
| `utils`       | Contains any helper functions to reduce code duplication.                                                                       |

## NPM Scripts

These are all the commands that can be run

- `npm run dev`: Compile and Start the Server
- `npm run build`: Compile the Code
- `npm run lint`: Runs ESLint on Code
- `npm run lint:fix`: Runs ESLint and makes fixes
- `npm run seed <model>`: Seeds the Database with Mock Data for a specific model (`learning`, `trading`)
