import { http, HttpResponse } from "msw";

interface LoginRequestBody {
  email: string;
  password: string;
}

export const handlers = [
  http.post("/api/login", async ({ request }) => {
    const { email, password } = (await request.json()) as LoginRequestBody;

    if (email === "test@example.com" && password === "Password123") {
      return HttpResponse.json({ token: "fake-token", user: { id: 1, email } });
    }

    return new HttpResponse(
      JSON.stringify({ message: "Invalid credentials" }),
      { status: 401 }
    );
  }),
];
