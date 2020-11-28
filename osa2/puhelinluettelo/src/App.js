import React, {useState} from 'react';
import PersonList from './components/Persons'

const App = () => {
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas', number: '040-123456' },
        { name: 'Ada Lovelace', number: '39-44-5323523' },
        { name: 'Dan Abramov', number: '12-43-234345' },
        { name: 'Mary Poppendieck', number: '39-23-6423122' }
        ])

    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newFilter, setFilter] = useState(' ')

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
        setFilter('')
} 

    const handleNameInput = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberInput = (event) => {
        setNewNumber(event.target.value)
    }

    const filterList = (event) => {
        setFilter(event.target.value)
    } 

    return (
        <div>
            <h2>Phonebook</h2>
            filter shown with <input value={newFilter} onChange={filterList}/>
            <h2>add a new</h2>
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
            </form>
            <h2>Numbers</h2>
            <PersonList persons={persons} filter={newFilter} />
        </div>
    )
}

export default App;