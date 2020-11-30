import React from 'react';

const Language = ({languages}) => {
    return (
        languages.map(l => <li key={l.name}>{l.name}</li>)
    )
}

export default Language;