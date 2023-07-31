# CI/CD Documentation

## Configuration

### General

- Updated shared packages to latest version
- `docker-compose.yml`
  - This file used to define the configuration for `docker compose` command.
  - It is used to build, deploy, and push images from a local machine.

### Client

- Updated client packages to latest versions.
- Installed a packaged called `sharp` for Next.js Image Optimization during build.
- Fixed certain type errors when running `npm run build`.
- Created `.dockerignore`.
- `middleware.ts`
  - To ensure that an unauthenticated user would not be able to access private routes, a custom `afterAuth` function was implemented to redirect them to the `/sign-in` page.
- `next.config.js`
  - We disabled the linting action that runs by-default when Next.js creates a build, this should be run in a separate job for it to be effective.
  - The build output for Next.js is set to use _standalone_ mode, since this includes all the necessary files/dependencies thus creating a smaller Docker Image.
- `Dockerfile`
  - We make use of Multistage Builds to reduce the overall size of the Docker Image, for more information on the implementation please check the respective Dockerfile. It eliminates unwanted layers, and copies over only the required files for the image to deploy.
  - This build requires an argument called `SEVER_URL` which will be used by the script below.
  - `replaceURL.sh`
    - This file is only used inside of this Dockerfile
    - The purpose of this script is to identify all `*.tsx` files in the client folder and replace each instance of `${process.env.NEXT_PUBLIC_API_URL}` with the provided argument `SEVER_URL`.
    - We tried other methods like multiple `.env` files for local and production environments, specific Next.js changes in the `next.config.js` but none worked when the image was deployed.
- `service.yaml`
  - This file contains all the configuration required to deploy a Google Cloud Run Service.
  - For more information, here is the [YAML Reference](https://cloud.google.com/run/docs/reference/yaml/v1).

### Server

- Updated server packages to latest version.
- Fixed certain type errors when running `npm run build`.
- Created `.dockerignore`.
- `Dockerfile`
  - We make use of Multistage Builds to reduce the overall size of the Docker Image, for more information on the implementation please check the respective Dockerfile. It eliminates unwanted layers, and copies over only the required files for the image to deploy.
- `service.yaml`
  - This file contains all the configuration required to deploy a Google Cloud Run Service.
  - For more information, please refer the [YAML Reference](https://cloud.google.com/run/docs/reference/yaml/v1).
- Created a Jest Test Runner to be used to verify code changes before a build is initiated.

### DockerHub

- Created two public repositories to store images for the client and server builds.
- Tag Management
  - `latest`: Refers to the latest build pushed from from a GitHub Action Run.
  - `v{MAJOR.MINOR.PATCH}`: Refers to a new build based on Semver being pushed from a local machine.

### Google Cloud Platform

- Google Secrets Manager
  - Provides a centralized storage and access to sensitive data that is stored in `.env` files.
  - It acts like a Key-Value store for each field inside the `.env` file.
  - It provides versioning to keep track of changes to the values, automatic replication to maintain consistency, and logging to keep track of usage.
- Google Cloud Run
  - Provides a service to deploy containerized applications that can automatically scale according to traffic.
- Service Accounts
  - Used to manage access to resources on the Google Cloud.
  - They are used to create, read, update, and delete a specific service that it can access.

### GitHub Secrets

- `GP1_SERVER_URL`: Production URL of the Server
- `GP1_ALPHAVANTAGE_API_KEY`: API Key used for authentication with Alpha Vantage
- `GP1_MONGO_URI`: API Key used for authentication with MongoDB Atlas Database
- DockerHub
  - `GP1_DOCKERHUB_USERNAME`: DockerHub Username
  - `GP1_DOCKER_TOKEN`: DockerHub Personal Access Token
- Google Cloud Platform
  - `GP1_GCP_REGION`: Specific geographical location to host the instance
  - `GP1_GCP_SA_EMAIL`: GCP Service Account Email
  - `GP1_GCP_SA_KEY`: GCP service Account Credentials
- Postman
  - `GP1_POSTMAN_KEY`: Postman API Key

---

## Workflow Summary

1. Developer makes changes to the code and pushes to `group-1` branch
2. Github Action is triggered on push to `group-1` branch
   1. Run Pre-Build Tests (Only for Server)
   2. Build & Push Images to DockerHub
   3. Deploy Server on Google Cloud
   4. Deploy Client on Google Cloud
   5. Run Deployment Tests
3. Publish Artifacts.

### Pre Build Tests

When a change is pushed to GitHub, a GitHub Action for is triggered to run test cases to ensure functionality. Currently this is only for the server instance.

- Steps:

  1. Checkout the latest changes based on the `HEAD_REF`.
  2. Setup a `Node.js 18` Environment.
  3. Install all packages via npm.
  4. Create `.env` file using the values stored on Github Secrets.
  5. Run the Jest Test Runner.
  6. Collect and Publish the Coverage Report as an Artifacts.

### Building & Pushing Images

When a change is pushed to GitHub, a GitHub Action for building the new docker images is triggered. The new client and server images are then pushed to the DockerHub registry on a successful build.

- Steps:

  1. Setup a `Node.js v18` Environment.
  2. Checkout the latest changes based on the `HEAD_REF`.
  3. Login into DockerHub using the Username and Personal Access Token stored in GitHub Secrets.
  4. Build the respective Docker Images in the `client` & `server` context.
     - For Client Build it requires a specific argument called `SERVER_URL` which is passed to it via the value stored in GitHub Secrets.
  5. Tag the respective Docker Images as `awhooogha/{client|server}:latest`
  6. Push to the Images to DockerHub.

### Deploying to Google Cloud

After a successful push to DockerHub, instances of client and server are built using Google Cloud Run.

- Steps:

  1. Checkout the latest changes based on the `HEAD_REF`.
  2. Login into Google Cloud Platform as the Service Account using the credentials stored in GitHub Secrets.
  3. Send Request to GCP to create a new revision of the current service
     based on the respective `service.yaml` file and region to be deployed which is stored in GitHub Secrets.
  4. (Only for Server Deployment) Send a Request to `/status`

### Run Deployment Tests

After a successful deployment to GCP, a series of automated tests will run to ensure functionality and performance. Currently this is only for the server instance.

- Steps:

  1. Checkout the latest changes based on the `HEAD_REF`.
  2. Create a new Directory inside the `server` folder.
  3. Setup a `Node.js 18` Environment.
  4. Install `newman` `newman-reporter-htmlextra` via npm.
  5. Run the test cases stored in the [FinLearn Workspace](https://www.postman.com/cscc01-finlearn/workspace/finlearn/overview) on Postman using `newman` and pass the Postman API Key from GitHub Secrets.
  6. Collect and Publish the Reports as Artifacts.

## Try it out

To acess the deployed services, use the links below. The initial startup will be slow since Google Cloud Run will provision a machine based on requests. So, if there has been no requests it will remove all active instances.

- Client URL: <https://client-w3vto4v6qa-uc.a.run.app>
- Server URL: <https://server-w3vto4v6qa-uc.a.run.app/>
- DockerHub Repositories:
  - [Client Image](https://hub.docker.com/r/awhooogha/client)
  - [Server Image](https://hub.docker.com/r/awhooogha/server)
