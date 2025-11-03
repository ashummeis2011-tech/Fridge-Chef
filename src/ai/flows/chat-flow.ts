'use server';
/**
 * @fileOverview A simple chat flow for recipe and cooking-related questions.
 *
 * - chat - A function that handles the chat conversation.
 * - ChatHistory - The type for the chat message history.
 * - ChatInput - The input type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatHistorySchema = z.array(ChatMessageSchema);
export type ChatHistory = z.infer<typeof ChatHistorySchema>;


export const ChatInputSchema = z.object({
  history: ChatHistorySchema,
  message: z.string(),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;


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
