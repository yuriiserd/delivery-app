import { useEffect, useMemo, useState } from "react";
import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";

type Location = {
  lat: number,
  lng: number
}

export default function Map({addresses} : {
  addresses: {name: string, distance: number, coordinates: Location}[]
}): JSX.Element {

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const center = useMemo(() => ({lat: 48.3794, lng: 31.1656}), []);
  const [myLoaction, setMyLocation] = useState<Location | null>(null);
  
  // Get user location
  useEffect(() => {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setMyLocation({lat: latitude, lng: longitude})
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [])

  // Get directions
  useEffect(() => {
    if (!myLoaction) return;
    const directionsService = new google.maps.DirectionsService();
    const origin = myLoaction;
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
  }, [myLoaction])

  return (
    <section className="w-full bg-orange-1">
      <h2 className="text-xl mb-4">Map</h2>
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