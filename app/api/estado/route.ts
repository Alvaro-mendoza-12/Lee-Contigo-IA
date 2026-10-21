export function GET() {
  return Response.json(
    {
      status: "ok",
      version: "0.1.0",
      tutor: process.env.AI_GATEWAY_API_KEY
        ? "gateway_key"
        : process.env.VERCEL === "1"
          ? "vercel_oidc"
          : "prepared",
      storage: "none",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
