import { Libraries, useLoadScript } from '@react-google-maps/api'
import './App.css'
import Layout from './components/layout'
import Map from './components/map'
import Search from './components/search'
import { useEffect, useMemo, useState } from 'react'
import DeleteIcon from './components/icons/deleteIcon'
import { getDistance } from 'geolib'

type Location = {
  lat: number,
  lng: number
}
type Address = {
  name: string,
  distance: number,
  coordinates: Location
}

function App() {

  const [addresses, setAddresses] = useState<Address[] | []>([])
  const libraries: Libraries = useMemo(() => ['places'], [])
  const [myLoaction, setMyLocation] = useState<Location | null>(null);
  const [mapPoints, setMapPoints] = useState<Address[] | []>([])

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    region: 'us',
    language: 'en',
    libraries: libraries
  }) 
 
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

  async function addAddress(address: {name: string, coordinates: Location}) {
    if (myLoaction) {
      const distance = getDistance({latitude: myLoaction.lat, longitude: myLoaction.lng}, address.coordinates)
      setAddresses(prev => {
        return [...prev, {name: address.name, distance, coordinates: address.coordinates}]
      })
    }
  }

  function removeAddress(index: number) {
    setAddresses(prev => {
      return prev.filter((_, i) => i !== index)
    })
  }

  if (loadError) return <div>Error loading maps</div>

  return (
    <>
      <Layout>
        <div className='flex justify-between items-center'>
          <div className='relative my-2 mb-6 max-w-[600px] w-full'>
            {isLoaded && <Search addAddress={addAddress}/>}
          </div>
          <button 
            className="py-2 px-4 mb-2 bg-orange-950 text-white rounded-md hover:cursor-pointer hover:bg-orange-900"
            onClick={() => {}}
          >Find Best Route</button>
        </div>
        
        <div className="flex gap-6">
          <aside className="w-1/4 bg-orange-2 min-w-[350px]">
            {addresses.length > 0  && (
              <>
                <h2 className="text-xl mb-4">Addresses</h2>
                <ul>
                  {addresses.map((address, index) => {
                    return (
                      <li key={index} className='border rounded-md p-2 relative mb-2 pr-10'>
                        {address.name}
                        <button 
                          className='py-2 px-1 bg-red-200 text-white absolute right-0 top-0 bottom-0 rounded-e-md hover:cursor-pointer hover:bg-orange-950 hover:text-white  text-red-800'
                          onClick={() => removeAddress(index)}
                        >
                          <DeleteIcon/>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </>
            )}
            
          </aside>
          
          {
            !isLoaded && mapPoints.length > 0 && <Map addresses={mapPoints}/>
          }
        </div>
        

      </Layout>
    </>
  )
}

export default App
