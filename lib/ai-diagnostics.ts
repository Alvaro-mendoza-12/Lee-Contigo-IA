type GatewayFailureDetails = {
  name: string;
  statusCode?: number;
  generationId?: string;
  type?: string;
  isRetryable?: boolean;
};

/** Return only operational metadata; never include prompts or model responses. */
export function getGatewayFailureDetails(
  error: unknown,
): GatewayFailureDetails | undefined {
  let current: unknown = error;

  for (let depth = 0; depth < 4; depth += 1) {
    if (!current || typeof current !== "object") return undefined;

    const candidate = current as Record<string, unknown>;
    const name = candidate.name;
    if (typeof name === "string" && name.startsWith("Gateway")) {
      return {
        name,
        ...(typeof candidate.statusCode === "number"
          ? { statusCode: candidate.statusCode }
          : {}),
        ...(typeof candidate.generationId === "string"
          ? { generationId: candidate.generationId }
          : {}),
        ...(typeof candidate.type === "string" ? { type: candidate.type } : {}),
        ...(typeof candidate.isRetryable === "boolean"
          ? { isRetryable: candidate.isRetryable }
          : {}),
      };
    }

    current = candidate.cause;
  }

  return undefined;
}
