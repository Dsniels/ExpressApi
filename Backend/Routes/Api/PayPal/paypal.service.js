require('dotenv').configDotenv()
const { application } = require('express');
const fetch = require('node-fetch');
const Direccion = require('../Direccion/direccion.model')

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const baseurl = "https://api-m.sandbox.paypal.com";


const generateAccessToken = async () => {
    try {
        if(!PAYPAL_CLIENT_ID || !PAYPAL_SECRET){
            throw new Error('No se encontraron credenciales');
        }
        const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_SECRET).toString('base64');

        const response = await  fetch(`${baseurl}/v1/oauth2/token`,{
            method : 'POST',
            body : 'grant_type=client_credentials',
            headers:{
                Authorization : `Basic ${auth}` ,
            },
        });
        const data = await response.json();

        console.log(data);
        return data.access_token;
        
    } catch (error) {
        console.log(error);
    }
}
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

exports.createOrden = async (cart) =>{

    const token = await generateAccessToken();
    const url = `${baseurl}/v2/checkout/orders`;
    console.log(cart)

    const {Total, items, direccion} = cart;
    console.log(Total, items, direccion);

    const adressUser = await Direccion.findById(direccion);
    console.log(adressUser)
    let item_total = items.reduce((total, item) => {
    return total + (parseFloat(item.unit_amount.value) * parseInt(item.quantity));
    }, 0);

    const payload = {
        intent : 'CAPTURE',
        purchase_units : [
            {
                items : items,
                amount : {
                    currency_code : 'MXN',
                    value : item_total,
                    breakdown:{
                        item_total : {
                            currency_code : "MXN",
                            value : item_total
                        }
                    }

                }

            }
        ],
        application_context:{
            return_url: 'http://localhost:3000/api/productos',
            cancel_url : 'http://localhost:3000/api/'
        }
    }


    const response = await fetch(url, {
        headers : {
            'Content-Type': "application/json",
            'Authorization' : `Bearer ${token}`,
        },
        method : 'POST',
        body : JSON.stringify(payload)
    });

    const data = await response.json()
    console.log('data', data);
    return data;
   

    
}

exports.captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `${baseurl}/v2/checkout/orders/${orderID}/capture`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only).
      // Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
  }).then(response => {
        return response.json();
  })
 
};


