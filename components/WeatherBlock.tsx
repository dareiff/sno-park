// A component that displays the current weather and weather forecast for next 2 and 6 hours for a given SnoPark. This component is used in the SnoParkCard component.
import React from "react";
import styles from "../styles/Home.module.css";

interface WeatherBlockI {
    location: string;
}

export default function WeatherBlock(props: WeatherBlockI) {
    const [currentWeather, setCurrentWeather] = React.useState<any>(null);

    React.useEffect(() => {
        //Get the weather for current location
        let lat = 0;
        let lon = 0;

        // get the weather for the snopark using openweathermap
        const apiKey = process.env.NEXT_PUBLIC_GEO_API_KEY;
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
            });

        fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKeyTwo}`
        )
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [props.location]);

    if (currentWeather === null) {
        return null;
    }

    return (
        <div className={styles.weatherBlock}>
            <h3>Weather</h3>
            <div className={styles.weatherBlockCurrent}>
                <div className={styles.weatherBlockCurrentTemp}>
                    {currentWeather ? currentWeather.temp : "Loading"}
                </div>
                <div className={styles.weatherBlockCurrentIcon}>
                    {currentWeather ? currentWeather.icon : "Loading"}
                </div>
            </div>
        </div>
    );
}
