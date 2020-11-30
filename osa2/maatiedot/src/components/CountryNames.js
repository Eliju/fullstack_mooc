import React from 'react'
import Button from './Button'


const CountryNames = ({countries, hC}) => {
    return (
        <table><tbody>
            {countries.map(c => <tr key={c.name}><td>{c.name} </td><td><Button text={'show'} onClicked={() => hC(typeof c.name === 'undefined' ? "" : String(c.name ))} /></td></tr>)}    
        </tbody></table>
    )
}

export default CountryNames;