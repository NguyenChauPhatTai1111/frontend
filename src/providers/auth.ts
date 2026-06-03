import type { AuthProvider } from "@refinedev/core";
import { TOKEN_KEY } from "./constants";

const API_URL = "http://localhost:8000/api";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          error: {
            name: "LoginError",
            message: data.message || "Đăng nhập thất bại",
          },
        };
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return {
        success: true,
        redirectTo: "/game",
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "NetworkError",
          message: "Không kết nối được tới server",
        },
      };
    }
  },

  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("user");
  localStorage.removeItem("gamePassed");

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
    };
  },

  getPermissions: async () => null,

  getIdentity: async () => {
    const user = localStorage.getItem("user");

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  },

  onError: async (error) => {
    console.error(error);

    if ((error as any)?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("user");
      localStorage.removeItem("gamePassed");
      
      return {
        logout: true,
        redirectTo: "/login",
      };
    }

    return { error };
  },
};