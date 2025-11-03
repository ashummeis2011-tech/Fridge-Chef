// src/ai/flows/generate-recipes.ts
'use server';
/**
 * @fileOverview AI flow to generate simple recipe suggestions based on identified ingredients.
 *
 * - generateRecipes - A function that generates recipe suggestions.
 * - GenerateRecipesInput - The input type for the generateRecipes function.
 * - Recipe - The type for a single recipe.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipesInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma-separated list of ingredients identified from the fridge photo.'),
});
export type GenerateRecipesInput = z.infer<typeof GenerateRecipesInputSchema>;

const RecipeSchema = z.object({
  name: z.string().describe('The name of the recipe.'),
  ingredients: z.string().describe('The ingredients required for the recipe.'),
  instructions: z.string().describe('The step-by-step instructions for the recipe.'),
  youtubeSearchQuery: z.string().describe('A YouTube search query to find a video of the recipe.'),
});
export type Recipe = z.infer<typeof RecipeSchema>;

const RecipeTool = ai.defineTool(
  {
    name: 'recipe',
    description: 'Provides a single recipe suggestion.',
    inputSchema: RecipeSchema,
    outputSchema: z.void(),
  },
  async (recipe) => {
    // This is a client-side tool, so the implementation is on the client.
  }
);


export async function generateRecipes(input: GenerateRecipesInput, onRecipe: (recipe: Recipe) => void) {
    const stream = await generateRecipesFlow(input, {
        stream: (chunk) => {
            if (chunk.type === 'toolRequest' && chunk.toolRequest.name === 'recipe') {
                onRecipe(chunk.toolRequest.input);
            }
        }
    });
    return stream;
}

const generateRecipesPrompt = `You are a recipe suggestion AI. Given a list of ingredients, you will suggest 3 simple recipes that can be made with those ingredients.
Use the 'recipe' tool to provide one recipe at a time.

Ingredients: {{{ingredients}}}

Please provide 3 recipe suggestions.
For each recipe, provide a name, the required ingredients, step-by-step instructions, and a concise YouTube search query to find a video tutorial for the recipe (e.g., "easy chicken parmesan recipe").
The ingredients field in the output should only contain ingredients from the input. Do not suggest ingredients which are not present in the input.
Recipes must be simple, and able to be prepared in under 30 minutes.
`;

const generateRecipesFlow = ai.defineFlow(
  {
    name: 'generateRecipesFlow',
    inputSchema: GenerateRecipesInputSchema,
    outputSchema: z.void(),
  },
  async input => {
    const {response} = await ai.generate({
        prompt: generateRecipesPrompt,
        model: 'googleai/gemini-2.0-flash',
        tools: [RecipeTool],
        input: {
            ingredients: input.ingredients,
        },
    });
    return;
  }
);

    