import React, { useState } from 'react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Globe2, Building2, Heart, Briefcase, Users, Home, BookOpen, Scale, ChevronLeft, X, Star } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface CountryCardProps {
  country: string;
  onClose: () => void;
}

interface CityInfo {
  name: string;
  isCapital?: boolean;
  population: string;
  description: string;
  costOfLiving: string;
  internetSpeed: string;
  climate: string;
  neighborhoods: string[];
}

// Example city data (in a real app, this would come from an API/database)
const cityData: Record<string, CityInfo[]> = {
  "Japan": [
    {
      name: "Tokyo",
      isCapital: true,
      population: "37.4 million",
      description: "Japan's bustling capital, mixing ultramodern and traditional culture with endless opportunities for entertainment, dining, and career growth.",
      costOfLiving: "$2,000 - $3,500/month",
      internetSpeed: "200Mbps average",
      climate: "Humid subtropical",
      neighborhoods: ["Shinjuku", "Shibuya", "Minato", "Setagaya", "Roppongi", "Chiyoda"]
    },
    {
      name: "Osaka",
      population: "19 million",
      description: "Known for its modern architecture, nightlife, street food culture, and outgoing locals.",
      costOfLiving: "$1,500 - $2,500/month",
      internetSpeed: "150Mbps average",
      climate: "Humid subtropical",
      neighborhoods: ["Umeda", "Namba", "Tennoji", "Shinsekai"]
    },
    {
      name: "Kyoto",
      population: "1.5 million",
      description: "The cultural heart of Japan, famous for its temples, traditional architecture, and gardens.",
      costOfLiving: "$1,400 - $2,300/month",
      internetSpeed: "150Mbps average",
      climate: "Humid subtropical",
      neighborhoods: ["Gion", "Arashiyama", "Higashiyama", "Kawaramachi"]
    },
    {
      name: "Fukuoka",
      population: "1.6 million",
      description: "A modern city known for its excellent quality of life, beautiful beaches, and famous ramen.",
      costOfLiving: "$1,300 - $2,000/month",
      internetSpeed: "160Mbps average",
      climate: "Humid subtropical",
      neighborhoods: ["Hakata", "Tenjin", "Ohori", "Momochi"]
    },
    {
      name: "Sapporo",
      population: "1.9 million",
      description: "Capital of Hokkaido, famous for its beer, ramen, and winter festivals.",
      costOfLiving: "$1,200 - $2,000/month",
      internetSpeed: "140Mbps average",
      climate: "Humid continental",
      neighborhoods: ["Odori", "Susukino", "Chuo-ku", "Toyohira"]
    },
    {
      name: "Kobe",
      population: "1.5 million",
      description: "Port city known for its famous beef, sake breweries, and mountain backdrop.",
      costOfLiving: "$1,400 - $2,200/month",
      internetSpeed: "150Mbps average",
      climate: "Humid subtropical",
      neighborhoods: ["Sannomiya", "Kitano", "Harborland", "Rokko"]
    }
  ],
};

const CountryCard = ({ country = "Japan", onClose }: CountryCardProps) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const cities = cityData[country] || [];

  const renderCityList = () => {
    const capital = cities.find(city => city.isCapital);
    const otherCities = cities.filter(city => !city.isCapital);

    return (
      <div className="space-y-6">
        {/* Capital City Card */}
        {capital && (
          <div>
            <div>

              <h3 className="text-sm font-semibold text-gray-500 mb-3">Capital City</h3>
            </div>
            <div
              onClick={() => setSelectedCity(capital.name)}
              className="group relative overflow-hidden rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="h-full border-b border-gray-200 relative">
                <div className="relative z-10">
                  <div className="flex items-center gap-1 text-xs font-semibold top-2 right-2 absolute bg-teal-500 px-2 py-1 rounded-full text-white">
                    Capital
                  </div>
                </div>
                <div
                  className="bg-gradient-to-br from-teal-100 to-teal-50 w-full h-full absolute top-0 left-0"
                />
              </div>
              <div className="p-6 bg-white">
                <div className="flex justify-between items-start">
                  <div className="flex w-full justify-between items-center">
                    <h3 className="font-semibold text-xl group-hover:text-blue-600 transition-colors">
                      {capital.name}
                    </h3>
                    <p className="text-sm text-gray-500">{capital.population}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {capital.description}
                </p>
                <div className="flex gap-2 mt-4">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                    {capital.climate}
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                    {capital.costOfLiving}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Cities Grid */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-3">Major Cities</h3>
          <div className="flex flex-col gap-4">
            {otherCities.map((city) => (
              <div
                key={city.name}
                onClick={() => setSelectedCity(city.name)}
                className="group relative overflow-hidden rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="p-4 bg-white">
                  <div className="flex justify-between items-start">
                    <div className="flex w-full justify-between items-center">
                      <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                        {city.name}
                      </h3>
                      <p className="text-sm text-gray-500">{city.population}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {city.description}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                      {city.climate}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                      {city.costOfLiving}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCityDetail = () => {
    const cityInfo = cities.find(c => c.name === selectedCity);
    if (!cityInfo) return null;

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedCity(null)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft size={16} />
          <span>Back to cities</span>
        </button>

        <div>
          <h2 className="text-xl font-semibold mb-2">{cityInfo.name}</h2>
          <p className="text-sm text-gray-600 mb-6">{cityInfo.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Population</h3>
            <p className="text-sm text-gray-600">{cityInfo.population}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Cost of Living</h3>
            <p className="text-sm text-gray-600">{cityInfo.costOfLiving}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Internet Speed</h3>
            <p className="text-sm text-gray-600">{cityInfo.internetSpeed}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Climate</h3>
            <p className="text-sm text-gray-600">{cityInfo.climate}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Popular Neighborhoods</h3>
          <div className="flex flex-wrap gap-2">
            {cityInfo.neighborhoods.map((neighborhood: string) => (
              <span
                key={neighborhood}
                className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
              >
                {neighborhood}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg flex flex-col h-full">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-semibold">{country}</h1>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>
      <Tabs defaultValue="living" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-5 bg-gray-50 h-auto">
          <TabsTrigger value="living" className="flex flex-col items-center p-2">
            <Building2 size={16} />
            <span className="text-xs mt-1">Cities</span>
          </TabsTrigger>
          <TabsTrigger value="immigration" className="flex flex-col items-center p-2">
            <Scale size={16} />
            <span className="text-xs mt-1">Legal</span>
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex flex-col items-center p-2">
            <Heart size={16} />
            <span className="text-xs mt-1">Quality</span>
          </TabsTrigger>
          <TabsTrigger value="work" className="flex flex-col items-center p-2">
            <Briefcase size={16} />
            <span className="text-xs mt-1">Work</span>
          </TabsTrigger>
          <TabsTrigger value="culture" className="flex flex-col items-center p-2">
            <Users size={16} />
            <span className="text-xs mt-1">Culture</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="living">
          <ScrollArea className="h-[500px]">
            <div className="space-y-4 px-4 py-2">
              {selectedCity ? renderCityDetail() : renderCityList()}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="immigration">
          <ScrollArea className="h-[500px]">
            <div className="space-y-4 px-4 py-2">
              <div className="space-y-2">
                <h3 className="font-semibold">Visa Requirements</h3>
                <p className="text-sm text-gray-600">90-day tourist visa on arrival for most passports</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Path to Residency</h3>
                <p className="text-sm text-gray-600">5 years of continuous residence required</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Required Documents</h3>
                <ul className="text-sm text-gray-600 list-disc pl-4">
                  <li>Valid passport</li>
                  <li>Proof of income</li>
                  <li>Health insurance</li>
                </ul>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="quality">
          <ScrollArea className="h-[500px]">
            <div className="space-y-4 px-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Healthcare</h3>
                  <p className="text-sm text-gray-600">Universal healthcare system</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Safety Index</h3>
                  <p className="text-sm text-gray-600">Very High (Top 10%)</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Air Quality</h3>
                  <p className="text-sm text-gray-600">Good (AQI: 35)</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Education</h3>
                  <p className="text-sm text-gray-600">Top-tier public education</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="work">
          <ScrollArea className="h-[500px]">
            <div className="space-y-4 px-4 py-2">
              <div className="space-y-2">
                <h3 className="font-semibold">Job Market</h3>
                <p className="text-sm text-gray-600">Strong demand in tech and finance</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Average Salary</h3>
                <p className="text-sm text-gray-600">$45,000 - $75,000 USD/year</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Remote Work</h3>
                <p className="text-sm text-gray-600">Digital nomad visa available</p>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="culture">
          <ScrollArea className="h-[500px]">
            <div className="space-y-4 px-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Languages</h3>
                  <p className="text-sm text-gray-600">Japanese (English widely used)</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Expat Community</h3>
                  <p className="text-sm text-gray-600">Large (2.9M foreigners)</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Cultural Notes</h3>
                <ul className="text-sm text-gray-600 list-disc pl-4">
                  <li>Punctuality is highly valued</li>
                  <li>Formal business culture</li>
                  <li>Remove shoes indoors</li>
                </ul>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CountryCard;