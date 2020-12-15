import React from 'react'
import PropTypes from 'prop-types'

const Button = ({name, text, onClick}) => {
  return (
    <button key={name} onClick={onClick}>{text}</button>
  )
}

Button.propTypes = {
  name: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}


export default Button