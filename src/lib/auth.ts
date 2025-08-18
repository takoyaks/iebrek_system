// src/lib/auth.ts
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";

export async function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  return signOut(auth);
}

export function onUserStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
