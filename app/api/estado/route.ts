export function GET() {
  const authMode = process.env.AI_GATEWAY_API_KEY
    ? "gateway_key"
    : process.env.VERCEL === "1"
      ? "vercel_oidc"
      : process.env.VERCEL_OIDC_TOKEN
        ? "vercel_oidc"
        : "not_configured";

  return Response.json(
    {
      status: "ok",
      version: "0.1.0",
      tutorAuth: authMode,
      tutorAvailability: "not_checked",
      storage: "none",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
