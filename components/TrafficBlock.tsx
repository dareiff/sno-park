import React from "react";
import styles from "../styles/Home.module.css";

interface DistancePropsI {
    deviceLocation: GeolocationPosition | null;
    location: string;
}

export default function TrafficBlock(props: DistancePropsI) {
    const [travelTime, setTravelTime] = React.useState<number>(0);

    const getLatLongFromAddress = async (address: string) => {
        const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        let lat = 0;
        let lng = 0;

        await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleMapsApiKey}`
        )
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                lat = data.results[0].geometry.location.lat;
                lng = data.results[0].geometry.location.lng;
            });

        return { lat, lng };
    };

    const getTravelTime = async (
        deviceLocation: GeolocationPosition,
        location: string
    ) => {
        const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        const { lat, lng } = await getLatLongFromAddress(location);
        const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append(
            "X-Goog-Api-Key",
            googleMapsApiKey ? googleMapsApiKey : ""
        );
        headers.append(
            "X-Goog-FieldMask",
            "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.travelAdvisory"
        );
        fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                origin: {
                    location: {
                        latLng: {
                            latitude: deviceLocation.coords.latitude,
                            longitude: deviceLocation.coords.longitude,
                        },
                    },
                },
                destination: {
                    location: {
                        latLng: {
                            latitude: lat,
                            longitude: lng,
                        },
                    },
                },
                travelMode: "DRIVE",
                routingPreference: "TRAFFIC_AWARE",
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                const seconds = data.routes
                    ? data.routes[0].duration.split("s")[0]
                    : 0;
                setTravelTime(seconds);
                console.log(data);
            });

        return 0;
    };

    React.useEffect(() => {
        if (props.deviceLocation === null || props.location === "") {
            return;
        }
        getTravelTime(props.deviceLocation, props.location);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.deviceLocation, props.location]);

    return (
        <div className={styles.weather}>
            <h3>Travel Time</h3>
            <p style={{ textAlign: "center" }}>
                {(travelTime / 60).toFixed(0)} minutes
            </p>
        </div>
    );
}
