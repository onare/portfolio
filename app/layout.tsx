import "../global.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import LocalFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import { Analytics } from "./components/analytics";

export const metadata: Metadata = {
	title: {
		default: "onadev",
		template: "%s | onadev",
	},
	description: "Founder of waotools. Working on multicube.app.",
	openGraph: {
		title: "onadev.net",
		description: "Founder of waotools. Working on multicube.app.",
		url: "https://onadev.net",
		siteName: "onadev",
		images: [
			{
				url: "https://onadev.net/og.png",
				width: 1920,
				height: 1080,
			},
		],
		locale: "en-US",
		type: "website",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	twitter: {
		title: "onadev",
		card: "summary_large_image",
	},
	icons: {
		shortcut: "/favicon.png",
	},
};
const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

const calSans = LocalFont({
	src: "../public/fonts/CalSans-SemiBold.ttf",
	variable: "--font-calsans",
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
			<head>
				<Analytics />
			</head>
			<body className="bg-black">
				{children}
				<Toaster />
			</body>
		</html>
	);
}
