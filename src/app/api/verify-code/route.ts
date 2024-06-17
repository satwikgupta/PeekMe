import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, verifyCode } = await req.json();

    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOneAndUpdate({
      username: decodedUsername,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User does not exist.",
        },
        { status: 404 }
      );
    }

    const isVerifyCodeValid = user.verifyCode === verifyCode;
    const isVerifyCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isVerifyCodeValid && isVerifyCodeNotExpired) {
      user.isVerified = true;
        await user.save();
        return Response.json(
          {
            success: true,
            message: "User verified successfully.",
          },
          { status: 200 }
        );
    } else if (!isVerifyCodeNotExpired) {
        return Response.json(
          {
            success: false,
            message: "Verification code expired.",
          },
          { status: 400 }
        );
    } else {
        return Response.json(
          {
            success: false,
            message: "Invalid verification code.",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error verifying user: ", error);
    return Response.json(
      {
        success: false,
        message: "Failed to verify user.",
      },
      { status: 500 }
    );
  }
}
