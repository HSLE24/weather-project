import './App.css';
import { useEffect, useState } from 'react'
import ShowWeatherInfo from './components/ShowWeatherInfo'

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

  const [selectedName, setName] = useState(null);
  const [selectedTemp, setTemp] = useState(null);
  const [selectedDesc, setDesc] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('Now'); // 초기 선택 위치
  const [selectedImg, setSelectedImg] = useState(locationInfo['Now'].img[0]); 
  
  const getRandomNumber=()=>{
    return Math.trunc(Math.random() * 6);
  }


  const getLocation=()=>{

    let num = getRandomNumber();

    setSelectedImg(locationInfo['Now'].img[num])

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  const showPosition=(position)=>{
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    getWeatherByCurrentLocation(lat, lon, 'Now');
  }

  const getWeatherByCurrentLocation= async (lat, lon, state)=>{
    const url = new URL(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);

    try{
      let response = await fetch(url);
      let APIdata = await response.json();

      console.log(`======${state}======`);
      console.log(APIdata);

      locationInfo[state].lat = lat;
      locationInfo[state].lon = lon;
      locationInfo[state].name = APIdata.name;
      locationInfo[state].temp = APIdata.main.temp
      locationInfo[state].desc = APIdata.weather[0].description

      setName(locationInfo[state].name);
      setTemp(locationInfo[state].temp);
      setDesc(locationInfo[state].desc);

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

      getLocation();
    }
    else {

      if (isTimeDifferenceGreaterThanOneMinute(standard, today)){
        
        localStorage.setItem('standard', today);
        getLocation();

      }
      else {
        
        setName(locationInfo['Now'].name);
        setTemp(locationInfo['Now'].temp);
        setDesc(locationInfo['Now'].desc);
      }
    }
  }, [])

  const changeLocation=(loc)=>{

    setSelectedLocation(loc);
    
    let num = getRandomNumber();
    setSelectedImg(locationInfo[loc].img[num])

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

        setName(locationInfo[loc].name);
        setTemp(locationInfo[loc].temp);
        setDesc(locationInfo[loc].desc);

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
  

  return (
    <div className="App main">
      <div className="img-layer" >
        <img src={process.env.PUBLIC_URL + '/img/' + selectedImg + '.jpg'}></img>
        <p>당신에게 {selectedImg}를 추천합니다.</p>
      </div>
      <ShowWeatherInfo name={ selectedName } temp={ selectedTemp } desc={ selectedDesc }></ShowWeatherInfo>
      <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
          <input onClick={()=>changeLocation('Now')} type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked={selectedLocation === 'Now'}/>
          <label class="btn btn-outline-primary" for="btnradio1">현재 위치</label>

          <input onClick={()=>changeLocation('Seoul')} type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" checked={selectedLocation === 'Seoul'}/>
          <label class="btn btn-outline-primary" for="btnradio2">서울시</label>

          <input onClick={()=>changeLocation('Busan')} type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off" checked={selectedLocation === 'Busan'}/>
          <label class="btn btn-outline-primary" for="btnradio3">부산시</label>

          <input onClick={()=>changeLocation('Jeju')} type="radio" class="btn-check" name="btnradio" id="btnradio4" autocomplete="off" checked={selectedLocation === 'Jeju'}/>
          <label class="btn btn-outline-primary" for="btnradio4">제주시</label>

          <input onClick={()=>changeLocation('Daejeon')} type="radio" class="btn-check" name="btnradio" id="btnradio5" autocomplete="off" checked={selectedLocation === 'Daejeon'}/>
          <label class="btn btn-outline-primary" for="btnradio5">대전시</label>
      </div>
    </div>
  );
}

export default App;
