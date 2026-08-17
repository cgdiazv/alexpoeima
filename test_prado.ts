import { pradoClient } from "./lib/prado";

async function run() {
  const STORE_ID = process.env.NEXT_PUBLIC_PRADO_STORE_ID;
  const urls = [
    `/api/${STORE_ID}`,
    `/api/stores/${STORE_ID}`,
    `/api/store/${STORE_ID}`,
    `/api/stores`
  ];
  for (const url of urls) {
    try {
      const res = await pradoClient(url);
      console.log(`Success on ${url}:`, res);
    } catch (e: any) {
      console.log(`Failed on ${url}:`, e.message);
    }
  }
}

run();
