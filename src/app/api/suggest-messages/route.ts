// import { openai } from "@ai-sdk/openai";
// import { StreamingTextResponse, streamText } from "ai";
import OpenAI from "openai";
// import { openai } from '@ai-sdk/openai'
import { generateText } from "ai";

// Allow streaming responses up to 30 seconds
// export const maxDuration = 30;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: Request) {
  try {
    // const { messages } = await req.json();

    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const result = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt,
      max_tokens: 400,
    });

    console.log(result);

    // const { text } = await generateText({
    //   model: openai('gpt-3.5-turbo'),
    //   prompt,
    // })

    const questions = result.choices[0].text.split("||");
    // const questions = text.split("||");
      return Response.json(
        {
          success: true,
          message: "Questions generated",
          questions,
        },
        { status: 200 }
    )
    
  } catch (error:any) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;

      return Response.json(
        {
          success: false,
          message,
          error: {
            name,
            headers,
          },
        },
        { status }
      );
    } else {
      console.log("Error streaming text: ", error);
      return Response.json(
        {
          success: false,
          message: "Failed to stream text",
        },
        { status: 500 }
      );
    }
    // return Response.json(
    //   {
    //     success: false,
    //     message: "Failed to stream text",
    //     error: error.message,
    //   },
    //   { status: 500 }
    // );
  }
}
