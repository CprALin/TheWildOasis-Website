"use server"

import { signIn , signOut } from "./auth";

export async function singInAction() {
    await signIn('google' , {redirectTo : '/account'}); 
}

export async function singOutAction() {
    await signOut({redirectTo : "/"});
}