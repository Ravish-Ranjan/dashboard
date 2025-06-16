import { useEffect, useState } from "react";
import AnalogClock from "./components/AnalogClock";
import CalendarIframe from "./components/Calender";
import DigitalClock from "./components/DigitalClock";
import WeatherWidget from "./components/Weather";

function App() {
	const [googleCalenderUrl, setUrl] = useState("");
	const [input, setInput] = useState("");

	useEffect(() => {
		const url = localStorage.getItem("googleCalenderUrl");
		if (url) {
			setUrl(url);
		}
	}, []);

	const saveUrl = () => {
		if (!input) return;
		setInput(input.trim());
		localStorage.setItem("googleCalenderUrl", input);
		setUrl(input);
	};

	return (
		<div className="h-full w-full flex justify-around p-8 bg-blue-100 gap-4">
			<div className="flex flex-col h-full gap-8">
				<AnalogClock />
				<DigitalClock />
			</div>
			<WeatherWidget />

			{googleCalenderUrl ? (
				<CalendarIframe
					calendarEmbedUrl={googleCalenderUrl}
					className="rounded-2xl h-full w-full"
					divClassName="h-full w-full"
				/>
			) : (
				<div className="bg-white p-2 rounded-2xl flex flex-col gap-2 justify-center place-items-center">
					You have to set the google calender url first in the
					localstorage
					<br />
					follow following steps to do so
					<ol className="list-decimal list-inside p-2">
						<li>
							go to{" "}
							<a
								href="https://calendar.google.com"
								target="_blank"
							>
								calendar.google.com
							</a>
						</li>
						<li>click on Setting log (cog-wheel)</li>
						<li>then click setting option in the menu</li>
						<li>
							go to any of options in left menu mentioned as
							"Setting for (name) calendar"
						</li>
						<li>
							click integrate calender of the selected calendar
						</li>
						<li>
							copy the public url or customize as per the
							instructions on the screen
						</li>
						<li>
							come to this website back and pase the url in the
							input below
						</li>
					</ol>
					<input
						type="url"
						name="url"
						id=""
						value={input}
						onChange={(e) => {
							setInput(e.target.value);
						}}
						placeholder="Enter the google calendar URL here"
						className="w-full border-2 p-1 rounded-2xl"
					/>
					<button
						type="button"
						className="bg-blue-400 p-2 w-full rounded-2xl"
						onClick={saveUrl}
					>
						Save
					</button>
					<span>
						Don't worry your data is stored only on your device and
						never transfered/given anywhere/anyone
					</span>
				</div>
			)}
		</div>
	);
}

export default App;
