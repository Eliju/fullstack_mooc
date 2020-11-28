import React from 'react'

const PersonList = ({persons, filter}) => {
    if (String(filter).trim().length === 0) {
        return (
            persons.map(p => <p key={p.name}>{p.name} {p.number}</p>)
        )
    } else {
        let f = ' ' + filter
        const filteredData = persons.filter(p =>p.name.toUpperCase().includes(f.toUpperCase().trim())) 
        return(
            filteredData.map(p => <p key={p.name}>{p.name} {p.number}</p>)
        )
    }
}

export default PersonList;