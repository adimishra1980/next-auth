import { connectToDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { EmailType, sendEmail } from "@/helpers/mailers";

connectToDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;

    if (!email) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 },
      );
    }

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User with this email does not exist" },
        { status: 400 },
      );
    }

    // send mail for password reset
    await sendEmail({ email, emailType: EmailType.RESET, userId: user._id });

    return NextResponse.json({
      message: "Password reset link sent to your email",
      success: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Something went wrong while sending the mail" },
      { status: 500 },
    );
  }
}
