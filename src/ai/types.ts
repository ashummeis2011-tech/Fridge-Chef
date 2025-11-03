// src/ai/types.ts
import {z} from 'genkit';

// For generate-recipes.ts
export const GenerateRecipesInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma-separated list of ingredients identified from the fridge photo.'),
});
export type GenerateRecipesInput = z.infer<typeof GenerateRecipesInputSchema>;

export const RecipeSchema = z.object({
  name: z.string().describe('The name of the recipe.'),
  ingredients: z.string().describe('The ingredients required for the recipe.'),
  instructions: z.string().describe('The step-by-step instructions for the recipe.'),
  youtubeSearchQuery: z.string().describe('A YouTube search query to find a video of the recipe.'),
});
export type Recipe = z.infer<typeof RecipeSchema>;
