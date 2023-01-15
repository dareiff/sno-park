/* eslint-disable @next/next/no-img-element */
// A component that displays the current weather and weather forecast for next 2 and 6 hours for a given SnoPark. This component is used in the SnoParkCard component.
import React from 'react';
import styles from '../styles/Home.module.css';

interface WeatherBlockI {
    location: string;
    gpsFromJSON?: string;
}

const matchWeatherIcon = (icon: string) => {
    let matching_weather_icon = '';
    if (icon == '01d') {
        matching_weather_icon = 'clear';
    } else if (icon == '01n') {
        matching_weather_icon = 'nt_sunny';
    } else if (icon == '02d') {
        matching_weather_icon = 'partlycloudy';
    } else if (icon == '02n') {
        matching_weather_icon = 'nt_partlycloudy';
    } else if (icon == '03d') {
        matching_weather_icon = 'cloudy';
    } else if (icon == '03n') {
        matching_weather_icon = 'nt_cloudy';
    } else if (icon == '04d') {
        matching_weather_icon = 'mostlycloudy';
    } else if (icon == '04n') {
        matching_weather_icon = 'nt_mostlycloudy';
    } else if (icon == '09d') {
        matching_weather_icon = 'chancerain';
    } else if (icon == '09n') {
        matching_weather_icon = 'nt_chancerain';
    } else if (icon == '10d') {
        matching_weather_icon = 'rain';
    } else if (icon == '10n') {
        matching_weather_icon = 'nt_rain';
    } else if (icon == '11d') {
        matching_weather_icon = 'tstorms';
    } else if (icon == '11n') {
        matching_weather_icon = 'nt_tstorms';
    } else if (icon == '13d') {
        matching_weather_icon = 'snow';
    } else if (icon == '13n') {
        matching_weather_icon = 'nt_snow';
    } else if (icon == '50d') {
        matching_weather_icon = 'fog';
    } else if (icon == '50n') {
        matching_weather_icon = 'nt_fog';
    } else {
        matching_weather_icon = 'clear';
    }
    return `weather_icons/${matching_weather_icon}.svg`;
};

export default function WeatherBlock(props: WeatherBlockI) {
    // rough sketch of the currentWeather object/interface
    interface CurrentWeatherI {
        temp: number;
        icon: string;
        snowInSixHours?: boolean;
        snowAmount?: number;
    }

    const [currentWeather, setCurrentWeather] =
        React.useState<null | CurrentWeatherI>(null);
    const [forecastWeather, setForecastWeather] =
        React.useState<null | CurrentWeatherI>(null);

    React.useEffect(() => {
        //Get the weather for current location
        let lat = 0;
        let lon = 0;

        // get the weather for the snopark using openweathermap
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_GEO_API_KEY;
        const apiKeyTwo = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
        console.log(apiKey);
        //get geocoded location from openweathermap
        const geourl = `https://api.openweathermap.org/geo/1.0/zip?zip=${props.location.substring(
            props.location.length - 5
        )}&limit=1&appid=${apiKey}`;

        fetch(geourl)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                lat = data.lat;
                lon = data.lon;
            })
            .then(() => {
                fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKeyTwo}`
                )
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.main) {
                            setCurrentWeather({
                                temp: data.main.temp.toFixed(0),
                                icon: data.weather[0].icon,
                            });
                        } else {
                            console.log('No weather data');
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKeyTwo}`
                )
                    .then((response) => response.json())
                    .then((data) => {
                        let snow = false;
                        let snowAmount = 0;

                        for (let i = 0; i < 2; i++) {
                            if (data.list === undefined) {
                                console.log('No weather data', props.location);
                                return;
                            }
                            // TODO: data.list might be undefined
                            if ('snow' in data.list[i]) {
                                snow = true;
                                snowAmount += data.list[i].snow['3h'];
                                console.log(
                                    'SNOW amount:',
                                    data.list[i].snow['3h'] + ' inches',
                                    snowAmount
                                );
                            }
                        }
                        setForecastWeather({
                            temp: data.list[2].main.temp.toFixed(0),
                            icon: data.list[2].weather[0].icon,
                            snowInSixHours: snow,
                            snowAmount: snowAmount,
                        });
                        console.log(snowAmount);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            });
    }, [props.location]);

    if (currentWeather === null) {
        return null;
    }

    return (
        <div className={styles.weather}>
            <h3>Weather</h3>
            <div className={styles.weatherBlock}>
                <div className={styles.weatherBlockCurrent}>
                    <span>Now:</span>
                    <div className={styles.weatherBlockCurrentTemp}>
                        {currentWeather ? `${currentWeather.temp}°` : 'Loading'}
                    </div>
                    <div className={styles.weatherBlockCurrentIcon}>
                        {currentWeather ? (
                            <img
                                alt='weather icon'
                                src={matchWeatherIcon(currentWeather.icon)}
                                width={50}
                                height={50}
                            />
                        ) : (
                            'Loading'
                        )}
                    </div>
                </div>
                <div className={styles.snow}>
                    {forecastWeather?.snowInSixHours &&
                    forecastWeather?.snowAmount !== undefined ? (
                        <div
                            className={styles.snowWarning}
                            style={
                                forecastWeather?.snowAmount > 1
                                    ? {
                                          borderStyle: 'dashed',
                                      }
                                    : {
                                          borderStyle: 'solid',
                                      }
                            }
                        >
                            <span>Snow!</span>
                            <span>
                                {forecastWeather.snowAmount.toFixed(0) === '0'
                                    ? '< 1"'
                                    : forecastWeather.snowAmount.toFixed(0) +
                                      '"'}
                            </span>
                        </div>
                    ) : (
                        <span>No Snow</span>
                    )}
                </div>
                <div className={styles.weatherBlockCurrent}>
                    <span>6 Hours:</span>
                    <div className={styles.weatherBlockCurrentTemp}>
                        {forecastWeather
                            ? `${forecastWeather.temp}°`
                            : 'Loading'}
                    </div>
                    <div className={styles.weatherBlockCurrentIcon}>
                        {forecastWeather ? (
                            <img
                                alt='weather icon'
                                src={matchWeatherIcon(forecastWeather.icon)}
                                width={50}
                                height={50}
                            />
                        ) : (
                            'Loading'
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
