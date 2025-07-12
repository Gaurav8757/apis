import mongoose from "mongoose";
const AdminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        mobile: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        confirm_password: {
            type: String,
        },
        gender: {
            type: String,
            required: true
        },

        isUserType: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
        },
        
    },
    { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
export default Admin;