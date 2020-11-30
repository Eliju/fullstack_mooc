import React from 'react'
import Language from './Language'
import FlagImage from './FlagImage'

const Country = ({country}) => {
    return (
        <div>
        <h2>{country.name}</h2>
        <div>capital {country.capital}</div>
        <div>population {country.population}</div>
        <h3>languages</h3>
        <ul>
            <Language languages={country.languages} />
        </ul>
        <FlagImage url={country.flag} />
      </div>

    )
}

export default Country; 