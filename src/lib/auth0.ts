import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  secret: process.env.AUTH0_SECRET,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  authorizationParameters: {
    redirect_uri: process.env.AUTH0_CALLBACK_URL,
    audience: process.env.AUTH0_AUDIENCE,
  },
});
