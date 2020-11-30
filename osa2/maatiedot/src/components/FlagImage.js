import React from 'react';

const FlagImage = ({url})=> {
    return <img src={url} alt="Country Flag" resizemode={'cover'} width={'10%'} height={'10%'}/>
}

export default FlagImage;