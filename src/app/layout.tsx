import type { Metadata } from "next";
import { Imbue, Nunito_Sans, Readex_Pro } from "next/font/google";
import "./globals.css";

const imbue = Imbue({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-imbue",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
});

const readexPro = Readex_Pro({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-readex",
});

export const metadata: Metadata = {
  title: "Hand Calculator | Lucky Tile Club",
  description:
    "Upload or enter your mahjong hand and calculate your score. Built for Lucky Tile Club players in Toronto.",
  openGraph: {
    title: "LTC Hand Calculator",
    description: "Scan or enter your mahjong hand — we'll tell you what you won.",
    siteName: "Lucky Tile Club",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-CA"
      className={`${imbue.variable} ${nunitoSans.variable} ${readexPro.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
