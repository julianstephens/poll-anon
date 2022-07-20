import { useApolloClient } from "@apollo/client";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const client = useApolloClient();
  const navigate = useNavigate();

  const setAuthToken = (token: string) => {
    try {
      localStorage.setItem("JWT_TOKEN", token);
    } catch (err) {
      throw new Error()
    }
  };

  const logout = () => {
    client.resetStore();
    localStorage.clear();
    navigate("/");
  };

  return { logout, setAuthToken };
};
