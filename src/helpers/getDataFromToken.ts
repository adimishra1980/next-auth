import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
  username: string;
  email: string;
}

export const getDataFromToken = async (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value ?? "";
    const decodedToken = await jwt.verify(token, process.env.TOKEN_SECRET!);

    const { id } = decodedToken as DecodedToken;
    return id;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(
        error.message || "Something went wrong while decoding the token",
      );
    }

    throw new Error("Something went wrong while decoding the token")
  }
};
