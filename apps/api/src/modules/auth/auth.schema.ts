import { z } from "zod";

export const oauthCallbackSchema = z.object({
  token: z.string({
    required_error: "Supabase access token is required",
  }),
});
