import { spawn } from 'child_process';
import { defineConfig } from 'cypress';
import 'dotenv/config';

export default defineConfig({
  allowCypressEnv: true,

  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL ?? "http://localhost:3000",
    setupNodeEvents(on, config) {
      on('task', {
        async 'db:truncate'() {
            return new Promise((resolve, reject) => {
              const projectPath = config.env.DB_PROJECT_PATH;
              const dbConnectionString = config.env.DB_CONNECTION_STRING;
              if (!projectPath || !dbConnectionString) {
                reject({ message: 'Missing DB_PROJECT_PATH or DB_CONNECTION_STRING in environment variables.' });
                return;
              }
              const runArgs = ['run', '--connectionString', dbConnectionString, '--project', projectPath, '--truncate'];

              const child = spawn('dotnet', runArgs, {
                stdio: 'inherit',
                env: { ...process.env }
              });

              child.on('error', (err) => {
                reject({ message: 'Failed to start dotnet', error: err.message });
              });

              child.on('close', (code) => {
                if (code === 0) {
                  resolve({ ok: true });
                } else {
                  reject({ message: `DbUp exited with code ${code}`, code });
                }
              });
            });
        },

        async 'db:seed'() {
            return new Promise((resolve, reject) => {
              const projectPath = config.env.DB_PROJECT_PATH;
              const dbConnectionString = config.env.DB_CONNECTION_STRING;
              if (!projectPath || !dbConnectionString) {
                reject({ message: 'Missing DB_PROJECT_PATH or DB_CONNECTION_STRING in environment variables.' });
                return;
              }
              const runArgs = ['run', '--connectionString', dbConnectionString, '--project', projectPath, '--init', '--dev'];

              const child = spawn('dotnet', runArgs, {
                stdio: 'inherit',
                env: { ...process.env }
              });

              child.on('error', (err) => {
                reject({ message: 'Failed to start dotnet', error: err.message });
              });

              child.on('close', (code) => {
                if (code === 0) {
                  resolve({ ok: true });
                } else {
                  reject({ message: `DbUp exited with code ${code}`, code });
                }
              });
            });
        },
      })

      return config
    },
  },

  env: {
    TEST_USER_EMAIL: process.env.TEST_USER_EMAIL,
    TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD,
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
    DB_PROJECT_PATH: process.env.DB_PROJECT_PATH,
  },
  expose: {
    auth0_domain: process.env.AUTH0_DOMAIN,
    auth0_audience: process.env.AUTH0_AUDIENCE,
    auth0_scope: "",
    auth0_client_id: process.env.AUTH0_CLIENT_ID,
  },
})