"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Container,
  Paper,
  Box,
  Stack,
  CircularProgress,
  Autocomplete,
  TextField,
} from "@mui/material";
import Dashboard from "@/app/components/Dashboard";
import axios from "axios";
import { FaCloud, FaWind, FaTemperatureHigh, FaWater } from "react-icons/fa";
import { WeatherData, PollutionData, ForecastData, UVIndexData, Unit } from "./types";
import ToggleSwitch from "./components/ToggleSwitch";
import { topCities } from "./constants";

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [pollution, setPollution] = useState<PollutionData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [uvIndex, setUVIndex] = useState<UVIndexData | null>(null);
  const [unit, setUnit] = useState<Unit>("metric");
  const [loading, setLoading] = useState<boolean>(false);
  const [city, setCity] = useState<string>("Karachi");

  const fetchWeatherData = async (cityName: string, unit: Unit) => {
    setLoading(true);
    try {
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unit}&appid=${apiKey}`
      );
      const pollutionRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherRes.data.coord.lat}&lon=${weatherRes.data.coord.lon}&appid=${apiKey}`
      );
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=${unit}&appid=${apiKey}`
      );
      const uvIndexRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/uvi?lat=${weatherRes.data.coord.lat}&lon=${weatherRes.data.coord.lon}&appid=${apiKey}`
      );

      setWeather(weatherRes.data);
      setPollution(pollutionRes.data);
      setForecast(forecastRes.data);
      setUVIndex(uvIndexRes.data);
    } catch (error) {
      console.error("Error fetching weather data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(city, unit);
  }, [unit, city]);

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
  };

  const handleCityChange = (event: any, value: string | null) => {
    if (value) setCity(value);
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Paper sx={{ padding: 4, marginBottom: 4, backgroundColor: "#f5f5f5", borderRadius: 3, boxShadow: 3 }}>
        <Typography
          variant="h5"
          component="h3"
          sx={{
            fontWeight: "bold",
            fontFamily: "Arial, sans-serif",
            letterSpacing: "1px",
            textAlign: "center",
            marginBottom: 2,
            color: "#333",
          }}
        >
          Weather Dashboard
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
          <Autocomplete
            options={topCities}
            freeSolo
            value={city}
            onChange={handleCityChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search City"
                variant="outlined"
                size="small"
                sx={{ width: 300 }}
              />
            )}
          />

          <ToggleSwitch
            label="Celsius / Fahrenheit"
            checked={unit === "imperial"}
            onChange={toggleUnit}
          />
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <CircularProgress />
        </Box>
      ) : weather && pollution && forecast && uvIndex ? (
        <Stack spacing={4}>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <Card sx={{ boxShadow: 4, backgroundColor: "#e3f2fd" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <FaCloud style={{ marginRight: "8px" }} />
                  Current Weather
                </Typography>
                <Typography variant="body1">
                  <FaTemperatureHigh size={20} style={{ marginRight: "8px" }} />
                  Temperature: {weather.main.temp}°{unit === "metric" ? "C" : "F"}
                </Typography>
                <Typography variant="body1">
                  <FaWater size={20} style={{ marginRight: "8px" }} />
                  Humidity: {weather.main.humidity}%
                </Typography>
                <Typography variant="body1">
                  <FaWind size={20} style={{ marginRight: "8px" }} />
                  Pressure: {weather.main.pressure} hPa
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ boxShadow: 4, backgroundColor: "#ffecb3" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Air Pollution
                </Typography>
                <Typography variant="body1">
                  AQI: {pollution.list[0].main.aqi}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ boxShadow: 4, backgroundColor: "#f0f4c3" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  UV Index
                </Typography>
                <Typography variant="body1">UV Index: {uvIndex.value}</Typography>
              </CardContent>
            </Card>
          </Box>

          <Dashboard
            weather={weather}
            pollution={pollution}
            forecast={forecast}
            uvIndex={uvIndex}
            unit={unit}
          />
        </Stack>
      ) : (
        <Typography variant="h6" align="center">
          No data available
        </Typography>
      )}
    </Container>
  );
}
