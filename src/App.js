import './App.css';
import { useEffect, useState } from 'react';
import ShowWeatherInfo from './components/ShowWeatherInfo';
import WeatherButton from './components/WeatherButton';
import ShowCityImg from './components/ShowCityImg';
import ClipLoader from "react-spinners/ClipLoader";

const API_KEY = '35f10e1030da0742c9971b415b678c16'

const locationInfo = {
  'Seoul': {
    kor: '서울시', name: 'Seoul', lat: '37.566', lon: '126.9784', temp: '', desc: '', img: ['N서울타워', '경복궁', '광화문', '동대문디자인플라자', '국립중앙박물관', '북촌한옥마을']
  },
  'Busan': {
    kor: '부산시', name: 'Busan', lat: '35.166668', lon: '129.066666', temp: '', desc: '', img: ['감천문화마을', '해동용궁사', '흰여울문화마을','용두산공원','태종대유원지', '국제시장']
  },
  'Daejeon': {
    kor: '대전시', name: 'Daejeon', lat: '36.35', lon: '127.385', temp: '', desc: '', img: ['성심당', '국립중앙과학관', '대전스카이로드', '엑스포다리', '대전오월드', '대전시립미술관']
  },
  'Jeju': {
    kor: '제주시', name: 'Jeju', lat: '33.50972', lon: '126.52194', temp: '', desc: '', img: ['금오름', '만장굴', '비자림', '아르떼뮤지엄', '제주절물자연휴양림', '함덕해수욕장']
  },
  'Now': {
    kor: '현재 위치', name: 'Now', lat: '', lon: '', temp: '', desc: '', img: ['경주시', '인천광역시', '대구광역시', '전주시', '광주광역시', '속초시']
  }
}

let today;
const waitTime = 1;

function App() {

  const [selectedLocation, setSelectedLocation] = useState('Now'); // 초기 선택 위치
  const [selectedImg, setSelectedImg] = useState(locationInfo['Now'].img[0]); 
  const [mainTitle, setMainTitle] = useState('위치 권한을 허용해주세요');
  const [loading, setLoading] = useState(false);
  
  const getRandomNumber=()=>{
    return Math.trunc(Math.random() * 6);
  }

  const generateTitle=(name, temp, desc)=>{
    let title = `${ name }` +": "+ `${((temp + 40) / 1.8 - 40).toFixed(2)}` + "℃, " + `${ temp }`+ "Ｆ, " + `${ desc }`;
    setMainTitle(title);
  }

  const chooseImg=(loc)=>{
    let num = getRandomNumber();
    setSelectedImg(locationInfo[loc].img[num])
  }

  const getLocation=()=>{
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  const showPosition=(position)=>{
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    locationInfo['Now'].lat = lat;
    locationInfo['Now'].lon = lon;
  }

  const getWeatherByCurrentLocation= async (lat, lon, state)=>{
    const url = new URL(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    setLoading(true);

    try{
      let response = await fetch(url);
      let APIdata = await response.json();

      setLoading(false);
      console.log(`======${state}======`);
      console.log(APIdata);

      locationInfo[state].name = APIdata.name;
      locationInfo[state].temp = APIdata.main.temp
      locationInfo[state].desc = APIdata.weather[0].description

      generateTitle(locationInfo[state].name, locationInfo[state].temp, locationInfo[state].desc);
      
    }
    catch(error){
      console.log(error);
    }  
  }

  useEffect(()=>{

    today = new Date();

    let standard = new Date(localStorage.getItem('standard'));

    if (standard === null || locationInfo['Now'].name === 'Now'){

      localStorage.setItem('standard', today);

      chooseImg('Now');
      getLocation();
      
      getWeatherByCurrentLocation(locationInfo['Now'].lat, locationInfo['Now'].lon, 'Now');
    }
    else {

      if (isTimeDifferenceGreaterThanOneMinute(standard, today)){
        
        localStorage.setItem('standard', today);

        chooseImg('Now');
        getLocation();
        
        getWeatherByCurrentLocation(locationInfo['Now'].lat, locationInfo['Now'].lon, 'Now');
      }
      else {
        
        generateTitle(locationInfo['Now'].name, locationInfo['Now'].temp, locationInfo['Now'].desc);
      }
    }
  }, [])

  const changeLocation=(loc)=>{

    setSelectedLocation(loc);
    
    chooseImg(loc);
    if (loc === 'Now'){
      getLocation();
    }

    let lat = locationInfo[loc].lat;
    let lon = locationInfo[loc].lon;

    today = new Date();

    let temp_time = new Date(localStorage.getItem(loc));

    if (temp_time === null){

      localStorage.setItem(loc, today);

      getWeatherByCurrentLocation(lat, lon, loc);
    }
    else {

      if (isTimeDifferenceGreaterThanOneMinute(temp_time, today)){
        
        localStorage.setItem(loc, today);
        
        getWeatherByCurrentLocation(lat, lon, loc);

      }
      else {

        generateTitle(locationInfo[loc].name, locationInfo[loc].temp, locationInfo[loc].desc);

      }
    }
  }

  const isTimeDifferenceGreaterThanOneMinute=(stored_time, now)=>{

    // 두 시간 사이의 차이 계산 (밀리초 단위)
    var time_difference = now.getTime() - stored_time.getTime();
  
    // 밀리초를 분 단위로 변환하여 비교
    var minutes_difference = Math.floor(time_difference / (1000 * 60));
  
    // 차이가 1분(waitTime) 이상인지 확인 후 반환
    return minutes_difference >= waitTime;
  }
  
  const cities=['Now', 'Seoul', 'Busan', 'Jeju', 'Daejeon']

  return (
    <div className="main">
      {loading ? (
        <ClipLoader
          color="#ffffff"
          loading={loading}
          size={150}
        />) : (
        <div className="App">
          <ShowCityImg location={selectedLocation} cityImg={ selectedImg }></ShowCityImg>
          <ShowWeatherInfo title={ mainTitle } ></ShowWeatherInfo>
          <WeatherButton className="btn-group" location={selectedLocation} cities={cities} changeLocation={changeLocation}></WeatherButton>
        </div>
        )}
    </div>
  );
}

export default App;
