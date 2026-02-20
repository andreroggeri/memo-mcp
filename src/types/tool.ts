import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ToolDefinition<T extends z.ZodObject<any>, R> {
  name: string;
  description: string;
  schema: T;
  handler: (args: z.infer<T>) => Promise<R>;
}
