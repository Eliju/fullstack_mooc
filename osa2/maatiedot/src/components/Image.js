import React from 'react';

const Image = ({url, altText, w, h})=> {
    return <img  alt={altText} title={altText} src={url} resizemode={'contain'} width={w} height={h}/>
}

export default Image;