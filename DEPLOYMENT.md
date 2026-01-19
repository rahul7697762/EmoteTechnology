# Deployment Guide for Render

This guide outlines the steps to deploy the **EmoteTechnology** application to Render.

## Prerequisites
- Your code is pushed to your GitHub repository: `https://github.com/rahul7697762/EmoteTechnology`
- You have a [Render account](https://render.com/).

## Step-by-Step Deployment

1.  **Log in to Render** and go to your **Dashboard**.
2.  Click the **"New +"** button and select **"Web Service"**.
3.  **Connect your Repository**:
    - Find `EmoteTechnology` in the list of repositories.
    - Click **"Connect"**.

4.  **Configure the Service**:
    Use the following settings:

    | Setting | Value |
    | :--- | :--- |
    | **Name** | `emotetechnology` (or your preferred name) |
    | **Region** | Choose the one closest to you (e.g., Singapore, Frankfurt, Oregon) |
    | **Branch** | `main` |
    | **Root Directory** | `. ` (Leave empty or set to root) |
    | **Runtime** | **Node** |
    | **Build Command** | `npm run build` |
    | **Start Command** | `npm start` |

    > **Note:** The `npm run build` command is configured in the root `package.json` to install dependencies for both `client` and `server`, and then build the React client. The `npm start` command launches the Node.js backend which serves the built frontend.

5.  **Environment Variables**:
    Scroll down to the "Environment Variables" section and add the following keys if they are not already set by default:

    | Key | Value |
    | :--- | :--- |
    | `NODE_VERSION` | `18.17.0` (or greater) |

    *If you have other secrets (like database URLs or API keys), add them here as well.*

6.  **Deploy**:
    - Select the **"Free"** plan (or upgrade if needed).
    - Click **"Create Web Service"**.

## Verification
Render will start the deployment process. You can view the logs in the dashboard.
- It will first run the build command (`npm run build`), showing logs for `npm install` and the Vite build.
- Once the build finishes, it will start the service (`npm start`).
- You should see `Server is running on port ...` in the logs.
- Click the URL provided by Render (e.g., `https://emotetechnology.onrender.com`) to view your live application.

## Troubleshooting
- **Build Fails?** Check the logs. If it says "command not found", ensure `NODE_VERSION` is set to 18 or higher.
- **Page Not Found?** Ensure the `server/server.js` file is correctly serving the `client/dist` directory. We have already configured this.
