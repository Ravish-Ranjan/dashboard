interface CalendarIframeProps {
	calendarEmbedUrl: string;
	width?: string;
	height?: string;
	className?: string;
	divClassName?:string;
}

export default function CalendarIframe({
	calendarEmbedUrl,
	width = "800",
	height = "600",
	className = "",
	divClassName=""
}: CalendarIframeProps) {
	return (
		<div className={`${divClassName}`}>
			<iframe
				src={calendarEmbedUrl}
				style={{ borderWidth: 0 }}
				width={width}
				height={height}
				className={`rounded-2xl shadow-2xl h-60 bg-gradient-to-br from-white to-indigo-100 ${className}`}
			></iframe>
		</div>
	);
}
