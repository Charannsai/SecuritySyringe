const GATEWAY_URL = "https://secure-gateway.pathurisai31.workers.dev/run";
const PROJECT_KEY = "pk_live_OJZmME05DdGfD9xz2AO62duv";

export async function gatewayRequest(body, session = null) {
  const headers = {
    "Content-Type": "application/json",
    "X-Project-Key": PROJECT_KEY,
  };

  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(text);
  }
}