import React, {useState, useEffect} from 'react';
import axios from 'axios'
import PersonList from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'

const App = () => {
    const [persons, setPersons] = useState([])
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

    useEffect(() => {
        axios
          .get('http://localhost:3001/persons')
          .then(response => {
            setPersons(response.data)
          })
      }, [])

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter nf={newFilter} flist={filterList} />
            <h3>Add a new</h3>
            <PersonForm hfs={handleFormSubmit} hnamei={handleNameInput} hnumberi={handleNumberInput} nname={newName} nnumber={newNumber} />
            <h3>Numbers</h3>
            <PersonList persons={persons} filter={newFilter} />
        </div>
    )
}

export default App;