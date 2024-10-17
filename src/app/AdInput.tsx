import React, { useRef } from 'react';

interface AdInputProps {
  adData: {
    brandName: string;
    product: string;
    userBenefit: string;
    promotion: string;
    audience: string;
    goal: string;
    keywords: string;
  };
  onInputChange: (name: string, value: string) => void;
  onGenerateAds: () => void;
  onCsvUpload: (file: File) => void;
  isLoading: boolean;
  isFormValid: boolean;
}

const AdInput: React.FC<AdInputProps> = ({ adData, onInputChange, onGenerateAds, onCsvUpload, isLoading, isFormValid }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onCsvUpload(file);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Brand Name"
        value={adData.brandName}
        onChange={(e) => onInputChange('brandName', e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Product"
        value={adData.product}
        onChange={(e) => onInputChange('product', e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="User Benefit or Use"
        value={adData.userBenefit}
        onChange={(e) => onInputChange('userBenefit', e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Promotion or Offer"
        value={adData.promotion}
        onChange={(e) => onInputChange('promotion', e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Target Audience Segment"
        value={adData.audience}
        onChange={(e) => onInputChange('audience', e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Goal or Objective"
        value={adData.goal}
        onChange={(e) => onInputChange('goal', e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Core Keywords"
        value={adData.keywords}
        onChange={(e) => onInputChange('keywords', e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full p-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        disabled={isLoading}
      >
        Upload .csv file
      </button>
      <button
        onClick={onGenerateAds}
        className={`w-full p-2 ${
          isLoading || !isFormValid
            ? 'bg-blue-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white rounded`}
        disabled={isLoading || !isFormValid}
      >
        {isLoading ? 'Writing Ads...' : 'Write My Ads'}
      </button>
    </div>
  );
};

export default AdInput;