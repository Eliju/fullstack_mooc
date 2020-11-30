import React from 'react'
import Country from './Country'
import TextOutput from './TextOutput'
import CountryNames from './CountryNames'

const ConditionalOutput = ({countries, filter}) => {
    if (filter.length === 0) {
        return (<TextOutput text={'Too many matches, specify another filter'} />)
    } else {
      const filtered = countries.filter(c => c.name.toUpperCase().includes(filter.toUpperCase()))
      if (filtered.length === 0){
        return (<TextOutput text={'No matches, try another filter'} />)
      } else if (filtered.length > 10) {
        return (<TextOutput text={'Too many matches, specify another filter'} />)
      } else if (filtered.length > 1) {
        return (<CountryNames countries={filtered} />)
      } else {
        const country= filtered[0]
        return (<Country country={country} />)
      }
    }
  }

  export default ConditionalOutput;