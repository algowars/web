import { defineConfig } from "cypress";
import "dotenv/config";

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL ?? "http://localhost:3000",
    setupNodeEvents(on, config) {
      return config;
    },
  },

  expose: {
    auth0_domain: process.env.AUTH0_DOMAIN,
    auth0_audience: process.env.AUTH0_AUDIENCE,
    auth0_scope: "",
    auth0_client_id: process.env.AUTH0_CLIENT_ID,
  },
});
