"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchMe = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        credentials: "include", // Important for cookies
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.error("Auth fetch error", err);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    
    if (res.ok) {
      await fetchMe();
      router.push("/lobby");
    }
    return res;
  };

  const signup = async (username, email, password, avatar) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, avatar }),
      credentials: "include",
    });

    if (res.ok) {
      await fetchMe();
      router.push("/lobby");
    }
    return res;
  };

  const logout = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      setCurrentUser(null);
      router.push("/login");
    }
  };

  const updateAvatar = async (colorHex) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/avatar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar: colorHex }),
      credentials: "include"
    });

    if (res.ok) {
      const data = await res.json();
      setCurrentUser(data.user); // update local state with new user object
    }
    return res;
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, signup, logout, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};
