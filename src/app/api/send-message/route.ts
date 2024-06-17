import UserModel, { Message } from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(req:Request) {
    await dbConnect();

    const { username, content } = await req.json();

    try {
        const user = await UserModel.findOne({ username })
        
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to find user",
                },
                { status: 404 }
            );
        } 

        if(!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting messages",
                },
                { status: 403 }
            );
        }
        
        const  newMessage = {
            content,
            createdAt: new Date(),
        }
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json(
            {
                success: true,
                message: "Message sent",
                user,
            },
            { status: 200 }
        );

    } catch (error) {
        console.log("Error adding messages: ", error);
        return Response.json(
            {
                success: false,
                message: "Intenal Server Error. Please try again later",
            },
            { status: 500 }
        );
    }
}