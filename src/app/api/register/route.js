import connectDB from "@/lib/mongodb";
import Admin from "@/models/user";
import mongoose from "mongoose";
export const POST = async (req) => {
    try {
        await connectDB();
        const data = await req.json();
       
        if (!data) {
            return new Response("Please fill all fields", { status: 400 });
        }

        if (data.password !== data.confirm_password) {
            return new Response("Passwords do not match", { status: 400 });
        }

        const newUser = new Admin({
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            password: data.password,
            gender: data.gender,
            isAdmin: true
        });
        await newUser.save();

        return new Response(newUser, {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.log("Error registering user:", error);
        return new Response("Failed to register user", { status: 500 });
    } finally {
        await mongoose.connection.close();
    }   
};
