import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Globe2, Building2, Heart, Briefcase, Users, Home, BookOpen, Scale } from 'lucide-react';

const CountryCard = ({ country = "Japan" }) => {
  return (
    <div className="bg-white rounded-lg flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-semibold">{country}</h1>
      <Tabs defaultValue="living" className="w-full">
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

        <TabsContent value="immigration" className="space-y-4 px-4 py-2">
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
        </TabsContent>

        <TabsContent value="quality" className="space-y-4 px-4 py-2">
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
        </TabsContent>

        <TabsContent value="work" className="space-y-4 px-4 py-2">
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
        </TabsContent>

        <TabsContent value="culture" className="space-y-4 px-4 py-2">
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
        </TabsContent>

        <TabsContent value="living" className="space-y-4 px-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Popular Areas</h3>
              <p className="text-sm text-gray-600">Shibuya, Minato, Setagaya</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Monthly Rent</h3>
              <p className="text-sm text-gray-600">$1,200 - $2,500 USD</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Transport</h3>
              <p className="text-sm text-gray-600">Excellent public transit</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Time Zone</h3>
              <p className="text-sm text-gray-600">UTC+9</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CountryCard;