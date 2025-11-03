import { config } from 'dotenv';
config();

import '@/ai/flows/identify-ingredients.ts';
import '@/ai/flows/generate-recipes.ts';
import '@/ai/flows/chat-flow.ts';
