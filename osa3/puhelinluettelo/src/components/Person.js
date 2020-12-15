import React from 'react'
import Button from './Button'
import PropTypes from 'prop-types'


const Person = ({p, onButtonClick}) => {
  const name = p.name
  const number = p.number
  return(
    <div>{name} {number} <Button name={name} text={'delete'} onClick={onButtonClick(name)}/></div>
  )
}

Person.propTypes = {
  p: PropTypes.object.isRequired,
  onButtonClick: PropTypes.func.isRequired,
  name: PropTypes.string,
  number: PropTypes.string
}

export default Person