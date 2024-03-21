import React from 'react'

const ShowWeatherInfo = (props) => {
  return (
    <div className="info-group">
        <h3 className="sub-layer">{ props.name }: { ((props.temp + 40) / 1.8 - 40).toFixed(2) + "℃"}, { props.temp + "Ｆ" }, { props.desc }</h3>
    </div>
  )
}

export default ShowWeatherInfo
