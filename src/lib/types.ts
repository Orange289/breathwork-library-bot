export type TelegramUser = {
  id: number;
  is_bot?: boolean;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
};

export type CallbackQuery = {
  id: string;
  from: TelegramUser;
  message?: {
    message_id: number;
    chat: {
      id: number;
      type: string;
    };
  };
  data?: string;
};

export type TelegramUpdate = {
  update_id: number;
  message?: {
    message_id: number;
    from?: TelegramUser;
    chat: {
      id: number;
      type: string;
    };
    text?: string;
  };
  callback_query?: CallbackQuery;
};
