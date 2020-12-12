import React from 'react'

const Button = ({name, text, onClick}) => {
    return (
        <button onClick={onClick}>{text}</button>
    )
}

export default Button