const GATEWAY_URL = "https://secure-gateway.pathurisai31.workers.dev/run";
const PROJECT_KEY = "pk_live_OJZmME05DdGfD9xz2AO62duv";

export async function gatewayRequest(
  body,
  session = null,
  options = {}
) {
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
    redirect: "manual", 
  });

  // OAuth / non-JSON flow
  if (options.raw) {
    return {
      status: res.status,
      url: res.headers.get("Location"),
      headers: res.headers,
    };
  }

  if (options.blob) {
    return await res.blob();
  }

  // Normal JSON flow (unchanged)
  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(text);
  }
}

const GATEWAY_URL = "https://secure-gateway.pathurisai31.workers.dev/run";
const PROJECT_KEY = "pk_live_OJZmME05DdGfD9xz2AO62duv";

export async function gatewayRequest(
  body,
  session = null,
  options = {}
) {
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
    redirect: "manual", // 👈 IMPORTANT for OAuth
  });

  // OAuth / non-JSON flow
  if (options.raw) {
    return {
      status: res.status,
      url: res.headers.get("Location"),
      headers: res.headers,
    };
  }

  if (options.blob) {
    return await res.blob();
  }

  // Normal JSON flow (unchanged)
  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(text);
  }
}
