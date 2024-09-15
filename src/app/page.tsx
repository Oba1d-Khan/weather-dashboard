"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Container,
  Paper,
  Box,
  Switch,
  Stack,
  CircularProgress,
} from "@mui/material";
import Dashboard from "@/app/components/Dashboard";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { FaCloud, FaWind, FaTemperatureHigh, FaWater } from "react-icons/fa";
import { WeatherData, PollutionData, ForecastData, UVIndexData, Unit } from "./types";

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

const ModernSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#a1c4fd',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
  },
  '& .MuiSwitch-track': {
    borderRadius: 20 / 2,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#a1c4fd',
  },
}));

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [pollution, setPollution] = useState<PollutionData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [uvIndex, setUVIndex] = useState<UVIndexData | null>(null);
  const [unit, setUnit] = useState<Unit>("metric");
  const [loading, setLoading] = useState<boolean>(false);

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
    fetchWeatherData("Karachi", unit);
  }, [unit]);

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Paper sx={{ padding: 4, marginBottom: 4, backgroundColor: "#f5f5f5", borderRadius: 3, boxShadow: 3 }}>
        <Typography
          variant="h3"
          component="h1"
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

        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 2 }}>
          <Typography sx={{ mr: 2 }}>Celsius</Typography>
          <ModernSwitch checked={unit === "imperial"} onChange={toggleUnit} />
          <Typography sx={{ ml: 2 }}>Fahrenheit</Typography>
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
