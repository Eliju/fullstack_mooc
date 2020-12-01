import React from 'react'
import Person from './Person'

const PersonList = ({persons, filter, handleClick}) => {
    let listToShow = []
    if (String(filter).trim().length === 0) {
        listToShow = persons
    } else {
        let f = ' ' + filter
        listToShow = persons.filter(p =>p.name.toUpperCase().includes(f.toUpperCase().trim())) 
    }
    return (
        listToShow.map(p => <Person key={p.name} p={p} onButtonClick={handleClick} />)
    )
}

export default PersonList;