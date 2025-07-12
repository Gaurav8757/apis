import connectDB from "@/lib/mongodb";
import Admin from "@/models/user";
import mongoose from "mongoose";
import { sendEmail } from "../../../../utils/mailer";
import { hashPassword, validatePassword } from "../../../../utils/authPass";
import jwt from 'jsonwebtoken';

export const POST = async (req) => {

    try {
        await connectDB();
        const { origin } = new URL(req.url);
        const data = await req.json();

        // Validate the input data
        if (!data) {
            return new Response("Please fill all fields", { status: 400 });
        }
        // CHECK password and confirm password
        if (data.password !== data.confirm_password) {
            return new Response("Password not match with Confirm Password", { status: 400 });
        }
        // validate password
        const passwordError = validatePassword(data.password);
        if (passwordError) {
            return new Response(passwordError, { status: 400 });
        }

        // hash the password
        const newHashedPassword = await hashPassword(data.password);
        if (!newHashedPassword) {
            return new Response("Failed to hash password", { status: 500 });
        }

        const newUser = new Admin({
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            password: newHashedPassword,
            gender: data.gender,
            isUserType: data.isUserType,
        });

        // Send welcome email
        const emailContent = `
            <h1>Welcome to Our Platform, ${newUser.name + "-" + (newUser.isUserType === "admin" ? "Admin" : "User")}!</h1>
            <p>Thank you for registering. We are excited to have you on board.</p>
            <p>Your account details:</p>
            <p>Your Email/User ID: ${newUser.email}</p>
            <p>Mobile Number: ${newUser.mobile}</p>
            <p>Password: ${data.password}</p>
        `;

        const attachments = [
            {
                filename: "vercel.svg",
                path: "/apis/public/vercel.svg",
                cid: "vercel@nodemailer",
            },
        ];

        // Send email using the sendEmail function
        const mailResponse = await sendEmail(
            newUser.email,
            "Welcome to Our Platform",
            emailContent,
            "Welcome to Our Platform",
            attachments
        );
        // Check if the email was sent successfully
        if (!mailResponse) {
            return new Response("Failed to send welcome email", { status: 500 });
        } else {
            // Generate verification token if needed jwt
            const verificationToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            newUser.verificationToken = verificationToken;
            // saved user to the database
            await newUser.save();
            const responseData = {
                message: "Admin registered successfully",
                isWelcomeMailSent: `Welcome mail sent to admin: ${mailResponse.accepted[0]}`,
                name: newUser.name,
                email: newUser.email,
                mobile: newUser.mobile,
                isUserType: newUser.isUserType,
            };

            // Generate verification token if needed jwt
            await sendEmail(
                newUser.email,
                "Verify your email",
                `<p>Please click the link below to verify your Account</p>
               <p>Click on link or button to verify <br/> <a href="${origin}/verify/account?token=${verificationToken}">Verify Account</a></p>`
            );

            return new Response(JSON.stringify(responseData), {
                status: 201,
                headers: { "Content-Type": "application/json" },
            });
        }
    } catch (error) {
        return new Response("Failed to register user: " + error.message, {
            status: 500,
        });
    } finally {
        await mongoose.connection.close();
    }
};


// Login Admin
// how many ways can an admin log in?
// 1. Email and Password
// 2. Mobile and Password
// 3. Email and OTP
// 4. Mobile and OTP

// how many ways to secure an admin log in?
// 1. Password must be at least 8 characters long
// 2. Password must contain at least one uppercase letter
// 3. Password must contain at least one lowercase letter
// 4. Password must contain at least one number
// 5. Password must contain at least one special character
// 6. Use bcrypt to hash the password

// 7. Use JWT to authenticate the user
// 8. Use HTTPS to secure the connection
// 9. Use rate limiting to prevent brute force attacks
// 10. Use ip address blocking to prevent unauthorized access when logging in more than 5 times within 5 minutes
// 11. Use session management to track user sessions
// 12. Use two-factor authentication (2FA) for added security
// 13. Use secure cookies to store the session
// 14. Use CSRF tokens to prevent cross-site request forgery attacks
// 15. Use CORS to restrict access to the API
// 16. Use helmet to set security-related HTTP headers
// 17. Use logging and monitoring to detect and respond to security incidents
// 18. Use environment variables to store sensitive information
// 19. Use a secure password policy to enforce strong passwords

// 20. Use a secure password reset process
// 21. Use a secure account recovery process
// 22. Use a secure logout process