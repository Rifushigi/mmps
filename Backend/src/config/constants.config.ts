import dotenv from "dotenv";

dotenv.config();


const PORT: string = process.env.PORT || "3000";
const passphrase = process.env.PASSPHRASE;
const localUrl = process.env.MONGO_LOCAL_URL;
const webUrl = process.env.MONGO_PRODUCTION_URL;
const env = process.env.ENV;
const privateKey = process.env.PRIVATE_KEY;
const publicKey = process.env.PUBLIC_KEY;

export {
    PORT,
    passphrase,
    localUrl,
    webUrl,
    env,
    privateKey,
    publicKey,
};
