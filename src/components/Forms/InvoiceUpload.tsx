import React, { useState, useCallback } from 'react';
import { Upload, Camera, X, Loader2, FileImage, AlertCircle, Sparkles } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface InvoiceData {
  description: string;
  amount: number;
  category: string;
  date: string;
  vendor?: string;
}

interface InvoiceUploadProps {
  onInvoiceProcessed: (data: InvoiceData) => void;
  onClose: () => void;
  categories: Array<{ id: string; name: string; type: 'expense' }>;
}

const InvoiceUpload: React.FC<InvoiceUploadProps> = ({ onInvoiceProcessed, onClose, categories }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove data URL prefix
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processInvoice = async () => {
    if (!selectedFile || !apiKey.trim()) {
      setError('Please provide API key and select an image');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey.trim());
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const base64Data = await convertImageToBase64(selectedFile);

      const categoryList = categories.map(cat => cat.name).join(', ');

      const prompt = `
        Analyze this invoice/receipt image and extract the following information in JSON format:
        
        {
          "description": "Brief description of the purchase/service",
          "amount": "Total amount as a number (convert to Indonesian Rupiah if needed)",
          "vendor": "Store/vendor name",
          "date": "Date in YYYY-MM-DD format (use today's date if not found)",
          "suggestedCategory": "Best matching category from: ${categoryList}"
        }
        
        Rules:
        - Extract the total amount, not individual item prices
        - Convert any currency to Indonesian Rupiah (IDR) if needed
        - Use today's date (${new Date().toISOString().split('T')[0]}) if date is not clearly visible
        - For description, use the main item/service or vendor name
        - Choose the most appropriate category from the provided list
        - Return only valid JSON, no additional text
      `;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: selectedFile.type
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();
      
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not extract valid JSON from response');
      }

      const extractedData = JSON.parse(jsonMatch[0]);

      // Find matching category ID
      const matchingCategory = categories.find(cat => 
        cat.name.toLowerCase() === extractedData.suggestedCategory?.toLowerCase()
      );

      const invoiceData: InvoiceData = {
        description: extractedData.description || 'Invoice expense',
        amount: parseFloat(extractedData.amount) || 0,
        category: matchingCategory?.id || categories[0]?.id || '',
        date: extractedData.date || new Date().toISOString().split('T')[0],
        vendor: extractedData.vendor
      };

      onInvoiceProcessed(invoiceData);
      
    } catch (err) {
      console.error('Error processing invoice:', err);
      setError(err instanceof Error ? err.message : 'Failed to process invoice. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (showApiKeyInput) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="financial-card-elevated max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b border-slate-600">
            <h2 className="text-2xl font-bold text-slate-100 flex items-center">
              <Sparkles className="w-6 h-6 text-sky-400 mr-3" />
              AI Setup
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors duration-150 p-2 hover:bg-slate-700 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="financial-card p-4 border border-sky-500/30">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-sky-400 mt-0.5" />
                <div className="text-sm text-slate-300">
                  <p className="font-semibold mb-2 text-slate-100">Google Gemini API Required</p>
                  <p className="mb-3">To use AI-powered invoice scanning, you need a Google Gemini API key.</p>
                  <a 
                    href="https://makersuite.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sky-400 hover:text-sky-300 font-semibold transition-colors duration-200"
                  >
                    Get your free API key →
                  </a>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                Google Gemini API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="financial-input w-full"
              />
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowApiKeyInput(false)}
                disabled={!apiKey.trim()}
                className="flex-1 financial-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="financial-card-elevated max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-600">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center">
            <Camera className="w-6 h-6 text-sky-400 mr-3" />
            Upload Invoice
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors duration-150 p-2 hover:bg-slate-700 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!selectedFile ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-sky-500 transition-all duration-300 bg-slate-800/50"
            >
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="flex items-center justify-center w-20 h-20 financial-gradient-primary rounded-full shadow-lg">
                    <Upload className="w-10 h-10 text-white" />
                  </div>
                </div>
                
                <div>
                  <p className="text-xl font-bold text-slate-100">Upload Invoice Image</p>
                  <p className="text-slate-400 mt-2 font-medium">Drag and drop or click to select</p>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                    <div className="financial-button-primary flex items-center space-x-2">
                      <FileImage className="w-5 h-5" />
                      <span>Choose File</span>
                    </div>
                  </label>
                  
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                    <div className="flex items-center space-x-2 px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-all duration-200 font-semibold">
                      <Camera className="w-5 h-5" />
                      <span>Take Photo</span>
                    </div>
                  </label>
                </div>
                
                <p className="text-xs text-slate-500 font-medium">
                  Supports JPG, PNG, WebP (max 10MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={preview!}
                  alt="Invoice preview"
                  className="w-full max-h-64 object-contain rounded-xl border border-slate-600 bg-slate-800"
                />
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                    setError(null);
                  }}
                  className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-150 shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="text-center financial-card p-4">
                <p className="font-semibold text-slate-100">{selectedFile.name}</p>
                <p className="text-sm text-slate-400 mt-1">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="financial-card p-4 border border-red-500/30 bg-red-500/10">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <div>
                  <p className="text-red-400 font-bold">Error</p>
                  <p className="text-red-300 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={processInvoice}
              disabled={!selectedFile || isProcessing}
              className="flex-1 financial-button-success flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Scan Invoice</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceUpload;