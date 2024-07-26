//I am using the following code snippet to generate the jwt secret
import crypto from 'crypto'

const secret = crypto.randomBytes(64).toString('hex');
console.log(secret);

//62bdc00bab08d8f9844ae958aa2cd384c52ddf45332f740fa772d0c24aa8825a5a8dd41040a5aadc769229a22187b3a6849f0f18b3a86d848064dcf37a283b18