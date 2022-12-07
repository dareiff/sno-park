import React from "react";

interface DistancePropsI {
    deviceLocation: GeolocationPosition | null;
    location: string;
}

export default function TrafficBlock(props: DistancePropsI) {
    const [travelTime, setTravelTime] = React.useState(0);

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

    const beginLocation =
        props.deviceLocation !== null
            ? {
                  lat: props.deviceLocation.coords.latitude,
                  lng: props.deviceLocation.coords.longitude,
              }
            : {
                  lat: 47.618538307231326,
                  lng: -122.30765738317513,
              };

    const endLocation = props.location;

    return <div></div>;
}
