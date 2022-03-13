# 일기예보 웹사이트
https://weather-forecast12.netlify.app/
## 목차
1. [개요](#개요)
2. [과정](#과정)  
  2.1. [Axios로 도시 이름 검색](#axios로-데이터-받아오기)  
  2.2. [필요한 데이터 가공](#필요한-데이터-가공)  
  2.3. [차트에 데이터 넣기](#차트에-데이터-넣기)  
  2.4. [표 만들기](#표-만들기)  
  2.5. [번역](#번역)  
3. [사용한 라이브러리](#사용한-라이브러리)
## 개요
React, Axios, Openweather API를 사용한 일기예보 웹사이트입니다. 도시별 현재 기상정보, 시간별 예보, 주간 예보 기능이 있습니다. 
![제목 없음](https://user-images.githubusercontent.com/37141223/158065057-78aa1ceb-4f7d-4d0b-b668-e64f632a01dc.png)

시간별 기온 차트입니다.
![제목 없음](https://user-images.githubusercontent.com/37141223/158065610-41a24f69-67f6-429c-ac89-f2036dda13e4.png)

시간별 강수 확률 차트입니다.
![제목 없음](https://user-images.githubusercontent.com/37141223/158065219-4f6368a3-0c2f-4dbd-bf79-715b1a6490ed.png)

시간별 습도 차트입니다.
![제목 없음](https://user-images.githubusercontent.com/37141223/158065490-2c5deda1-da1e-4bd3-ba25-524d826b90fe.png)

시간별 바람 차트입니다.
![제목 없음](https://user-images.githubusercontent.com/37141223/158065561-3c1fc70d-966e-4d33-89d2-d7d404c5f4ad.png)

주간 예보 입니다.
![제목 없음](https://user-images.githubusercontent.com/37141223/158065702-0895691b-da94-4bf9-a4c9-2511771931b3.png)

## 과정
### Axios로 도시 이름 검색
도시를 입력 후 엔터나 검색을 클릭하면 `useState`를 사용해서 입력한 값이 `city` 변수로 들어갑니다.
```javascript
const onChange =(e)=>{
    setText(e.target.value);
}
const handleKeyPress = e => {
  if(e.key === 'Enter') {
    setCity(text)
  }
}
return(
<InputGroup className="mb-3">
  <Form.Control onChange={onChange} onKeyPress={handleKeyPress}/>
  <InputGroup.Text id="basic-addon1" className={'search'} onClick={()=>{setCity(text)}}>Search🔍</InputGroup.Text>
</InputGroup>
)
```

### 좌표 데이터 가져오기
axios로 입력한 도시의 좌표 데이터를 가져옵니다. 도시명이 바뀔 때 마다 실행됩니다. 없는 도시일 경우 `alert`이 뜹니다.
```javascript
useEffect(()=>{
    axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${key}`)
          .then(res =>{
            setGeo(res.data);
          })
          .catch(function(error){
            alert('옳지 않은 도시이름입니다. 영어로 입력해주세요. ex) london');
            window.location.href = "/"
          })
  },[city])
```
### 날씨 데이터 가져오기
가져온 좌표 데이터로 날씨 데이터를 가져옵니다. 좌표가 달라질 때 마다 실행됩니다.
```javascript
useEffect(()=>{
  axios.all
  ([
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${geo?.[0].lat}&lon=${geo?.[0].lon}&appid=${key}`),
    axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${geo?.[0].lat}&lon=${geo?.[0].lon}&appid=${key}`)
  ])
          .then(
            axios.spread((res1, res2) => {
              setData(res1.data)
              setData2(res2.data)
            })
          )
},[geo])
```
### 필요한 데이터 가공
표시될 기상 데이터입니다. 필요한 데이터를 원하는 배열로 만들기위해 주로 `reduce`, `map` 함수가 사용되었습니다.
```javascript
const name = geo?.[0].name
const mainDt = new Date((data2.current?.dt - 32400 + data2.timezone_offset) * 1000).toString().slice(16, 18)
const weatherMain = data.weather?.[0].main
const temp = Math.round(data.main?.temp - 273.15)
const feelsLike = Math.round(data.main?.feels_like - 273.15)
const tempMin = Math.round(data.main?.temp_min - 273.15)
const tempMax = Math.round(data.main?.temp_max - 273.15)
const pressure = data.main?.pressure
const humidity = data.main?.humidity
const windSpeed = data.wind?.speed
const windDegree = data.wind?.deg
const sunrise = new Date(data.sys?.sunrise * 1000).toString().slice(16, 21)
const sunset = new Date(data.sys?.sunset * 1000).toString().slice(16, 21)
const axios = require('axios').default;
const key = '7c2906c41e397f1c8d1db41f311949b2'

const hourlyData = data2.hourly?.reduce(function(acc, cur){
  const dt = cur.dt;
  const temp = cur.temp;
  const pop = cur.pop
  const windSpeed = cur.wind_speed;
  const humidity = cur.humidity
  acc.push({dt, temp, pop, windSpeed, humidity})
  return acc
}, [])
const hour = hourlyData?.map(function(item){
  return new Date((item.dt - 32400 + data2.timezone_offset) * 1000).toString().slice(16,18);
})
const hourlyTemp = hourlyData?.map(function(item){
  return Math.round(item.temp - 273.15)
})
const hourlyPop = hourlyData?.map(function(item){
  return item.pop * 100
})
const hourlyHumidity = hourlyData?.map(function(item){
  return item.humidity
})
const hourlyWindSpeed = hourlyData?.map(function(item){
  return item.windSpeed
})

const dailyData = data2.daily?.reduce(function(acc, cur){
  const dt = cur.dt;
  const tempMax = cur.temp.max;
  const tempMin = cur.temp.min;
  const weather = cur.weather[0].main;
  acc.push({dt, tempMax, tempMin, weather})
  return acc;
}, [])
const dailyWeather = dailyData?.map(function(item){
  return item.weather;
})
const dailyTempMax = dailyData?.map(function(item){
  return Math.round(item.tempMax - 273.15)
})
const dailyTempMin = dailyData?.map(function(item){
  return Math.round(item.tempMin - 273.15)
})
const dailyDt = dailyData?.map(function(item){
  const day = new Date(item.dt * 1000).toString().slice(0, 3);
  return day
})
```
### 차트에 데이터 넣기
`apexcharts` 라이브러리를 사용한 area 차트입니다. 분류해놓은 배열들이 각각 data에 들어갑니다.
```javascript
const options = {
    chart: {
      type: 'line',
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function(val){
        return val +'°'
      }
    },
    series: [{
      name: 'Temp',
      data: hourlyTemp?.slice(0,12)
    }],
    xaxis: {
      categories: hour?.slice(0,12)
    },
    yaxis: {
      show: false,
    },
    stroke: {
      show: true
    }
  }
  const options2 = {
    chart: {
      type: 'line',
      toolbar: {
        show: false,
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val){
        return val +'%'
      }
    },
    series: [{
      name: 'Pop',
      data: hourlyPop?.slice(0,12)
    }],
    xaxis: {
      categories: hour?.slice(0,12)
    },
    yaxis: {
      show: false,
    },
    stroke: {
      show: true
    }
  }
  const options3 = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val){
        return val +'%'
      }
    },
    series: [{
      name: 'Humidity',
      data: hourlyHumidity?.slice(0,12)
    }],
    xaxis: {
      categories: hour?.slice(0,12)
    },
    yaxis: {
      show: false,
    },
    stroke: {
      show: false
    }
  }
  const options4 = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val){
        return val +'m/s'
      }
    },
    series: [{
      name: 'Wind',
      data: hourlyWindSpeed?.slice(0,12)
    }],
    xaxis: {
      categories: hour?.slice(0,12)
    },
    yaxis: {
      show: false,
    },
    stroke: {
      show: false
    }
  }
```

## 사용한 라이브러리
`react` `axios` `react-bootstrap` `apexcharts`
