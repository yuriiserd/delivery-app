import { useEffect, useMemo, useState } from "react";
import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";

type Location = {
  lat: number,
  lng: number
}

export default function Map({addresses} : {
  addresses: {name: string, coordinates: Location}[]
}): JSX.Element {

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const center = useMemo(() => ({lat: 48.3794, lng: 31.1656}), []);
  const [myLoaction, setMyLocation] = useState<Location | null>(null);
  const [destination, setDestination] = useState<string>('');
  const [waypoints, setWaypoints] = useState<string>('');
  
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
    const destination = addresses[addresses.length - 1].coordinates;
    setDestination(`${destination.lat},${destination.lng}`);
    const waypoints = addresses.slice(0, -1).map(address => {
      return {
        location: address.coordinates,
        stopover: true,
      }
    })
    setWaypoints(waypoints.map(waypoint => `${waypoint.location.lat},${waypoint.location.lng}`).join('|'));


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
      <div className="flex gap-4 items-baseline mb-4 justify-between">
        <h2 className="text-xl ">Map</h2>
        {
          myLoaction && destination && waypoints && (
            <a className="text-blue-500 hover:underline" href={`https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${destination}&waypoints=${waypoints}`} target="_blank" rel="noopener noreferrer">
              Open Route in Google Maps

            </a>
          )
        }
      </div>
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