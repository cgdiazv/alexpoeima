// lib/prado.ts

const API_URL = process.env.NEXT_PUBLIC_PRADO_API_URL;
const STORE_ID = process.env.NEXT_PUBLIC_PRADO_STORE_ID;

/**
 * PUBLIC PRADO CLIENT
 * Safe for use in the browser, Server Components, and API Routes.
 * Uses the Publishable Key for safe operations like fetching products.
 */
export const pradoClient = async (endpoint: string, options: RequestInit = {}) => {
  const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_PRADO_PUBLISHABLE_KEY;

  if (!API_URL || !STORE_ID || !PUBLISHABLE_KEY) {
    throw new Error("Missing Prado Commerce public environment variables.");
  }

  const url = new URL(`${API_URL}${endpoint}`);
  url.searchParams.append('storeId', STORE_ID);

  const response = await fetch(url.toString(), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Store-ID': STORE_ID,
      'Authorization': `Bearer ${PUBLISHABLE_KEY}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(`Prado API Error: ${response.statusText} - ${JSON.stringify(errorData)}`);
  }

  return response.json();
};

/**
 * ADMIN PRADO CLIENT
 * STRICTLY for Server Components and API Routes.
 * Uses the Secret Key for privileged operations like creating orders.
 */
export const pradoAdmin = async (endpoint: string, options: RequestInit = {}) => {
  // Hard guard to prevent accidental client-side usage
  if (typeof window !== 'undefined') {
    throw new Error("CRITICAL: pradoAdmin cannot be invoked on the client side.");
  }

  const SECRET_KEY = process.env.PRADO_SECRET_KEY;

  if (!API_URL || !STORE_ID || !SECRET_KEY) {
    throw new Error("Missing Prado Commerce secret environment variables.");
  }

  const url = new URL(`${API_URL}${endpoint}`);
  url.searchParams.append('storeId', STORE_ID);

  const response = await fetch(url.toString(), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Store-ID': STORE_ID,
      'Authorization': `Bearer ${SECRET_KEY}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(`Prado Admin API Error: ${response.statusText} - ${JSON.stringify(errorData)}`);
  }

  return response.json();
};
