import React from 'react'
import Button from './Button'


const CountryNames = ({countries, hC}) => {
    return (
        <div>
            {countries.map(c => <div key={c.name}>{c.name} <Button text={'show'} onClicked={() => hC(typeof c.name === 'undefined' ? "" : String(c.name ))} /></div>)}    
        </div>
    )
}

export default CountryNames;