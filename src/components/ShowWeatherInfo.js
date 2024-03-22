import React from 'react'

const ShowWeatherInfo = (props) => {
  return (
    <div className="info-group">
        <h3 className="sub-layer">{ props.title }</h3>
    </div>
  )
}

export default ShowWeatherInfo
