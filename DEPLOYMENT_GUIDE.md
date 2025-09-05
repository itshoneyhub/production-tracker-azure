
# Azure Deployment Guide for Production Tracker App

This guide provides step-by-step instructions to deploy your full-stack application to Azure. This setup uses two Azure App Services (one for the backend and one for the frontend) and an Azure SQL Database.

## Prerequisites

- An Azure account with an active subscription.
- The Azure CLI installed on your local machine.
- Your application code pushed to a GitHub repository.

## Step 1: Create a Resource Group

A resource group is a container that holds related resources for an Azure solution.

1.  **Open the Azure portal:** [https://portal.azure.com](https://portal.azure.com)
2.  Click on **"Create a resource"**.
3.  Search for **"Resource group"** and click **"Create"**.
4.  **Subscription:** Choose your subscription.
5.  **Resource group:** Give it a name (e.g., `production-tracker-rg`).
6.  **Region:** Choose a region close to you.
7.  Click **"Review + create"** and then **"Create"**.

## Step 2: Create an Azure SQL Database

This will be your application's database.

1.  In the Azure portal, click **"Create a resource"**.
2.  Search for **"SQL Database"** and click **"Create"**.
3.  **Resource group:** Select the one you just created.
4.  **Database name:** Enter a name (e.g., `production-tracker-db`).
5.  **Server:** Click **"Create new"**.
    -   **Server name:** Enter a unique name (e.g., `production-tracker-sql-server`).
    -   **Server admin login:** Create a username.
    -   **Password:** Create a strong password.
    -   **Location:** Choose the same region as your resource group.
    -   Click **"OK"**.
6.  **Compute + storage:** For this project, you can start with the **Basic** service tier to save costs. Click **"Configure database"** to change this.
7.  **Networking:**
    -   Under **"Network connectivity"**, select **"Public endpoint"**.
    -   For firewall rules, select **"Allow Azure services and resources to access this server"**.
8.  Click **"Review + create"** and then **"Create"**.

## Step 3: Get the Database Connection String

1.  Once the database is deployed, go to the resource.
2.  In the left menu, click on **"Connection strings"**.
3.  Copy the **ADO.NET** connection string. It will look something like this:

    ```
    Server=tcp:your-server-name.database.windows.net,1433;Initial Catalog=your-db-name;Persist Security Info=False;User ID=your-username;Password={your_password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
    ```

    You will need this for the backend App Service configuration.

## Step 4: Create the Backend App Service

This will host your Node.js backend.

1.  In the Azure portal, click **"Create a resource"**.
2.  Search for **"Web App"** and click **"Create"**.
3.  **Resource group:** Select your resource group.
4.  **Name:** Give your backend app a unique name (e.g., `production-tracker-backend`). This will be part of the URL.
5.  **Publish:** Select **"Code"**.
6.  **Runtime stack:** Select **"Node 18 LTS"**.
7.  **Operating System:** Select **"Linux"**.
8.  **Region:** Choose the same region as your other resources.
9.  **App Service Plan:** A new one will be created by default. You can use the Free F1 plan for development/testing.
10. Click **"Review + create"** and then **"Create"**.

## Step 5: Configure the Backend App Service

1.  Go to the backend App Service you just created.
2.  **Configuration:**
    -   In the left menu, click on **"Configuration"**.
    -   Under **"Application settings"**, click **"+ New application setting"** for each of the following:
        -   `DB_SERVER`: Your SQL server name (e.g., `production-tracker-sql-server.database.windows.net`)
        -   `DB_DATABASE`: Your database name (e.g., `production-tracker-db`)
        -   `DB_USER`: Your SQL server admin login.
        -   `DB_PASSWORD`: Your SQL server password.
        -   `PORT`: `8000`
    -   Click **"Save"**.
3.  **Deployment Center:**
    -   In the left menu, click on **"Deployment Center"**.
    -   Select **"GitHub"** as the source.
    -   Authorize Azure to access your GitHub account.
    -   **Organization:** Your GitHub username or organization.
    -   **Repository:** Select your `production_tracker-Azure` repository.
    -   **Branch:** Select `main`.
    -   Azure will detect the `azure-app-service.yml` file. It will create a publish profile and save it as a secret in your GitHub repository named `AZURE_WEBAPP_PUBLISH_PROFILE_BACKEND`.

## Step 6: Create the Frontend App Service

This will host your static React frontend.

1.  Follow the same steps as creating the backend App Service, but with these differences:
    -   **Name:** Give it a unique name (e.g., `production-tracker-frontend`).
    -   **Runtime stack:** Select **".NET 6 (LTS)"** (or any other stack that supports static sites, but .NET is a common choice for this).

## Step 7: Configure the Frontend App Service

1.  Go to the frontend App Service.
2.  **Deployment Center:**
    -   Follow the same steps as you did for the backend to connect to your GitHub repository.
    -   This will create another publish profile secret in your GitHub repository, likely named `AZURE_WEBAPP_PUBLISH_PROFILE_FRONTEND`.
3.  **Configuration:**
    -   In the left menu, click on **"Configuration"**.
    -   Go to the **"General settings"** tab.
    -   **Startup Command:** Enter ` ` (a single space) to indicate that this is a static site.
    -   Click **"Save"**.

## Step 8: Update GitHub Actions Workflow and Secrets

1.  **Update Workflow File:**
    -   In your `.github/workflows/azure-app-service.yml` file, replace `your-backend-app-name` and `your-frontend-app-name` with the actual names of your App Services.
2.  **GitHub Secrets:**
    -   Go to your GitHub repository's **Settings > Secrets and variables > Actions**.
    -   You should see the publish profile secrets that Azure created. Ensure they are named `AZURE_WEBAPP_PUBLISH_PROFILE_BACKEND` and `AZURE_WEBAPP_PUBLISH_PROFILE_FRONTEND` to match the workflow file.

## Step 9: Run the Database Schema

1.  In the Azure portal, go to your SQL database.
2.  In the left menu, click on **"Query editor (preview)"**.
3.  Log in with your SQL server credentials.
4.  Copy the content of your `backend/sql_schema.sql` file and paste it into the query editor.
5.  Click **"Run"** to create the database tables.

## Step 10: Trigger the Deployment

A push to the `main` branch will now automatically trigger the GitHub Actions workflow, which will build and deploy your application.

Once the workflow is complete, your application will be live. You can access the frontend at `https://your-frontend-app-name.azurewebsites.net`.
