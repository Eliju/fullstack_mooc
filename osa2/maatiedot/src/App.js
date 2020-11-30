import React, {useState, useEffect} from 'react';
import axios from 'axios';
import ConditionalOutput from './components/ConditionalOutput'


const App = () => {
  const [countryList, setCountries] = useState([])
  const [newFilter, setFilter] = useState("")

  const hookCountries = () => {
    axios.get('https://restcountries.eu/rest/v2/all')
    .then(response => {
      setCountries(response.data)
    })
  }
  useEffect(hookCountries)  

  
  return (
    <div>
       Find countries: <input type="text" value={newFilter} onChange={event => setFilter(event.target.value)} />
       <ConditionalOutput countries={countryList} filter={newFilter} handleClick={setFilter} />
    </div>
  );
}

export default App;
