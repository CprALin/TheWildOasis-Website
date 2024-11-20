"use server"

import { revalidatePath } from "next/cache";
import { auth, signIn , signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";

export async function updateGuest(formData) {

    const session = await auth();

    if(!session) throw new Error("You must be logged in");  

    const national_id = formData.get('national_id');
    const [ nationality , country_flag] = formData.get('nationality').split("%");

    const regex = /^[a-zA-Z0-9]{6,12}$/;

    if(!regex.test(national_id)){
        throw new Error('Please provide a valid national ID');
    }
    const updateData = {nationality , country_flag , national_id};

    const { data , error } = await supabase
        .from("guests")
        .update(updateData)
        .eq("id" , session.user.guestId)

    if(error) {
        throw new Error("Guest could not be updated");
    }

    revalidatePath('/account/profile');
}

export async function singInAction() {
    await signIn('google' , {redirectTo : '/account'}); 
}

export async function singOutAction() {
    await signOut({redirectTo : "/"});
}

export async function deleteReservation(bookingId) {
    const session = await auth();
    if(!session) throw new Error("You must be logged in");

    const guestBookings = await getBookings(session.user.guestId);
    const guestBookingIds = guestBookings.map(booking => booking.id);

    if(guestBookingIds.includes(bookingId)){
        throw new Error("You are not allowed to delete this booking.")
    }

    const { error } = await supabase.from("bookings").delete().eq("id" , bookingId);

    if(error) {
        console.log(error);
        throw new Error("Booking could not be deleted");
    }

    revalidatePath('/account/reservations');
}