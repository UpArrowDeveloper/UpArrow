import { env } from "../config";

export const moveToLogin = () => {
  typeof window !== "undefined" &&
    (window.location.href = `${env.serverUrl}/oauth/auth/google`);
};
