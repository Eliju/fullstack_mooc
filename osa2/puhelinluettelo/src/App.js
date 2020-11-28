import React, {useState} from 'react';
import PersonList from './components/Persons'

const App = () => {
    const [persons, setPersons] = useState([
        {name: 'Arto Hellas',
         number: '040-1231244'}
    ])

    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    const handleFormSubmit = (event) => {
        event.preventDefault()
        const phoneBookObject = {
            name: newName,
            number: newNumber,
        }
        if (persons.findIndex((p) => p.name === phoneBookObject.name) >= 0){
            alert(`${newName} is already added to phonebook`)
            return
        }
        setPersons(persons.concat(phoneBookObject))
        setNewName('')
        setNewNumber('')
} 

    const handleNameInput = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberInput = (event) => {
        setNewNumber(event.target.value)
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <form onSubmit={handleFormSubmit}>
                <div>
                    name: <input value={newName} onChange={handleNameInput}/>
                </div>
                <div>
                    number: <input value={newNumber} onChange={handleNumberInput}/>
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