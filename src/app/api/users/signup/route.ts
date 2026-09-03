import { connectToDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

connectToDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const { username, email, password } = reqBody;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Please fill all the fields" },
        { status: 400 },
      );
    }

    // check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    return NextResponse.json(
      {
        message: "User created successfully",
        success: true,
        user: savedUser,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
