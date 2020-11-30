import React from 'react';

const FlagImage = ({url})=> {
    return <img  alt="Country Flag" title="Country Flag" src={url} resizemode={'cover'} width={'10%'} height={'10%'}/>
}

export default FlagImage;