import React from 'react'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const WeatherButton = ({ location, cities,changeLocation }) => {
  return (
    <div>

        <ButtonGroup aria-label="Basic example">
            {cities.map((item, index) => (
                <Button key={index} onClick={()=>changeLocation(item)} variant={ location === item ? 'dark': "outline-dark" }>{ item }</Button>
            ))}
        </ButtonGroup>
    </div>
  )
}

export default WeatherButton