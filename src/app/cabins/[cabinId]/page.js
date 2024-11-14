import { getCabin, getCabins } from "../../_lib/data-service";
import Reservation from "../../_components/Reservation";
import { Suspense } from "react";
import Spinner from "../../_components/Spinner";
import Cabin from "../../_components/Cabin";


export async function generateMetadata({params}) {
    const { name } = await getCabin(await params.cabinId);
    return { title : `Cabin ${name}`};
}

//function to make a dynamic page into a static page
export async function genereateStaticParams() {
    const cabins = await getCabins();
    
    cabins.map(cabin => ({
      cabinId : String(cabin.id)
    }));

    return ids
}

export default async function Page({ params }) {
  
  const cabin = await getCabin(await params.cabinId);
  /*   
  const settings = await getSettings();
  const bookedDates = await getBookedDatesByCabinId(await params.cabinId); */

  // const [cabin , settings , bookedDates]  = await Promise.all([getCabin(params.cabinId) , getSettings() , getBookedDatesByCabinId(await params.cabinId) ]);
  

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />

      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>

        <Suspense fallback={<Spinner />}>
            <Reservation cabin={cabin}/>
        </Suspense>
      </div>
    </div>
  );
}
