import axios from 'axios';
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const res = axios.get(baseUrl)
    return res.then(response => response.data)
}

const create = newPerson => {
    const res = axios.post(baseUrl, newPerson)
    return res.then(response => response.data)
}

const update = (id, newPerson) => {
    const res = axios.put(`${baseUrl}/${id}`, newPerson)
    return res.then(response => response.data)
}

const deletePerson = id => {
    const res = axios.delete(`${baseUrl}/${id}`)
    return res.then(response => response.data)
}

export default {getAll, create, update, deletePerson}