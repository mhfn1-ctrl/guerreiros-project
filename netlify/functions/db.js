// Studio 24 - Netlify Function: Database API
const { getStore } = require("@netlify/blobs");

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

const KEYS = ["s24_inv","s24_sales","s24_cust","s24_exp","s24_products","s24_orders"];

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS, body: "" };

  try {
    const store = getStore({
      name: "studio24",
      consistency: "strong",
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.BLOB_TOKEN,
    });

    const { httpMethod, queryStringParameters, body } = event;
    const key = queryStringParameters?.key;

    if (httpMethod === "GET") {
      if (!key || !KEYS.includes(key))
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Chave inválida" }) };
      const value = await store.get(key);
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ key, value: value ? JSON.parse(value) : null }) };
    }

    if (httpMethod === "POST") {
      const { key: pKey, value } = JSON.parse(body || "{}");
      if (!pKey || !KEYS.includes(pKey))
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Chave inválida" }) };
      await store.set(pKey, JSON.stringify(value));
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: "Método não permitido" }) };
  } catch (err) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};
