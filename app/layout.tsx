import type { Metadata } from "next";
import {
  Geist_Mono,
  Instrument_Serif,
  Instrument_Sans,
} from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Jackson Prince",
  description:
    "Jackson Prince is a growth engineer at Roboflow and founder of Frame 240, based in New York City.",
  keywords: [
    "Jackson Prince",
    "software engineer",
    "Roboflow",
    "Frame 240",
    "New York",
  ],
  authors: [{ name: "Jackson Prince" }],
  creator: "Jackson Prince",
  metadataBase: new URL("https://jacksonprince.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jacksonprince.dev",
    siteName: "Jackson Prince",
    title: "Jackson Prince",
    description:
      "Growth engineer at Roboflow and founder of Frame 240, based in New York City.",
  },
  twitter: {
    card: "summary",
    title: "Jackson Prince",
    description:
      "Growth engineer at Roboflow and founder of Frame 240, based in New York City.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${instrumentSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
      >
        <div className="top-0 left-0 w-full h-2 bg-[#8B4513]" />
        {children}
      </body>
    </html>
  );
}
