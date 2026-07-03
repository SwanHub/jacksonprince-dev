import type { Metadata } from "next";
import {
  Caveat,
  Geist_Mono,
  Instrument_Serif,
  Instrument_Sans,
  Libre_Baskerville,
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

const libreBaskerville = Libre_Baskerville({
  variable: "--font-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Jackson Prince's Website",
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
    title: "Jackson Prince's Website",
    description:
      "Growth engineer at Roboflow and founder of Frame 240, based in New York City.",
  },
  twitter: {
    card: "summary",
    title: "Jackson Prince's Website",
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
        className={`${instrumentSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${libreBaskerville.variable} ${caveat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
