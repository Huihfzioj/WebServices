const GRAPHQL_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const GRAPHQL_ENDPOINT = `${GRAPHQL_BASE_URL}/graphql`;

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

export async function gqlFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  console.log("[GraphQL] Endpoint:", GRAPHQL_ENDPOINT);
  console.log("[GraphQL] Query:", query);
  
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("[GraphQL] HTTP Error:", response.status, text);
    throw new Error(`GraphQL HTTP ${response.status}: ${text}`);
  }

  const result = (await response.json()) as GraphQLResponse<T>;
  console.log("[GraphQL] Full Response:", JSON.stringify(result, null, 2));
  
  if (result.errors && result.errors.length > 0) {
    console.error("[GraphQL] Errors:", result.errors);
    throw new Error(result.errors.map((e) => e.message).join("; "));
  }

  if (!result.data) {
    console.error("[GraphQL] Response missing data");
    throw new Error("GraphQL response missing data");
  }

  return result.data;
}
