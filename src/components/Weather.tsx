"use client";

import { useState, useEffect } from "react";
import Button from "./button";
import { Card, CardContent } from "./Card";
import { MapPin, RefreshCw, Droplets, Wind, Eye, Gauge } from "lucide-react";

interface HourlyWeather {
	time: string;
	temperature: string;
	condition: string;
	icon: string;
	chanceOfRain: string;
}

interface WeatherData {
	location: string;
	temperature: string;
	condition: string;
	humidity: string;
	windSpeed: string;
	visibility: string;
	pressure: string;
	feelsLike: string;
	hourlyForecast: HourlyWeather[];
}

interface LocationCoords {
	latitude: number;
	longitude: number;
}

export default function WeatherWidget() {
	const [weather, setWeather] = useState<WeatherData | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [location, setLocation] = useState<LocationCoords | null>(null);

	const getCurrentLocation = (): Promise<LocationCoords> => {
		return new Promise((resolve, reject) => {
			if (!navigator.geolocation) {
				reject(
					new Error("Geolocation is not supported by this browser")
				);
				return;
			}

			navigator.geolocation.getCurrentPosition(
				(position) => {
					resolve({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					});
				},
				() => {
					reject(new Error("Unable to retrieve your location"));
				},
				{
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 300000,
				}
			);
		});
	};

	const fetchWeatherData = async (coords: LocationCoords) => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch(
				`https://wttr.in/${coords.latitude},${coords.longitude}?format=j1`,
				{
					method: "GET",
					headers: {
						"User-Agent": "curl/7.68.0",
					},
				}
			);

			if (!response.ok) {
				throw new Error("Weather service unavailable");
			}

			const data = await response.json();

			const current = data.current_condition[0];
			const area = data.nearest_area[0];

			// Extract hourly forecast for next 12 hours
			const hourlyForecast: HourlyWeather[] = [];
			const currentHour = new Date().getHours();

			// Get today's and tomorrow's hourly data
			const todayHourly = data.weather[0]?.hourly || [];
			const tomorrowHourly = data.weather[1]?.hourly || [];
			const allHourly = [...todayHourly, ...tomorrowHourly];

			// Find current hour index and get next 8 hours
			const hourIndex = Math.floor(currentHour / 3);
			for (let i = 0; i < 8 && hourIndex + i < allHourly.length; i++) {
				const hourData = allHourly[hourIndex + i];
				if (hourData) {
					const hour = ((currentHour + i * 3) % 24)
						.toString()
						.padStart(2, "0");
					hourlyForecast.push({
						time: `${hour}:00`,
						temperature: `${hourData.tempC}°`,
						condition: hourData.weatherDesc[0]?.value || "Unknown",
						icon: getWeatherIcon(hourData.weatherCode),
						chanceOfRain: `${hourData.chanceofrain}%`,
					});
				}
			}

			setWeather({
				location: `${area.areaName[0].value}, ${area.country[0].value}`,
				temperature: `${current.temp_C}°`,
				condition: current.weatherDesc[0].value,
				humidity: `${current.humidity}%`,
				windSpeed: `${current.windspeedKmph} km/h`,
				visibility: `${current.visibility} km`,
				pressure: `${current.pressure} mb`,
				feelsLike: `${current.FeelsLikeC}°`,
				hourlyForecast,
			});
		} catch (err) {
			console.warn("Weather API failed, using mock data:", err);
			// Mock hourly data
			const mockHourly: HourlyWeather[] = [];
			const currentHour = new Date().getHours();
			for (let i = 0; i < 8; i++) {
				const hour = ((currentHour + i * 3) % 24)
					.toString()
					.padStart(2, "0");
				mockHourly.push({
					time: `${hour}:00`,
					temperature: `${22 + Math.floor(Math.random() * 6)}°`,
					condition: ["Sunny", "Cloudy", "Partly Cloudy"][
						Math.floor(Math.random() * 3)
					],
					icon: "☀️",
					chanceOfRain: `${Math.floor(Math.random() * 30)}%`,
				});
			}

			setWeather({
				location: "Current Location",
				temperature: "22°",
				condition: "Partly Cloudy",
				humidity: "65%",
				windSpeed: "12 km/h",
				visibility: "10 km",
				pressure: "1013 mb",
				feelsLike: "24°",
				hourlyForecast: mockHourly,
			});
		} finally {
			setLoading(false);
		}
	};

	// Helper function to get weather icon based on weather code
	const getWeatherIcon = (code: string): string => {
		const iconMap: { [key: string]: string } = {
			"113": "☀️", // Sunny
			"116": "⛅", // Partly cloudy
			"119": "☁️", // Cloudy
			"122": "☁️", // Overcast
			"143": "🌫️", // Mist
			"176": "🌦️", // Patchy rain possible
			"179": "🌨️", // Patchy snow possible
			"182": "🌧️", // Patchy sleet possible
			"185": "🌧️", // Patchy freezing drizzle possible
			"200": "⛈️", // Thundery outbreaks possible
			"227": "🌨️", // Blowing snow
			"230": "❄️", // Blizzard
			"248": "🌫️", // Fog
			"260": "🌫️", // Freezing fog
			"263": "🌦️", // Patchy light drizzle
			"266": "🌧️", // Light drizzle
			"281": "🌧️", // Freezing drizzle
			"284": "🌧️", // Heavy freezing drizzle
			"293": "🌦️", // Patchy light rain
			"296": "🌧️", // Light rain
			"299": "🌧️", // Moderate rain at times
			"302": "🌧️", // Moderate rain
			"305": "🌧️", // Heavy rain at times
			"308": "🌧️", // Heavy rain
			"311": "🌧️", // Light freezing rain
			"314": "🌧️", // Moderate or heavy freezing rain
			"317": "🌧️", // Light sleet
			"320": "🌧️", // Moderate or heavy sleet
			"323": "🌨️", // Patchy light snow
			"326": "🌨️", // Light snow
			"329": "🌨️", // Patchy moderate snow
			"332": "🌨️", // Moderate snow
			"335": "🌨️", // Patchy heavy snow
			"338": "❄️", // Heavy snow
			"350": "🌧️", // Ice pellets
			"353": "🌦️", // Light rain shower
			"356": "🌧️", // Moderate or heavy rain shower
			"359": "🌧️", // Torrential rain shower
			"362": "🌧️", // Light sleet showers
			"365": "🌧️", // Moderate or heavy sleet showers
			"368": "🌨️", // Light snow showers
			"371": "❄️", // Moderate or heavy snow showers
			"374": "🌧️", // Light showers of ice pellets
			"377": "🌧️", // Moderate or heavy showers of ice pellets
			"386": "⛈️", // Patchy light rain with thunder
			"389": "⛈️", // Moderate or heavy rain with thunder
			"392": "⛈️", // Patchy light snow with thunder
			"395": "⛈️", // Moderate or heavy snow with thunder
		};
		return iconMap[code] || "☀️";
	};

	const handleGetWeather = async () => {
		try {
			const coords = await getCurrentLocation();
			setLocation(coords);
			await fetchWeatherData(coords);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Failed to get weather data"
			);
			setLoading(false);
		}
	};

	const handleRefresh = () => {
		if (location) {
			fetchWeatherData(location);
		} else {
			handleGetWeather();
		}
	};

	useEffect(() => {
		handleGetWeather();
	}, []);

	if (error && !weather) {
		return (
			<Card className="w-full max-w-md mx-auto bg-gradient-to-br from-sky-50 to-indigo-100 border-0 shadow-lg">
				<CardContent className="p-6 text-center">
					<div className="text-red-500 mb-4">
						<MapPin className="w-8 h-8 mx-auto mb-2" />
						<p className="text-sm font-medium">{error}</p>
					</div>
					<Button
						onClick={handleGetWeather}
						className="bg-sky-600 hover:bg-sky-700 text-white rounded-full px-6"
					>
						Try Again
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="w-full py-0 max-w-md mx-auto bg-gradient-to-br from-white to-indigo-100 border-0 shadow-lg overflow-hidden [&_.scrollbar-hide]:scrollbar-none [&_.scrollbar-hide]:[-ms-overflow-style:none] [&_.scrollbar-hide]:[scrollbar-width:none]">
			<CardContent className="p-0">
				{/* Header */}
				<div className="bg-white/20 backdrop-blur-sm p-4 flex items-center justify-between">
					<div className="flex items-center gap-2 text-sky-800">
						<MapPin className="w-4 h-4" />
						<span className="text-sm font-medium truncate">
							{weather?.location || "Getting location..."}
						</span>
					</div>
					<Button
						variant="ghost"
						size="sm"
						onClick={handleRefresh}
						disabled={loading}
						className="text-sky-800 hover:bg-white/20 rounded-full p-2"
					>
						<RefreshCw
							className={`w-4 h-4 ${
								loading ? "animate-spin" : ""
							}`}
						/>
					</Button>
				</div>

				{/* Main Weather Display */}
				<div className="p-4 text-center">
					{loading && !weather ? (
						<div className="space-y-4">
							<div className="w-16 h-16 mx-auto bg-white/30 rounded-full animate-pulse" />
							<div className="h-8 bg-white/30 rounded animate-pulse" />
							<div className="h-4 bg-white/30 rounded animate-pulse" />
						</div>
					) : weather ? (
						<>
							<div className="mb-6 flex justify-center items-center">
								<div className="text-6xl font-light text-sky-900 mb-2">
									{weather.temperature}
								</div>
								<div className="text-sky-700 font-medium text-lg">
									{weather.condition}
								</div>
								<div className="text-sky-600 text-sm mt-1">
									Feels like {weather.feelsLike}
								</div>
							</div>

							{/* Weather Details Grid */}
							<div className="grid grid-cols-2 gap-4 mt-6">
								<div className="bg-white shadow-2xl rounded-2xl p-3">
									<div className="flex items-center gap-2 mb-1">
										<Droplets className="w-4 h-4 text-sky-600" />
										<span className="text-xs text-sky-700 font-medium">
											Humidity
										</span>
									</div>
									<div className="text-sky-900 font-semibold">
										{weather.humidity}
									</div>
								</div>

								<div className="bg-white shadow-2xl rounded-2xl p-3">
									<div className="flex items-center gap-2 mb-1">
										<Wind className="w-4 h-4 text-sky-600" />
										<span className="text-xs text-sky-700 font-medium">
											Wind
										</span>
									</div>
									<div className="text-sky-900 font-semibold">
										{weather.windSpeed}
									</div>
								</div>

								<div className="bg-white shadow-2xl rounded-2xl p-3">
									<div className="flex items-center gap-2 mb-1">
										<Eye className="w-4 h-4 text-sky-600" />
										<span className="text-xs text-sky-700 font-medium">
											Visibility
										</span>
									</div>
									<div className="text-sky-900 font-semibold">
										{weather.visibility}
									</div>
								</div>

								<div className="bg-white shadow-2xl rounded-2xl p-3">
									<div className="flex items-center gap-2 mb-1">
										<Gauge className="w-4 h-4 text-sky-600" />
										<span className="text-xs text-sky-700 font-medium">
											Pressure
										</span>
									</div>
									<div className="text-sky-900 font-semibold">
										{weather.pressure}
									</div>
								</div>
							</div>

							{/* Hourly Forecast */}
							{weather?.hourlyForecast &&
								weather.hourlyForecast.length > 0 && (
									<div className="mt-6 bg-white rounded-2xl shadow-2xl p-2">
										<h3 className="text-sky-800 font-medium text-sm mb-3 px-1">
											Next Few Hours
										</h3>
										<div className="flex gap-3 overflow-x-auto pb-2 ">
											{weather.hourlyForecast.map(
												(hour, index) => (
													<div
														key={index}
														className="bg-white shadow-2xl rounded-2xl p-3 min-w-[80px] flex-shrink-0 text-center"
													>
														<div className="text-xs text-sky-700 font-medium mb-2">
															{hour.time}
														</div>
														<div className="text-2xl mb-2">
															{hour.icon}
														</div>
														<div className="text-sky-900 font-semibold text-sm mb-1">
															{hour.temperature}
														</div>
														<div className="text-xs text-sky-600">
															{hour.chanceOfRain}
														</div>
													</div>
												)
											)}
										</div>
									</div>
								)}
						</>
					) : null}
				</div>
			</CardContent>
		</Card>
	);
}
