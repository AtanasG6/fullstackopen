import { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY

const Weather = ({ country }) => {
  const [weather, setWeather] = useState(null)

  const capital = country.capital ? country.capital[0] : null
  const latlng = country.capitalInfo?.latlng || country.latlng

  useEffect(() => {
    if (!latlng) {
      return
    }
    const [lat, lon] = latlng
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`
      )
      .then(response => {
        setWeather(response.data)
      })
  }, [latlng])

  if (!weather) {
    return null
  }

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>temperature {weather.main.temp} °C</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const Country = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital ? country.capital[0] : 'n/a'}</p>
      <p>area {country.area}</p>
      <h3>languages</h3>
      <ul>
        {Object.values(country.languages).map(language =>
          <li key={language}>{language}</li>
        )}
      </ul>
      <img
        src={country.flags.png}
        alt={country.flags.alt || `flag of ${country.name.common}`}
        width="150"
      />
      <Weather country={country} />
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleQueryChange = (event) => {
    setQuery(event.target.value)
    setSelected(null)
  }

  const matches = query === ''
    ? []
    : countries.filter(country =>
        country.name.common.toLowerCase().includes(query.toLowerCase())
      )

  const renderResult = () => {
    if (query === '') {
      return null
    }
    if (selected) {
      return <Country country={selected} />
    }
    if (matches.length > 10) {
      return <p>Too many matches, specify another filter</p>
    }
    if (matches.length === 1) {
      return <Country country={matches[0]} />
    }
    if (matches.length === 0) {
      return <p>No matches</p>
    }
    return (
      <div>
        {matches.map(country =>
          <div key={country.name.common}>
            {country.name.common}
            <button onClick={() => setSelected(country)}>show</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      find countries <input value={query} onChange={handleQueryChange} />
      {renderResult()}
    </div>
  )
}

export default App