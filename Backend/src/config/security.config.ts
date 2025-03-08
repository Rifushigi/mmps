//Under development
export const refreshCookieConfig: object = {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000,
    secure: true,
    sameSite: "none",
};

export const corsOptions = {
    origin: ["http://localhost:5173", "http://127.0.0.1:3000", "*"],
    methods: ["POST, GET, PUT, PATCH, DELETE"],
    credentials: true,
    exposedHeaders: ["Authorization"]
}
