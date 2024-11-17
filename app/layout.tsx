import type { Metadata } from "next";
import { UserProvider } from "./contexts/UserContext";
import { CountryDataProvider } from "./contexts/CountryDataContext";
import './globals.css';

export const metadata: Metadata = {
  title: "llama-hackathon",
  description: "llama-hackathon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <CountryDataProvider>
            {children}
          </CountryDataProvider>
        </UserProvider>
      </body>
    </html>
  );
}
