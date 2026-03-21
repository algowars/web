import { spawn } from 'child_process';
import { defineConfig } from 'cypress';
import 'dotenv/config';

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL ?? "http://localhost:3000",
    setupNodeEvents(on, config) {
       const connString = process.env.TEST_DB_CONN || config.env.TEST_DB_CONN

      on('task', {
        async 'db:truncate'({ projectPath, args = [], env = {} }) {
            return new Promise((resolve, reject) => {
              const runArgs = ['run', env.DB_CONNECTION_STRING, '--project', projectPath, '--truncate'];

              const child = spawn('dotnet', runArgs, {
                stdio: 'inherit',
                env: { ...process.env, ...env }
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
            }
        },

        async 'db:seed'({ projectPath, args = [], env = {} }) {
            return new Promise((resolve, reject) => {
              const runArgs = ['run', env.DB_CONNECTION_STRING, '--project', projectPath, '--configuration', 'Release', '--', ...args];

              const child = spawn('dotnet', runArgs, {
                stdio: 'inherit',
                env: { ...process.env, ...env }
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
            }
        },
      })

      return config
    },
  },

  env: {
    AUTH0_EMAIL: process.env.AUTH0_EMAIL,
    AUTH0_PASSWORD: process.env.AUTH0_PASSWORD,
  },
  expose: {
    auth0_domain: process.env.AUTH0_DOMAIN,
    auth0_audience: process.env.AUTH0_AUDIENCE,
    auth0_scope: "",
    auth0_client_id: process.env.AUTH0_CLIENT_ID,
  },
})