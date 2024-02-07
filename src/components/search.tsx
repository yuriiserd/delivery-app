import { useState } from "react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import Downshift from "downshift";
import css from './search.module.scss';

type Location = {
  lat: number,
  lng: number
}

export default function Search({addAddress}: {
  addAddress: (route: {name: string, coordinates: Location}) => void
}): JSX.Element {

  const [coordinates, setCoordinates] = useState<Location | null>(null);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions: {},
  }); 

  return (
    <div className={css.search}>
      <input 
        type="text"
        value={value}  
        onChange={(e) => {
          setValue(e.target.value);
        }}
        disabled={!ready}
        placeholder="Enter an address"
        className={css.input}
      />
      {status === "OK" && (
        <ul className={css.dropdown}>
          {data.map(({ place_id, description }) => {
            return (
              <li key={place_id} onClick={async () => {
                setValue(description, false);
                clearSuggestions();
                try {
                  const results = await getGeocode({address: description});
                  const { lat, lng } = getLatLng(results[0]);
                  setCoordinates({lat, lng});
                } catch (error) {
                  console.error('Error: ', error);
                }
              }}>{description}</li>
            )
          })}
        </ul>
      )}
      
      <input 
        type='button' 
        value='Add Address' 
        className='py-2 px-4 bg-orange-950 text-white right-0 top-0 bottom-0 rounded-md hover:cursor-pointer hover:bg-orange-900' 
        onClick={() => {
          addAddress({name: value, coordinates: coordinates as Location})
          setValue('')
        }}
      />
    </div>
  )
}