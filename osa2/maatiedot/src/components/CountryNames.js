import React from 'react'

const CountryNames = ({countries}) => {
    return (
        <div>
            {countries.map(c => <div key={c.name}>{c.name}</div>)}     
        </div>
    )
}

export default CountryNames;