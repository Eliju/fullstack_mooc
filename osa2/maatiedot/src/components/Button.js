import React from 'react';

const Button = ({text, onClicked}) => {
    return(
        <button onClick={onClicked}>{text}</button>
    )
}

export default Button;