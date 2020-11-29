import React from 'react'

const Filter = ({nf, flist}) => {
    return (
        <>
            Filter shown with <input value={nf} onChange={flist}/>
        </>
    )
}

export default Filter;