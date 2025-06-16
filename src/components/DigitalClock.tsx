import { useState, useEffect } from "react";

export default function DigitalClock() {
	const [time, setTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const formatTime = (date: Date) => {
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");
		return { hours, minutes };
	};

	const { hours, minutes } = formatTime(time);

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<div className="grid place-items-center bg-white rounded-2xl shadow-2xl p-4">
			<div className="flex items-end justify-center space-x-2 mb-4">
				<div className="bg-gray-400 dark:bg-gray-800 rounded-2xl px-4 py-2 shadow-2xl border border-gray-800">
					<span className="text-4xl md:text-6xl font-light text-white tracking-wider font-mono">
						{hours}
					</span>
				</div>
				<div className="text-6xl md:text-8xl text-gray-400 font-light">
					:
				</div>
				<div className="bg-gray-400 dark:bg-gray-800 rounded-2xl px-4 py-2 shadow-2xl border border-gray-800">
					<span className="text-4xl md:text-6xl font-light text-white tracking-wider font-mono">
						{minutes}
					</span>
				</div>
			</div>

			<div className="text-gray-600 text-lg md:text-xl  tracking-wide">
				{formatDate(time)}
			</div>
			<span className="h-1.5 w-full bg-gradient-to-r from-cyan-500 to-green-500 mt-2 rounded-2xl"></span>
		</div>
	);
}
