import React from 'react'

const ShowCityImg = ({cityImg, location}) => {
  return (
    <div className="img-layer" >
        <img src={process.env.PUBLIC_URL + '/img/' + cityImg + '.jpg'} alt={cityImg}></img>
        { location === 'Now' ? (
            <p>당신에게 한국의 {cityImg}를 추천합니다.</p>
        ) : (
            <p>당신에게 {location}의 {cityImg}를 추천합니다.</p>
        )}
    </div>
  )
}

export default ShowCityImg