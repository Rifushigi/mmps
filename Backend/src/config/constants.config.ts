import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();


const PORT: string = process.env.PORT || "3000";
const passphrase = process.env.PASSPHRASE;
const localUrl = process.env.MONGO_LOCAL_URL;
const webUrl = process.env.MONGO_PRODUCTION_URL;
const env = process.env.ENV;
const privateKeyPath = process.env.PRIVATE_KEY_PATH;
const publicKeyPath = process.env.PUBLIC_KEY_PATH;
const privateKey = privateKeyPath ? fs.readFileSync(path.resolve(privateKeyPath), "utf8") : undefined;
const publicKey = publicKeyPath ? fs.readFileSync(path.resolve(publicKeyPath), "utf8") : undefined;

export {
    PORT,
    passphrase,
    localUrl,
    webUrl,
    env,
    privateKey,
    publicKey,
};
