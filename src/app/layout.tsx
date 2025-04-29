// src/app/layout.tsx
import { Inter, Cinzel, EB_Garamond, Italianno } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

// Load fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel", weight: ["400", "700"] });
const ebGaramond = EB_Garamond({ subsets: ["latin"], variable: "--font-eb-garamond" });
const italianno = Italianno({ weight: "400", variable: "--font-italianno", subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <title>Book of Dreams</title>
        <meta name="description" content="A personalized self-improvement journey with AI" />
      </head>
      <body 
        className={`${inter.variable} ${cinzel.variable} ${ebGaramond.variable} ${italianno.variable} font-eb-garamond bg-amber-50`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}