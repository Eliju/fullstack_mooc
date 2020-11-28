import React, {useState} from 'react';
import PersonList from './components/Persons'

const App = () => {
    const [persons, setPersons] = useState([
        {name: 'Arto Hellas'}
    ])

    const [newName, setNewName] = useState('')

    const handleFormSubmit = (event) => {
        event.preventDefault()
        const phoneBookObject = {
            name: newName,
        }
        setPersons(persons.concat(phoneBookObject))
        setNewName('')
    } 

    const handleInput = (event) => {
        setNewName(event.target.value)
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <form onSubmit={handleFormSubmit}>
                <div>
                    name: <input value={newName} onChange={handleInput}/>
                </div>
                <div>
                    <button type='submit'>add</button>
                </div>
                <h2>Numbers</h2>
                <PersonList persons={persons} />
            </form>
        </div>
    )
}

export default App;