import type { Context } from "telegraf";
import type { Update, Message } from "telegraf/types";

export interface UserData {
  id?: number;
  user_id: number;
  username?: string;
}

export interface UserInput {
  id: number;
  username: string;
}

export type TextMessageContext = Context<{
  message: Update.New & Update.NonChannel & Message.TextMessage
  update_id: number
}> & Omit<Context<Update>, keyof Context<Update>>