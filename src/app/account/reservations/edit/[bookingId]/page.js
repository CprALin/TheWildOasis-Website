
import SubmitButton from "@/src/app/_components/SubmitButton";
import { updateBooking } from "@/src/app/_lib/actions";
import { getBooking, getCabin } from "@/src/app/_lib/data-service";

export default async function Page({params}) {
  
  const {bookingId} = await params;
  const {num_guests , observations, cabin_id} = await getBooking(bookingId);
  const {max_capacity} = await getCabin(cabin_id);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{bookingId}
      </h2>

      <form action={updateBooking} className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col">
        <input type="hidden" value={bookingId} name="bookingId" /> 

        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="num_guests"
            id="num_guests"
            defaultValue={num_guests}
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: max_capacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            defaultValue={observations}
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
            <SubmitButton pendingLabel="Updating...">Update profile</SubmitButton>
        </div>
      </form>
    </div>
  );
}