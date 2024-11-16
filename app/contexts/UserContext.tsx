'use client';

import { createContext, useContext, ReactNode } from 'react';

type Passport = {
  country: string;
  expiryDate: string;
};

type UserContextType = {
  currentLocation: string;
  passports: Passport[];
  industryInterest: string;
};

const defaultUserContext: UserContextType = {
  currentLocation: "London, UK",
  passports: [
    { country: "United Kingdom", expiryDate: "2030-01-01" },
    { country: "United States", expiryDate: "2029-06-15" }
  ],
  industryInterest: "Technology"
};

const UserContext = createContext<UserContextType>(defaultUserContext);

export function UserProvider({ children }: { children: ReactNode; }) {
  return (
    <UserContext.Provider value={defaultUserContext}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext); 