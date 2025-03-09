import mongoose, { connect } from "mongoose";
import { localUrl, env, webUrl } from "./constants.config";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";

function selectDB() {
    if (env !== "production") {
        return { url: localUrl };
    }
    return { url: webUrl };
}

async function seedAdminUser() {
    const adminEmail = "admin@example.com";
    const adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
        const hash = await bcrypt.hash("adminpassword", 10);
        const newAdmin = new User({
            name: "Admin",
            email: adminEmail,
            hash,
            isAdmin: true,
        });
        await newAdmin.save();
        console.log("Default admin user created");
    } else {
        console.log("Admin user already exists");
    }
}

export const createDB = async (): Promise<void> => {
    try {
        mongoose.set("strictQuery", false);
        const { url } = selectDB();
        await connect(String(url));
        console.log(`Successfully connected to database`);

        // Seed the database with a default admin user
        await seedAdminUser();
    } catch (error: any) {
        throw new Error(error);
    }
};
