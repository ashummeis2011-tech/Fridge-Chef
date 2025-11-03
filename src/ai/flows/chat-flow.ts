'use server';
/**
 * @fileOverview A simple chat flow for recipe and cooking-related questions.
 *
 * - chat - A function that handles the chat conversation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ChatInputSchema, ChatInput } from '@/ai/types';


const chatPrompt = `You are FridgeChef AI, a friendly and helpful cooking assistant.
Your goal is to help users with their cooking questions.
You can answer questions about recipes, ingredients, cooking techniques, and more.
Keep your answers concise and easy to understand.

Here is the conversation history:
{{#each history}}
  {{#if (eq role 'user')}}
    User: {{{content}}}
  {{else}}
    Assistant: {{{content}}}
  {{/if}}
{{/each}}

User: {{{message}}}
Assistant:
`;

export async function chat(input: ChatInput): Promise<string> {
    return chatFlow(input);
}

const chatFlow = ai.defineFlow(
    {
        name: 'chatFlow',
        inputSchema: ChatInputSchema,
        outputSchema: z.string(),
    },
    async (input) => {
        const { response } = await ai.generate({
            prompt: chatPrompt,
            model: 'googleai/gemini-2.0-flash',
            input: {
                history: input.history,
                message: input.message,
            },
        });
        return response.text;
    }
);
