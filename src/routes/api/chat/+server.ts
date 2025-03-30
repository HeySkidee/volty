import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import type { RequestHandler } from "@sveltejs/kit";

import { env } from "$env/dynamic/private";

const google = createGoogleGenerativeAI({
    apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY ?? "",
});

export const POST = (async ({ request }) => {
    console.log('API Key:', env.GOOGLE_GENERATIVE_AI_API_KEY);

    const { messages } = await request.json();
    const result = streamText({
        model: google('gemini-1.5-flash-8b'), 
        messages
    });

    return result.toDataStreamResponse()
}) as RequestHandler;
