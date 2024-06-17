import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function POST(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 500 }
    );
  }

  const userId = user._id;

  const { acceptMessages } = await req.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status to accept messages",
        },
        { status: 500 }
      );
    } else {

      return Response.json(
        {
          success: true,
          message: "User status updated to accept messages",
          updatedUser,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user;
    if (!session || !user) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        { status: 500 }
      );
    }
    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);
    
        if (!foundUser) {
          return Response.json(
            {
              success: false,
              message: "Failed to find user",
            },
            { status: 500 }
          );
        } else {
          return Response.json(
            {
              success: true,
              message: "User found",
              isAcceptingMessage: foundUser.isAcceptingMessage,
            },
            { status: 200 }
          );
        }
    } catch (error) {
        return Response.json(
          {
            success: false,
            message: "Failed to find user",
          },
          { status: 500 }
        );
    }
}