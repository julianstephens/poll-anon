import { nanoid } from "nanoid";
import { useState } from "react";

const USER_ID_KEY = "polling_app_user_id";

export const useUserId = () => {
  const [userId] = useState<string>(() => {
    let id = localStorage.getItem(USER_ID_KEY);
    if (!id) {
      id = nanoid();
      localStorage.setItem(USER_ID_KEY, id);
    }
    return id;
  });

  return userId;
};
