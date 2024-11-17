import type { Metadata } from "next";
import { UserProvider } from "./contexts/UserContext";
import { CountryDataProvider } from "./contexts/CountryDataContext";
import { LanguageProvider } from './contexts/LanguageContext';
import './globals.css';
import { ConversationProvider } from "./contexts/ConversationContext";

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
        <LanguageProvider>
          <UserProvider>
            <CountryDataProvider>
              <ConversationProvider>
                {children}
              </ConversationProvider>
            </CountryDataProvider>
          </UserProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
