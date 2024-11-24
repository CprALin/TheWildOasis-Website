"use client"

import { difference } from "next/dist/build/utils";
import { useReservation } from "./ReservationContext";
import { differenceInDays } from "date-fns";
import { createBooking } from "../_lib/actions";
import SubmitButton from "./SubmitButton";

function ReservationForm({cabin , user}) {
  const { range , resetRange } = useReservation();

  const { max_capacity , regular_price , discount } = cabin;

  const start_date = range.from;
  const end_date = range.to;

  const num_nights = differenceInDays(end_date , start_date);
  const cabin_price = num_nights * (regular_price-discount);

  const bookingData = {
      start_date,
      end_date,
      num_nights,
      cabin_price,
      cabinId : id
  };

  const createBookingWithData = createBooking.bind(null, bookingData);

  return (
    <div className='scale-[1.01]'>
      <div className='bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center'>
        <p>Logged in as</p>

        <div className='flex gap-4 items-center'>
          <img
            // Important to display google profile images
            referrerPolicy='no-referrer'
            className='h-8 rounded-full'
            src={user.image}
            alt={user.name}
          />
          <p>{user.name}</p>
        </div>
      </div>

      <form action={async (formData) => {await createBookingWithData(formData); resetRange();}} className='bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col'>
        <div className='space-y-2'>
          <label htmlFor='num_guests'>How many guests?</label>
          <select
            name='num_guests'
            id='num_guests'
            className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm'
            required
          >
            <option value='' key=''>
              Select number of guests...
            </option>
            {Array.from({ length: max_capacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>

        <div className='space-y-2'>
          <label htmlFor='observations'>
            Anything we should know about your stay?
          </label>
          <textarea
            name='observations'
            id='observations'
            className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm'
            placeholder='Any pets, allergies, special requirements, etc.?'
          />
        </div>

        <div className='flex justify-end items-center gap-6'>
          {!(start_date && end_date) ?
           (<p className='text-primary-300 text-base'>Start by selecting dates</p>) : (
            <SubmitButton pendingLabel="Reserving...">Reserve now</SubmitButton>  
           )}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
