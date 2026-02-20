import { z } from 'zod';

export interface ToolDefinition<T extends z.ZodObject<any>, R> {
  name: string;
  description: string;
  schema: T;
  handler: (args: z.infer<T>) => Promise<R>;
}
