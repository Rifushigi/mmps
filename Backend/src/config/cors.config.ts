import { CorsOptions } from "cors";

export const corsOptions = {
    origin: ["http://localhost:5173", "http://127.0.0.1:3000", "*"],
    methods: ["POST, GET, PUT, PATCH, DELETE"],
    credentials: true,
    exposedHeaders: ["Authorization"]
}

