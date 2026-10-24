import { getOpenRouterKeys } from "@/lib/openrouter";
import { hasCloudflareText } from "@/lib/cloudflare-text";

export function GET() {
  const openRouterKeys = getOpenRouterKeys();
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
      storage: "local_books_7_days",
      narrationConfigured: Boolean(process.env.ELEVENLABS_API_KEY),
      imagesConfigured: Boolean(
        process.env.CLOUDFLARE_API_TOKEN && process.env.CLOUDFLARE_ACCOUNT_ID,
      ),
      providerAvailability: "not_checked",
      textProviders: {
        gatewayConfigured: authMode !== "not_configured",
        openRouterConfigured: openRouterKeys.length > 0,
        cloudflareConfigured: hasCloudflareText(),
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
