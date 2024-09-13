import { Box, Typography, Container, Paper, Card, CardContent, Divider, Stack, CircularProgress } from "@mui/material";
import { FaTemperatureHigh, FaTint, FaCloudSun, FaSmog } from "react-icons/fa";

const Dashboard = ({ weather, pollution, uvIndex, forecast, unit }) => {
    const convertTemp = (temp) => (unit === 'metric' ? temp : (temp * 9) / 5 + 32).toFixed(2);

    if (!weather || !pollution || !uvIndex || !forecast) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            {/* Current Weather Section */}
            <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Weather in {weather.name}
                </Typography>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="space-between">
                    <Card variant="outlined" sx={{ flex: 1 }}>
                        <CardContent>
                            <FaTemperatureHigh style={{ marginRight: '8px' }} />
                            <Typography variant="h6" component="div" display="flex" alignItems="center">
                                Temperature: {convertTemp(weather.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card variant="outlined" sx={{ flex: 1 }}>
                        <CardContent>
                            <FaTint style={{ marginRight: '8px' }} />
                            <Typography variant="h6" component="div" display="flex" alignItems="center">
                                Humidity: {weather.main.humidity}%
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card variant="outlined" sx={{ flex: 1 }}>
                        <CardContent>
                            <FaSmog style={{ marginRight: '8px' }} />
                            <Typography variant="h6" component="div" display="flex" alignItems="center">
                                Air Quality Index: {pollution.list[0].main.aqi}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card variant="outlined" sx={{ flex: 1 }}>
                        <CardContent>
                            <FaCloudSun style={{ marginRight: '8px' }} />
                            <Typography variant="h6" component="div" display="flex" alignItems="center">
                                UV Index: {uvIndex.value}
                            </Typography>
                        </CardContent>
                    </Card>
                </Stack>
            </Paper>

            <Divider sx={{ my: 4 }} />

            {/* 5-Day Forecast Section */}
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>
                    5-Day Forecast
                </Typography>
                <Stack spacing={2}>
                    {forecast.list.slice(0, 5).map((day, index) => (
                        <Card key={index} variant="outlined" sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                            <Typography variant="body1">Day {index + 1}</Typography>
                            <Typography variant="body1" display="flex" alignItems="center">
                                <FaTemperatureHigh style={{ marginRight: '8px' }} />
                                {convertTemp(day.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
                            </Typography>
                        </Card>
                    ))}
                </Stack>
            </Paper>
        </Container>
    );
};

export default Dashboard;
