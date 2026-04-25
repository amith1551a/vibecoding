import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    // Generate a random 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Verify setup
    if (!process.env.GMAIL_ADDRESS) {
      return NextResponse.json({ success: false, error: 'Server missing GMAIL_ADDRESS in .env.local' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_ADDRESS, 
        pass: "jxpq hjzx smin llbq"
      }
    });

    const mailOptions = {
      from: `"MeetSync Verification" <${process.env.GMAIL_ADDRESS}>`,
      to: email,
      subject: 'Your MeetSync Verification Code',
      text: `Welcome to MeetSync! Your verification code is: ${otp}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #1f2937;">Verify your MeetSync Domain</h2>
          <p style="color: #4b5563;">Please enter the following 6-digit code to securely verify your business domain:</p>
          <div style="background: #f3f4f6; padding: 16px; margin: 24px 0; border-radius: 8px; text-align: center;">
             <h1 style="color: #4f46e5; letter-spacing: 5px; margin: 0; font-size: 32px;">${otp}</h1>
          </div>
          <p style="color: #9ca3af; font-size: 12px;">If you didn't request this email, you can safely ignore it.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    
    // We send the OTP back to the frontend so it can validate it locally for this prototype
    return NextResponse.json({ success: true, otp });
  } catch (error: any) {
    console.error("Email send error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
