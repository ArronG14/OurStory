import type { Metadata } from "next";
import { Playfair_Display, Inter, Caveat } from "next/font/google";
import "./globals.css";

const editorial = Playfair_Display({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const interface_ = Inter({
  variable: "--font-interface",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const letter = Caveat({
  variable: "--font-letter",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Our Story",
  description: "11 Years Together. 2 Years Married. One Story.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${editorial.variable} ${interface_.variable} ${letter.variable} h-full`}
    >
      <body className="h-full">{children}</body>
    </html>
  );
}
