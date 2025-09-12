# Deploying Your Transcript Insights App

This guide provides instructions for deploying your Next.js application to your own server or hosting environment that supports Node.js.

## Prerequisites

Before you begin, ensure your server has the following installed:

-   **Node.js**: It's recommended to use version 18.x or later. You can check your version by running `node -v`.
-   **npm** (or another package manager like yarn or pnpm): npm is included with Node.js.

## Deployment Steps

Follow these steps on your server to get your application running in production.

### 1. Clone Your Project

First, get your project code onto the server. You can do this by cloning your repository or by copying the files directly.

```bash
git clone <your-repository-url>
cd <your-project-directory>
```

### 2. Install Dependencies

Install all the necessary npm packages required for the project to run.

```bash
npm install
```

This command reads the `package.json` file and installs all the dependencies listed there into the `node_modules` directory.

### 3. Build the Application

Next, you need to create an optimized production build of your Next.js application.

```bash
npm run build
```

This command compiles your application and creates a `.next` directory with the production-ready code.

### 4. Run the Production Server

Finally, start the production server. This will serve your built application. By default, it runs on port 3000, but you can specify a different port.

```bash
npm run start
```

To run on a specific port (e.g., port 8080):

```bash
npm start -- -p 8080
```

Your application should now be running and accessible on your server.

## Managing the Application in Production

For long-term deployment, it's highly recommended to use a process manager like `pm2` to keep your application running continuously, even if it crashes or the server reboots.

### Using `pm2` (Recommended)

1.  **Install `pm2` globally:**
    ```bash
    npm install pm2 -g
    ```

2.  **Start your app with `pm2`:**
    ```bash
    pm2 start npm --name "transcript-insights" -- run start
    ```

This will start your application in the background and automatically restart it if it fails. You can manage your application using commands like `pm2 list`, `pm2 stop transcript-insights`, and `pm2 restart transcript-insights`.
