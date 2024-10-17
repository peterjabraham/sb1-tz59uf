"use client";

import React, { useState, useEffect } from 'react';
import AdInput from './AdInput';

interface FormData {
  brandName: string;
  product: string;
  userBenefit: string;
  promotion: string;
  audience: string;
  goal: string;
  keywords: string;
}

interface AdData {
  headline: string;
  primaryText: string;
  liked: boolean;
}

const AdMaker: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    brandName: '',
    product: '',
    userBenefit: '',
    promotion: '',
    audience: '',
    goal: '',
    keywords: '',
  });
  const [adPreviews, setAdPreviews] = useState<AdData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const isValid = Object.values(formData).some(value => value.trim() !== '') || csvData !== '';
    setIsFormValid(isValid);
  }, [formData, csvData]);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCsvUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvData(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handleWriteAds = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, csvData }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate ads');
      }

      const data = await response.json();
      setAdPreviews(data.ads.map((ad: AdData) => ({ ...ad, liked: false })));
    } catch (error) {
      console.error('Error generating ads:', error);
      setError('Failed to generate ads. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLike = (index: number) => {
    setAdPreviews(prevAds => 
      prevAds.map((ad, i) => 
        i === index ? { ...ad, liked: !ad.liked } : ad
      )
    );
  };

  const handleDownload = () => {
    const selectedAds = adPreviews.filter(ad => ad.liked);
    if (selectedAds.length === 0) {
      alert('Please select at least one headline to download.');
      return;
    }

    const content = selectedAds.map((ad, index) => 
      `Ad ${index + 1}:\nHeadline: ${ad.headline}\nPrimary Text: ${ad.primaryText}\n\n`
    ).join('');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected_headlines.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Headline Generator</h1>
        </div>
      </header>
      <main className="flex-grow bg-gray-100 p-4 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-2">Ad Brief</h2>
            <p className="text-sm text-gray-600 mb-4">
              The more info you give me the better your headlines will be, and upload a .csv of high performing examples in one column file please.
            </p>
            <AdInput
              adData={formData}
              onInputChange={handleInputChange}
              onGenerateAds={handleWriteAds}
              onCsvUpload={handleCsvUpload}
              isLoading={isLoading}
              isFormValid={isFormValid}
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Ad Previews</h2>
            <p>Number of previews: {adPreviews.length}</p>
            <div className="space-y-4">
              {adPreviews.map((ad, index) => (
                <div key={index} className="border p-4 rounded relative">
                  <button
                    onClick={() => toggleLike(index)}
                    className="absolute top-2 right-2 text-2xl"
                  >
                    {ad.liked ? '❤️' : '🤍'}
                  </button>
                  <h3 className="font-semibold">Ad {index + 1}</h3>
                  <p><strong>Headline:</strong> {ad.headline}</p>
                  <p><strong>Primary Text:</strong> {ad.primaryText}</p>
                </div>
              ))}
            </div>
            {adPreviews.length > 0 && (
              <button
                onClick={handleDownload}
                className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Download Selected Headlines
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdMaker;