import { Libraries, useLoadScript } from '@react-google-maps/api'
import './App.css'
import Layout from './components/layout'
import Map from './components/map'
import Search from './components/search'
import { useMemo, useState } from 'react'
import DeleteIcon from './components/icons/deleteIcon'

function App() {

  const [routes, setRoutes] = useState<string[] | []>([])
  const libraries: Libraries = useMemo(() => ['places'], [])

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    region: 'us',
    language: 'en',
    libraries: libraries
  })

  function addRoute(route: string) {
    setRoutes(prev => {
      return [...prev, route]
    })
  }

  function removeRoute(index: number) {
    setRoutes(prev => {
      return prev.filter((_, i) => i !== index)
    })
  }

  if (loadError) return <div>Error loading maps</div>

  return (
    <>
      <Layout>
        <aside className="w-1/4 p-4 bg-orange-2">
          <h2 className="text-xl">Routes</h2>
          <div className='relative my-2'>
            {isLoaded && <Search addRoute={addRoute}/>}
          </div>
          <ul>
            {routes.map((route, index) => {
              return (
                <li key={index} className='border rounded-md p-2 relative mb-2 pr-10'>
                  {route}
                  <button 
                    className='py-2 px-1 bg-red-200 text-white absolute right-0 top-0 bottom-0 rounded-e-md hover:cursor-pointer hover:bg-orange-950 hover:text-white  text-red-800'
                    onClick={() => removeRoute(index)}
                  >
                    <DeleteIcon/>
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>
        {
          !isLoaded ? <div>Loading...</div> : <Map/>
        }
        

      </Layout>
    </>
  )
}

export default App
