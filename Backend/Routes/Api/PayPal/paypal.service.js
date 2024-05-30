require('dotenv').configDotenv()
const fetch = require('node-fetch');


const {PAYPAL_CLIENT_ID ,PAYPAL_SECRET} = process.env;

const generateAccessToken = async () => {
    try {
        if(!PAYPAL_CLIENT_ID && !PAYPAL_SECRET){
            throw new Error('No se encontraron credenciales');
        }
        const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_SECRET)
                            .toString('base64');

        const response = fetch(`${baseurl}/v1/oauth2/token`,{
            method : 'POST',
            body : 'grant_type=client_credentials',
            headers:{
                Authorization : `Basic ${auth}` ,
            },
        });

        const data = await response.json();
        return data.access_token;

    } catch (error) {
        console.log(error);
    }
}

const createOrden = async (cart) =>{

    const token = generateAccessToken();
    const url = `${baseurl}/v2/checkout/orders`;


    const payload = {
        intent : 'CAPTURE',
        purchase_units : [
            {
                amount : {
                    currency_code : 'USD',
                    value : '10',
                }
            }
        ]
    }

    const response = fetch(url, {
        headers : {
            'Content-Type': "application/json",
            Authorization : `Bearer ${token}`,
        },
        method : 'POST',
        body : JSON.stringify(payload)
    });

    return await response.json();

    
}


