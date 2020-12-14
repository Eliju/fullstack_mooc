import React, {useState, useEffect} from 'react';
import PersonList from './components/PersonList'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Notification from './components/Notification'
import personService from './services/person'
import ErrorMessage from './components/ErrorMessage';

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newFilter, setFilter] = useState('')
    const [notification, setNotification] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const handleFormSubmit = (event) => {
        event.preventDefault()
        const phoneBookObject = {
            name: newName,
            number: newNumber,
        }
        if (newName === '' || newNumber === '') {
            setErrorMessage(`Both name and number are mandatory fields`)
            setTimeout(() => setErrorMessage(''), 5000)
            return
        }
        if (persons.findIndex((p) => p.name === phoneBookObject.name) >= 0){
            //alert(`${newName} is already added to phonebook`)
            if (window.confirm(`${phoneBookObject.name} is already added to phonebook, replace the old number with a new one?`)) {
                const id = persons[persons.findIndex(p => p.name === phoneBookObject.name)].id
                personService.update(id, phoneBookObject)
                    .then(res => {
                        const newList = persons.map(p => p.id !== id ? p : res)
                        setPersons(newList)
                        setNotification(`Updated the number of ${phoneBookObject.name}`)
                        setTimeout(() => setNotification(''), 5000)
                        setNewName('')
                        setNewNumber('')
                        setFilter('')
                    })
                    .catch(error => {
                        setErrorMessage(`Error: ${phoneBookObject.name} may have been deleted already?`)
                        setTimeout(() => setErrorMessage(''), 5000)
                        setNewName('')
                        setNewNumber('')
    
                    })
            } else {
                setNewName('')
                setNewNumber('')
            }
        } else {
            personService.create(phoneBookObject)
                .then(newPerson => {
                    setPersons(persons.concat(newPerson))
                    setNotification(`Added ${phoneBookObject.name}`)
                    setTimeout(() => setNotification(''), 5000)
                    setNewName('')
                    setNewNumber('')
                    setFilter('')
                })
            }
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
                        const name = persons[idx].name
                        personService.deletePerson(id)
                            .then(res => { 
                                setPersons(persons.filter(p => p.id !== id))
                                setNotification(`Deleted the entry of ${name}`)
                                setTimeout(() => setNotification(''), 5000)
                            })
                            .catch(error => {
                                setErrorMessage(`Deletion of ${name} failed - maybe already removed?`)
                                setTimeout(() => setErrorMessage(''), 5000)
                                setPersons(persons.filter(p => p.name !== name))
                            })
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
            <Notification message={notification}/>
            <ErrorMessage message={errorMessage}/>
            <Filter nf={newFilter} flist={filterList} />
            <h3>Add a new</h3>
            <PersonForm hfs={handleFormSubmit} hnamei={handleNameInput} hnumberi={handleNumberInput} nname={newName} nnumber={newNumber} />
            <h3>Numbers</h3>
            <PersonList persons={persons} filter={newFilter} handleClick={handleDeleteClick} />
        </div>
    )
}

export default App;