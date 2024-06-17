import { Message } from "@/model/User.model";

export interface ApiResponse {
    success: boolean;
    message: string;
    data?: any;
    isAcceptingMessage?: boolean;
    messages?: Array<Message>;
}