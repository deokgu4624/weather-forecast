import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Button, Card, Container, Form, FormControl, InputGroup, Col, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts'
import clearDay from '../src/img/clearDay.svg'
import clearNight from '../src/img/clearNight.svg'
import clouds from '../src/img/clouds.svg'
import rain from '../src/img/rain.svg'
import snow from '../src/img/snow.svg'
import mist from '../src/img/mist.svg'

function App() {
  const [text, setText] = useState();
  const [city, setCity] = useState('Seoul');
  const [data, setData] = useState([]);
  const [geo, setGeo] = useState([{'lat':37.5666791, 'lon':126.9782914}]);
  const [data2, setData2] = useState([]);
  const [tabs, setTabs] = useState('Temp')

  //data
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

  //chart
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

  const onChange =(e)=>{
      setText(e.target.value);
  }
  const handleKeyPress = e => {
    if(e.key === 'Enter') {
      setCity(text)
    }
  }

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

  return (
    <Container>
      <Row className={'inputWrapper'}>
        <Col lg={3}>
          <InputGroup className="mb-3">
            <Form.Control onChange={onChange} onKeyPress={handleKeyPress}/>
            <InputGroup.Text id="basic-addon1" className={'search'} onClick={()=>{setCity(text)}}>Search🔍</InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>
      <section>
        <Card className={'mainWeather card'}>
          <Card.Body>
            <Row className={'align-items-center'}>
              <Col lg={3} className={'imgWrapper'}>
                {weatherMain === 'Clear' && mainDt >= 6 && mainDt < 18 ? <img src={clearDay} alt='clear' /> :
                weatherMain === 'Clear' && mainDt >= 18 || weatherMain === 'Clear' && mainDt < 6 ? <img src={clearNight} alt='clear' /> :
                weatherMain === 'Clouds' ? <img src={clouds} alt='clouds' /> :
                weatherMain === 'Rain' ? <img src={rain} alt='rain' /> :
                weatherMain === 'Snow' ? <img src={snow} alt='snow' /> :
                weatherMain === 'Mist' || 'Smoke' || 'Haze' || 'Dust' || 'Fog' || 'Sand' || 'Dust' || 'Ash' || 'Sqaull' || 'Tornado' ? 
                <img src={mist} alt='mist' /> : null
                }
              </Col>
              <Col lg={3}>
                <h3>{name}</h3>
                <h1>{weatherMain}</h1>
                <h1>{temp}°<span style={{fontSize:'15px'}}>{tempMin}°/{tempMax}°</span></h1>
              </Col>
              <Col className={'subWrapper'} lg={6}>
                <Col md={3}>
                  <Card className={'sub'}>
                    <Card.Body>
                      Feels like : {feelsLike}°
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className={'sub'}>
                    <Card.Body>
                      Pressure : {pressure} hPa
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className={'sub'}>
                    <Card.Body>
                      Humidity : {humidity}%
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className={'sub'}>
                    <Card.Body>
                    Wind : {windSpeed} m/s, {windDegree}°
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className={'sub'}>
                    <Card.Body>
                    sunrise : {sunrise.toString()}
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className={'sub'}>
                    <Card.Body>
                      sunset :{sunset.toString()}
                    </Card.Body>
                  </Card>
                </Col>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </section>
      <section>
        <Card>
          <Card.Body className='menuWrapper'>
          <span className={'tabs'} onClick={()=>{
            setTabs('Temp')
          }}>Temp</span>
          <span className={'category'}>|</span>
          <span className={'tabs'} onClick={()=>{
            setTabs('Pop')
          }}>Pop</span>
          <span className={'category'}>|</span>
          <span className={'tabs'} onClick={()=>{
            setTabs('Humidity')
          }}>Humidity</span>
          <span className={'category'}>|</span>
          <span className={'tabs'} onClick={()=>{
            setTabs('Wind')
          }}>Wind</span>
          </Card.Body>
          {tabs === 'Temp' ?
          <Card>
            <Card.Body>
              <Chart options={options} series={options.series} type="line" height={200} />
            </Card.Body>
          </Card> :
          tabs === 'Pop' ?
          <Card>
            <Card.Body>
              <Chart options={options2} series={options2.series} type="line" height={200} />
            </Card.Body>
          </Card> :
          tabs === 'Humidity' ?
          <Card>
            <Card.Body>
              <Chart options={options3} series={options3.series} type="bar" height={200} />
            </Card.Body>
          </Card> :
          tabs === 'Wind' ?
          <Card>
            <Card.Body>
              <Chart options={options4} series={options4.series} type="bar" height={200} />
            </Card.Body>
          </Card> : null}
        </Card>
      </section>
      <section>
        <h4>Daily Forecast</h4>
        <Row className={'justify-content-center'}>
          {dailyWeather?.map(function(item, index){
            return (
              <Col xs={3} md={1}>
                <Card className={'daily'} key={index} >
                  <Card.Body className={'dailyBorder'}>
                  {(dailyDt?.[index])}
                  {item === 'Clear' ? <img src={clearDay} className={'dailyImg'} alt='clear' /> :
                  item === 'Clouds' ? <img src={clouds} className={'dailyImg'} alt='clouds' /> :
                  item === 'Rain' ? <img src={rain} className={'dailyImg'} alt='rain' /> :
                  item === 'Snow' ? <img src={snow} className={'dailyImg'} alt='snow' /> :
                  item === 'Mist' || 'Smoke' || 'Haze' || 'Dust' || 'Fog' || 'Sand' || 'Dust' || 'Ash' || 'Sqaull' || 'Tornado' ?
                  <img className={'dailyImg'} src={mist} alt='mist' /> : null}
                  {dailyTempMin[index]}°/{dailyTempMax[index]}°
                  </Card.Body>
                </Card>
              </Col>
              )
          })}
        </Row>
      </section>
    </Container>
  );
}

export default App;
