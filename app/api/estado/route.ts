export function GET() {
  return Response.json(
    {
      status: "ok",
      version: "0.1.0",
      tutor:
        process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN
          ? "configured"
          : "prepared",
      storage: "none",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
