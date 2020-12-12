import React from 'react'

const PersonForm = ({hfs, hnamei, hnumberi, nname, nnumber}) => {
    return (
        <form onSubmit={hfs}>
            <table>
                <tbody>
                    <tr>
                        <td>name:</td><td><input value={nname} onChange={hnamei}/></td>
                    </tr>
                    <tr>
                        <td>number:</td><td><input value={nnumber} onChange={hnumberi}/></td>
                    </tr>
                    <tr>
                        <td><button type='submit'>add</button></td><td></td>
                    </tr>
                </tbody>
            </table>
        </form>
    )
}

export default PersonForm;