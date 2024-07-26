import axios from 'axios';
import jwt from 'jsonwebtoken';
import querystring from 'querystring';
import dotenv from 'dotenv';
import jose from 'node-jose'
dotenv.config();

const clientId = process.env.DAUTH_CLIENT_ID;
const clientSecret = process.env.DAUTH_CLIENT_SECRET;
const redirectUri = process.env.DAUTH_REDIRECT_URI; 

export const getAuthUrl = () => {
  const params = querystring.stringify({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'email openid profile user',
  });
  return `https://auth.delta.nitt.edu/authorize?${params}`;
};

export const getAccessToken = async (code) => {
  try {
    const response = await axios.post('https://auth.delta.nitt.edu/api/oauth/token', querystring.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    console.log('id_token',response.data.id_token, 'and   ','access_token',response.data.access_token); 
    return response.data;
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw new Error('Failed to fetch access token');
  }
};
 
export const getKey = async () => {
    try{
        const response = await axios.get("https://auth.delta.nitt.edu/api/oauth/oidc/key");
        console.log('response',response.data.key);
        return response.data.key[0];
    }
    catch(error){
        console.error("Error getting OIDC key", error.response ? error.response.data : error.message);
        throw new Error('Failed to get OIDC key');
    }
}

export const verifyToken = async (idToken) => {
    const key = await getKey();
    const keystore = jose.JWK.createKeyStore();
    await keystore.add(key);
    console.log(keystore);
    const publicKey = keystore.all({ use: 'sig' })[0].toPEM();
    console.log('jwk',publicKey);
    try {
      const decoded = jwt.verify(idToken, publicKey,{algorithms: ['RS256']});
      console.log('decoded token', decoded);
      return decoded;
    } catch (error) {
      console.error('Error verifying token:', error.message);
      throw new Error('Failed to verify token');
    }
};