import { useEffect, useMemo, useState } from "react";
import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";

export default function Map(): JSX.Element {

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const center = useMemo(() => ({lat: 48.3794, lng: 31.1656}), []);
  
  useEffect(() => {
    const directionsService = new google.maps.DirectionsService();
    const origin = {lat: 48.3794, lng: 31.1656};
    const destination = {lat: 50.4501, lng: 30.5234};

    const waypoints = [
      {
        location: { lat: 49.8397, lng: 24.0297 }, // Lviv
        stopover: true,
      },
      {
        location: { lat: 50.7472, lng: 25.3254 }, // Lutsk
        stopover: true,
      },
    ];

    directionsService.route({
      origin: origin,
      destination: destination,
      waypoints: waypoints,
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        setDirections(result);
      } else {
        console.error(`error fetching directions ${result}`);
      }
    })
  }, [])

  return (
    <section className="w-3/4 p-4 bg-orange-1">
      <h2 className="text-xl mb-2">Map</h2>
      <GoogleMap
        mapContainerStyle={{height: "80vh", width: "100%"}}
        zoom={6.2}
        center={center}
      >
        {directions && <DirectionsRenderer directions={directions}/>}
      </GoogleMap>
    </section>
  )
}