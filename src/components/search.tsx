import { useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import css from './search.module.scss';


export default function Search({addRoute}): JSX.Element {

  const [center, setCenter] = useState({ lat: 48.3794, lng: 31.1656 });

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
      <Combobox
        onSelect={async (address) => {
          setValue(address, false);
          clearSuggestions();
        }}
      >
        <ComboboxInput
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            
          }}
          disabled={!ready}
          placeholder="Enter an address"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
      <input 
        type='button' 
        value='Add Route' 
        className='py-2 px-4 bg-orange-950 text-white right-0 top-0 bottom-0 rounded-md hover:cursor-pointer hover:bg-orange-900' 
        onClick={() => {
          addRoute(value)
          setValue('')
        }}
      />
    </div>
  )
}