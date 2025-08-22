"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "@/lib/firebase";

export const metadata = {
  title: "iebrek system",
  description: "Login to access the Iebrek System admin dashboard.",
  keywords: "login, admin, iebrek system, authentication",
  robots: "index, follow"
  
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err) {
      setError("Google login failed.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-8 bg-neutral-50 dark:bg-neutral-900 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-800 flex flex-col gap-6"
        aria-label="Login form"
      >
        <h1 className="text-2xl font-bold text-center mb-2">Sign in to DICT R5 Catanduanes System</h1>
        <p className="text-neutral-500 text-center text-sm mb-4">Testing</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="px-4 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="px-4 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          required
        />
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="w-full py-2 rounded bg-black text-white dark:bg-white dark:text-black font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition"
        >
          Login
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition flex items-center justify-center gap-2 mt-2"
        >
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_17_40)"><path d="M47.5 24.552c0-1.636-.146-3.192-.418-4.682H24v9.086h13.22c-.57 3.08-2.28 5.69-4.86 7.44v6.18h7.86c4.6-4.24 7.28-10.5 7.28-17.024z" fill="#4285F4"/><path d="M24 48c6.48 0 11.92-2.14 15.89-5.82l-7.86-6.18c-2.19 1.48-4.98 2.36-8.03 2.36-6.18 0-11.42-4.18-13.29-9.8H2.6v6.24C6.56 43.14 14.56 48 24 48z" fill="#34A853"/><path d="M10.71 28.56A14.98 14.98 0 019.2 24c0-1.58.27-3.12.75-4.56v-6.24H2.6A23.98 23.98 0 000 24c0 3.78.9 7.36 2.6 10.8l8.11-6.24z" fill="#FBBC05"/><path d="M24 9.5c3.52 0 6.66 1.21 9.13 3.59l6.84-6.84C35.92 2.14 30.48 0 24 0 14.56 0 6.56 4.86 2.6 13.2l8.11 6.24C12.58 13.68 17.82 9.5 24 9.5z" fill="#EA4335"/></g><defs><clipPath id="clip0_17_40"><path fill="#fff" d="M0 0h48v48H0z"/></clipPath></defs></svg>
          Sign in with Google
        </button>
      </form>
    </main>
  );
}
