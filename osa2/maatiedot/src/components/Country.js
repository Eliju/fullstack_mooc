import React from 'react'
import Language from './Language'
import Image from './Image'
import Weather from './Weather'

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
        <Image url={country.flag} altText={'Country Flag'} w={'10%'} h={'10%'}/>
        <Weather capital={country.capital} />
      </div>

    )
}

export default Country; 