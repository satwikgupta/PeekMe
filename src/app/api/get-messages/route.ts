import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";

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
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      { $unwind: "$messages" },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);
    if (!user || user.length === 0) {
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
          data: user[0],
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
