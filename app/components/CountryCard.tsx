import React, { useState, useEffect } from 'react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Globe2, Building2, Heart, Briefcase, Users, Home, BookOpen, Scale, ChevronLeft, X, Star } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { CultureData, QualityData, useCountryData } from '@/app/contexts/CountryDataContext';
import { LegalData, WorkData } from '@/app/contexts/CountryDataContext';

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
  const { getLegalData, getQualityData, getWorkData, getCultureData, isLoading } = useCountryData();
  const [legalData, setLegalData] = useState<LegalData | null>(null);
  const [qualityData, setQualityData] = useState<QualityData | null>(null);
  const [workData, setWorkData] = useState<WorkData | null>(null);
  const [cultureData, setCultureData] = useState<CultureData | null>(null);
  const [activeTab, setActiveTab] = useState('living');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const cities = cityData[country] || [];
  const [dataLoaded, setDataLoaded] = useState({
    legal: false,
    quality: false,
    work: false,
    culture: false
  });

  // Load data only when tab is selected
  useEffect(() => {
    const loadData = async () => {
      try {
        switch (activeTab) {
          case 'immigration':
            if (!dataLoaded.legal) {
              const data = await getLegalData(country);
              setLegalData(data);
              setDataLoaded(prev => ({ ...prev, legal: true }));
            }
            break;
          case 'quality':
            if (!dataLoaded.quality) {
              const data = await getQualityData(country);
              setQualityData(data);
              setDataLoaded(prev => ({ ...prev, quality: true }));
            }
            break;
          case 'work':
            if (!dataLoaded.work) {
              const data = await getWorkData(country);
              setWorkData(data);
              setDataLoaded(prev => ({ ...prev, work: true }));
            }
            break;
          case 'culture':
            if (!dataLoaded.culture) {
              const data = await getCultureData(country);
              setCultureData(data);
              setDataLoaded(prev => ({ ...prev, culture: true }));
            }
            break;
        }
      } catch (error) {
        console.error(`Failed to load ${activeTab} data:`, error);
      }
    };

    loadData();
  }, [activeTab, country, getLegalData, getQualityData, getWorkData, getCultureData, dataLoaded]);

  // Reset loaded state when country changes
  useEffect(() => {
    setDataLoaded({
      legal: false,
      quality: false,
      work: false,
      culture: false
    });
  }, [country]);

  const renderCityList = () => {
    const capital = cities.find(city => city.isCapital);
    const otherCities = cities.filter(city => !city.isCapital);

    return (
      <div className="space-y-6 h-full">
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
    <div className="h-full overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-center p-4 flex-shrink-0">
        <h1 className="text-2xl font-semibold">{country}</h1>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="living" className="flex-1 flex flex-col min-h-0" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 bg-gray-50 h-auto flex-shrink-0">
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

        <div className="flex-1 min-h-0">
          <TabsContent value="living" className="h-full data-[state=active]:flex flex-col">
            <ScrollArea className="flex-1">
              <div className="space-y-4 px-4 py-2">
                {selectedCity ? renderCityDetail() : renderCityList()}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="immigration" className="h-full data-[state=active]:flex flex-col">
            <ScrollArea className="flex-1">
              <div className="space-y-4 px-4 py-2">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                  </div>
                ) : legalData ? (
                  <>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Visa Requirements</h3>
                      <p className="text-sm text-gray-600">{legalData.visaRequirements}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Path to Residency</h3>
                      <p className="text-sm text-gray-600">{legalData.pathToResidency}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Required Documents</h3>
                      <ul className="text-sm text-gray-600 list-disc pl-4">
                        {legalData.requiredDocuments.map((doc: string, index: number) => (
                          <li key={index}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : null}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="quality" className="h-full data-[state=active]:flex flex-col">
            <ScrollArea className="flex-1">
              <div className="space-y-6 px-4 py-2">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                  </div>
                ) : qualityData ? (
                  <>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Healthcare</h3>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">System</h4>
                          <p className="text-sm text-gray-600">{qualityData.healthcare.system}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Quality</h4>
                          <p className="text-sm text-gray-600">{qualityData.healthcare.quality}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Cost</h4>
                          <p className="text-sm text-gray-600">{qualityData.healthcare.cost}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Safety</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">Safety Index</h4>
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {qualityData.safety.index}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{qualityData.safety.details}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Environment</h3>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">Air Quality</h4>
                          <p className="text-sm text-gray-600">{qualityData.environment.airQuality}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Climate</h4>
                          <p className="text-sm text-gray-600">{qualityData.environment.climate}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Sustainability</h4>
                          <p className="text-sm text-gray-600">{qualityData.environment.sustainability}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Education</h3>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">Education System</h4>
                          <p className="text-sm text-gray-600">{qualityData.education.system}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Universities</h4>
                          <p className="text-sm text-gray-600">{qualityData.education.universities}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">International Schools</h4>
                          <p className="text-sm text-gray-600">{qualityData.education.internationalSchools}</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500">
                    Failed to load quality of life information
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="work" className="h-full data-[state=active]:flex flex-col">
            <ScrollArea className="flex-1">
              <div className="space-y-6 px-4 py-2">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                  </div>
                ) : workData ? (
                  <>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Job Market</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">{workData.jobMarket.overview}</p>
                        <div className="mt-2">
                          <h4 className="font-medium">In-Demand Sectors</h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {workData.jobMarket.inDemandSectors.map((sector, index) => (
                              <span key={index} className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {sector}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-2">
                          <h4 className="font-medium">Average Salaries</h4>
                          <p className="text-sm text-gray-600">{workData.jobMarket.averageSalaries}</p>
                        </div>
                        <div className="mt-2">
                          <h4 className="font-medium">Unemployment</h4>
                          <p className="text-sm text-gray-600">{workData.jobMarket.unemployment}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Business Environment</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">{workData.businessEnvironment.startupScene}</p>
                        <div className="mt-2">
                          <h4 className="font-medium">Major Employers</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {workData.businessEnvironment.majorEmployers.map((employer, index) => (
                              <li key={index}>{employer}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-2">
                          <h4 className="font-medium">Regulations</h4>
                          <p className="text-sm text-gray-600">{workData.businessEnvironment.regulations}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Work Culture</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">{workData.workCulture.workLifeBalance}</p>
                        <div className="mt-2">
                          <h4 className="font-medium">Office Hours</h4>
                          <p className="text-sm text-gray-600">{workData.workCulture.officeHours}</p>
                        </div>
                        <div className="mt-2">
                          <h4 className="font-medium">Common Practices</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {workData.workCulture.practices.map((practice, index) => (
                              <li key={index}>{practice}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Foreign Workers</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">{workData.foreignWorkers.opportunities}</p>
                        <div className="mt-2">
                          <h4 className="font-medium">Work Permits</h4>
                          <p className="text-sm text-gray-600">{workData.foreignWorkers.workPermits}</p>
                        </div>
                        <div className="mt-2">
                          <h4 className="font-medium">Common Challenges</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {workData.foreignWorkers.challenges.map((challenge, index) => (
                              <li key={index}>{challenge}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500">
                    Failed to load work information
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="culture" className="h-full data-[state=active]:flex flex-col">
            <ScrollArea className="flex-1">
              <div className="space-y-6 px-4 py-2">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                  </div>
                ) : cultureData ? (
                  <>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Society & Customs</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">Core Values</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {cultureData.society.values.map((value: string, index: number) => (
                              <li key={index}>{value}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Important Customs</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {cultureData.society.customs.map((custom: string, index: number) => (
                              <li key={index}>{custom}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Etiquette</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {cultureData.society.etiquette.map((rule: string, index: number) => (
                            <li key={index}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Lifestyle</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">{cultureData.lifestyle.overview}</p>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">Social Life</h4>
                            <p className="text-sm text-gray-600">{cultureData.lifestyle.socialLife}</p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">Family Life</h4>
                            <p className="text-sm text-gray-600">{cultureData.lifestyle.familyLife}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Language</h3>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">Official Languages</h4>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                              {cultureData.language.official.map((lang: string, index: number) => (
                                <li key={index}>{lang}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">Business English</h4>
                            <p className="text-sm text-gray-600">{cultureData.language.businessEnglish}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="font-medium">Useful Phrases</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {cultureData.language.usefulPhrases.map((phrase: any, index: number) => (
                              <li key={index}>
                                {typeof phrase === 'object'
                                  ? `${phrase.phrase} - ${phrase.translation}`
                                  : phrase
                                }
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Expat Life</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">{cultureData.expats.integration}</p>
                        <div className="mt-4">
                          <h4 className="font-medium">Communities</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {cultureData.expats.communities.map((community: string, index: number) => (
                              <li key={index}>{community}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-4">
                          <h4 className="font-medium">Common Challenges</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {cultureData.expats.commonChallenges.map((challenge: string, index: number) => (
                              <li key={index}>{challenge}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500">
                    Failed to load cultural information
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default CountryCard;