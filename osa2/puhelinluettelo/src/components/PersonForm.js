import React from 'react'

const PersonForm = ({hfs, hnamei, hnumberi, nname, nnumber}) => {
    return (
        <form onSubmit={hfs}>
            <div>
                name: <input value={nname} onChange={hnamei}/>
            </div>
            <div>
                number: <input value={nnumber} onChange={hnumberi}/>
            </div>
            <div>
                <button type='submit'>add</button>
            </div>
        </form>
    )
}

export default PersonForm;