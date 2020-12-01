import React, {useState, useEffect} from 'react';
import PersonList from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personService from './services/person'

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

        personService.create(phoneBookObject)
             .then(newPerson => {
                 setPersons(persons.concat(newPerson))
                 setNewName('')
                 setNewNumber('')
                 setFilter('')
             })
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

    const handleDeleteClick = (name) => {
        return (
            () => {
                if (window.confirm(`Delete ${name}?`)) {
                    const idx = persons.findIndex(p => p.name === name)
                    if (idx >= 0) {
                        const id = persons[idx].id
                        personService.deletePerson(id)
                            .then(res => { 
                                setPersons(persons.filter(p => p.id !== id))
                            }
                        )
                    }  
                }  
            }
        )
    }

    useEffect(() => {
        personService.getAll()
          .then(personList => {
            setPersons(personList)
          })
      }, [])

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter nf={newFilter} flist={filterList} />
            <h3>Add a new</h3>
            <PersonForm hfs={handleFormSubmit} hnamei={handleNameInput} hnumberi={handleNumberInput} nname={newName} nnumber={newNumber} />
            <h3>Numbers</h3>
            <PersonList persons={persons} filter={newFilter} handleClick={handleDeleteClick} />
        </div>
    )
}

export default App;