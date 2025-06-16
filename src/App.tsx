import { useEffect, useState } from "react";
import AnalogClock from "./components/AnalogClock";
import CalendarIframe from "./components/Calender";
import DigitalClock from "./components/DigitalClock";
import WeatherWidget from "./components/Weather";
import { Maximize, Minimize } from "lucide-react";
import Button from "./components/button";

function App() {
	const [googleCalenderUrl, setUrl] = useState("");
	const [input, setInput] = useState("");
	const [isFullScreen, setFullScreen] = useState<boolean>(false);

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

	function goFullscreen() {
		const elem = document.documentElement;
		if (!isFullScreen) {
			if (elem.requestFullscreen) {
				elem.requestFullscreen();
			} else if (
				(
					elem as HTMLElement & {
						webkitRequestFullscreen?: () => Promise<void>;
						msRequestFullscreen?: () => Promise<void>;
					}
				).webkitRequestFullscreen
			) {
				(
					elem as HTMLElement & {
						webkitRequestFullscreen: () => Promise<void>;
					}
				).webkitRequestFullscreen(); // Safari
			} else if (
				(
					elem as HTMLElement & {
						msRequestFullscreen?: () => Promise<void>;
					}
				).msRequestFullscreen
			) {
				(
					elem as HTMLElement & {
						msRequestFullscreen: () => Promise<void>;
					}
				).msRequestFullscreen(); // IE11
			}
			setFullScreen(true);
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (
				(
					document as Document & {
						webkitExitFullscreen?: () => Promise<void>;
						msExitFullscreen?: () => Promise<void>;
					}
				).webkitExitFullscreen
			) {
				(
					document as Document & {
						webkitExitFullscreen: () => Promise<void>;
					}
				).webkitExitFullscreen(); // Safari
			} else if (
				(
					document as Document & {
						msExitFullscreen?: () => Promise<void>;
					}
				).msExitFullscreen
			) {
				(
					document as Document & {
						msExitFullscreen: () => Promise<void>;
					}
				).msExitFullscreen(); // IE11
			}
			setFullScreen(false);
		}
	}

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
			<Button
				className="absolute top-5 left-5 bg-white dark:bg-gray-700"
				onClick={() => {
					goFullscreen();
					setFullScreen(!isFullScreen);
				}}
				variant={"default"}
			>
				{isFullScreen ? (
					<Minimize className="text-gray-800 dark:text-white" strokeWidth={2.5} />
				) : (
					<Maximize className="text-gray-800 dark:text-white" strokeWidth={2.5} />
				)}
			</Button>
		</div>
	);
}

export default App;
