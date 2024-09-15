export interface WeatherData {
    coord: {
        lon: number;
        lat: number;
    };
    main: {
        temp: number;
        humidity: number;
        pressure: number;
    };
    name: string;
}

export interface PollutionData {
    list: [
        {
            main: {
                aqi: number;
            };
        }
    ];
}

export interface ForecastData {
    list: {
        main: {
            temp: number;
        };
    }[];
}

export interface UVIndexData {
    value: number;
}

export type Unit = "metric" | "imperial";
