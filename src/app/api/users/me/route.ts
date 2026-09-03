import { NextRequest, NextResponse } from "next/server";

import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import { connectToDB } from "@/dbConfig/dbConfig";
import { error } from "console";

connectToDB();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);

    const user = await User.findOne({
      _id: userId,
    }).select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "User found",
      success: true,
      data: user,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Something went wrong while getting the user" },
      { status: 500 },
    );
  }
}
