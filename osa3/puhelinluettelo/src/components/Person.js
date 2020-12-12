import React from 'react';
import Button from './Button';


const Person = ({p, onButtonClick}) => {
    return(
        <div>{p.name}  {p.number}  <Button name={p.name} text={'delete'} onClick={onButtonClick(p.name)}/></div>
        )
}

export default Person;