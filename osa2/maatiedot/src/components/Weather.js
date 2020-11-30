import React, {useState,useEffect} from 'react'
import axios from 'axios'
import Image from './Image'

const Weather = ({capital}) => {
    const [weather, setWeather] = useState([])
    const hookWeather = () => {
        const api_key = process.env.REACT_APP_API_KEY // HUOM! Noden ymparistomuuttujien tulee alkaa REACT_APP - muuten ei tule mukaan 
        const request = `http://api.weatherstack.com/current?access_key=${api_key}&query=${capital}&units=m` 
        axios.get(request)
        .then(response => {
            setWeather(response.data)
        })
      }
    
    useEffect(hookWeather,[])  

    if (typeof weather.current === 'undefined') {
        return (<div></div>)
    } else {
        return (
            <div>
                <h3>Weather in {capital}</h3>
                <div>temperature: {weather.current.temperature} Celcius</div>
                {weather.current.weather_icons.map(i => <Image key={i} url={i} altText={'Current Weather in the Capital'} w={'5%'} h={'5%'} /> )}
                <div>wind: {weather.current.wind_speed} km/h direction {weather.current.wind_dir}</div>
            </div>
        ) 
    }
}

export default Weather;