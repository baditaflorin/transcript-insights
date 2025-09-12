# Deploying Your Transcript Insights App

This guide provides instructions for deploying your Next.js application to your own server or hosting environment that supports Node.js or Docker.

## Option 1: Deploying with Node.js

### Prerequisites

Before you begin, ensure your server has the following installed:

-   **Node.js**: It's recommended to use version 18.x or later. You can check your version by running `node -v`.
-   **npm** (or another package manager like yarn or pnpm): npm is included with Node.js.

### Deployment Steps

Follow these steps on your server to get your application running in production.

#### 1. Clone Your Project

First, get your project code onto the server. You can do this by cloning your repository or by copying the files directly.

```bash
git clone <your-repository-url>
cd <your-project-directory>
```

#### 2. Set Up Environment Variables

You need to provide your AI API keys. Create a `.env.local` file in the root of your project:

```bash
touch .env.local
```

Then, add your keys to this file. **Do not commit this file to source control.**

```
# .env.local
GOOGLE_API_KEY=your_google_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

#### 3. Install Dependencies

Install all the necessary npm packages required for the project to run.

```bash
npm install
```

This command reads the `package.json` file and installs all the dependencies listed there.

#### 4. Build the Application

Next, you need to create an optimized production build of your Next.js application.

```bash
npm run build
```

This command compiles your application and creates a `.next` directory with the production-ready code.

#### 5. Run the Production Server

Finally, start the production server. This will serve your built application. By default, it runs on port 3000.

```bash
npm run start
```

Your application should now be running and accessible.

---

## Option 2: Deploying with Docker and Docker Compose

Using Docker is a great way to ensure a consistent environment.

### Prerequisites

-   **Docker**: Install Docker on your server.
-   **Docker Compose**: Install Docker Compose on your server.

### Deployment Steps

#### 1. Clone Your Project

Get your project code onto the server.

```bash
git clone <your-repository-url>
cd <your-project-directory>
```

#### 2. Set Up Environment Variables

Docker Compose will automatically load environment variables from a `.env` file in your project's root directory. The file already exists. Open it and add your API keys:

```
# .env
GOOGLE_API_KEY=your_google_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

#### 3. Build and Run the Container

Use Docker Compose to build the image and start the container in the background.

```bash
docker-compose up --build -d
```

-   `--build`: Forces a rebuild of the Docker image.
-   `-d`: Runs the container in detached mode (in the background).

Your application should now be running and accessible on port 3000.

### Managing the Container

-   **To see logs**: `docker-compose logs -f`
-   **To stop the container**: `docker-compose down`

This setup is ideal for production as it simplifies management and ensures your application runs in an isolated and consistent environment.
