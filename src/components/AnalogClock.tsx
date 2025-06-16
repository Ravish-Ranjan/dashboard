"use client";

import { useEffect, useState } from "react";

interface ClockProps {
	size?: number;
	className?: string;
}

export default function AnalogClock({
	size = 240,
	className = "",
}: ClockProps) {
	const [time, setTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(new Date());
		}, 16);

		return () => clearInterval(timer);
	}, []);

	const secondAngle = time.getSeconds() * 6;
	const minuteAngle =
		time.getMinutes() * 6 + time.getSeconds() * 0.1 - 90 - secondAngle;
	const hourAngle =
		(time.getHours() % 12) * 30 +
		time.getMinutes() * 0.5 -
		90 -
		secondAngle;

	const clockRotation = time.getSeconds() * 6;

	const center = size / 2;
	const radius = center - 30;

	const getHandPosition = (angle: number, length: number) => {
		const radian = (angle * Math.PI) / 180;
		return {
			x: center + Math.cos(radian) * length,
			y: center + Math.sin(radian) * length,
		};
	};

	const createScallopedPath = () => {
		const scallops = 12;
		const outerRadius = radius + 20;
		const innerRadius = radius + 5;
		let path = "";

		for (let i = 0; i < scallops; i++) {
			const angle1 = (i * 360) / scallops;
			const angle2 = ((i + 0.5) * 360) / scallops;
			const angle3 = ((i + 1) * 360) / scallops;

			const radian1 = (angle1 * Math.PI) / 180;
			const radian2 = (angle2 * Math.PI) / 180;
			const radian3 = (angle3 * Math.PI) / 180;

			const x1 = center + Math.cos(radian1) * outerRadius;
			const y1 = center + Math.sin(radian1) * outerRadius;
			const x2 = center + Math.cos(radian2) * innerRadius;
			const y2 = center + Math.sin(radian2) * innerRadius;
			const x3 = center + Math.cos(radian3) * outerRadius;
			const y3 = center + Math.sin(radian3) * outerRadius;

			if (i === 0) {
				path += `M ${x1} ${y1}`;
			}

			path += ` Q ${x2} ${y2} ${x3} ${y3}`;
		}

		path += " Z";
		return path;
	};

	const hourHand = getHandPosition(hourAngle, radius * 0.6);
	const minuteHand = getHandPosition(minuteAngle, radius * 0.9);

	const formatDate = () => {
		const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		const dayName = days[time.getDay()];
		const date = time.getDate();
		return `${dayName} ${date}`;
	};

	return (
		<div className={`grid place-items-center ${className}`}>
			<svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				className="drop-shadow-2xl"
				style={{
					transform: `rotate(${clockRotation}deg)`,
					transformOrigin: "center",
					// filter:"drop-shadow(0 0 1rem #555)",
				}}
			>
				<path
					d={createScallopedPath()}
					fill="#f3f4f6"
					stroke="none"
					className="fill-gray-300 dark:fill-gray-700"
					style={{filter:""}}
				/>
				<circle
					cx={90}
					cy={10}
					r={size * 0.04}
					className="fill-gray-400 overflow-visible"
				/>
				<text
					x={center - radius/2.5}
					y={center - radius * 0.25}
					textAnchor="middle"
					className="fill-gray-900 text-sm font-semibold dark:fill-gray-200"
					style={{ fontSize: `${size * 0.12}px`,rotate:"-15deg" }}
				>
					{formatDate()}
				</text>
				<line
					x1={center}
					y1={center}
					x2={minuteHand.x}
					y2={minuteHand.y}
					strokeWidth={size * 0.06}
					strokeLinecap="round"
					className="transition-all duration-1000 ease-in-out stroke-gray-700 dark:stroke-gray-200"
				/>
				<line
					x1={center}
					y1={center}
					x2={hourHand.x}
					y2={hourHand.y}
					strokeWidth={size * 0.06}
					strokeLinecap="round"
					className="transition-all duration-1000 ease-in-out stroke-gray-800 dark:stroke-gray-400"
				/>
				<circle
					cx={center}
					cy={center}
					r={size * 0.015}
					fill="#d1d5db"
					className="dark:fill-gray-400"
				/>
			</svg>
		</div>
	);
}
