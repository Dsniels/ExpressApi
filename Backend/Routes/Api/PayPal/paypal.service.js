require("dotenv").configDotenv();
const { application } = require("express");
const fetch = require("node-fetch");
const Direccion = require("../Direccion/direccion.model");

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const baseurl = "https://api-m.sandbox.paypal.com";

const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
      throw new Error("No se encontraron credenciales");
    }
    const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_SECRET).toString(
      "base64",
    );

    const response = await fetch(`${baseurl}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    const data = await response.json();

    console.log(data);
    return data.access_token;
  } catch (error) {
    console.log(error);
  }
};
async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

exports.createOrden = async (cart) => {
  console.log("🚀 ~ exports.createOrden= ~ cart:", cart);

  const token = await generateAccessToken();
  const url = `${baseurl}/v2/checkout/orders`;

  const { Total, items, direccion } = cart;

  const adressUser = await Direccion.findById(direccion);

  const item_total = items.reduce((total, item) => {
    return total + parseFloat(item.unit_amount.value) * parseInt(item.quantity);
  }, 0);

  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        items,
        amount: {
          currency_code: "MXN",
          value: item_total,
          breakdown: {
            item_total: {
              currency_code: "MXN",
              value: item_total,
            },
          },
        },
      },
    ],
    application_context: {
      return_url: "https://expressapiecommerce.azurewebsites.net/api/productos",
      cancel_url: "https://expressapiecommerce.azurewebsites.net/api/",
    },
  };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  console.log("data", data);
  return data;
};
exports.captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `${baseurl}/v2/checkout/orders/${orderID}/capture`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("🚀 ~ exports.captureOrder= ~ captureOrder:", response);

    // Ensure we wait for the JSON response
    const jsonResponse = await response.json();

    // Return the entire response object
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (error) {
    console.error("Failed to capture order:", error);
    throw error;
  }
};
