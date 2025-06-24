import React, { useState, useEffect } from 'react';
import { Calculator, Upload, CheckCircle, Clock, DollarSign, Shield, Truck, BarChart3, FileText, User, Building, Package, Thermometer, Calendar, Award } from 'lucide-react';

const BLLOnboardingPlatform = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    businessType: '',
    productType: '',
    storageVolume: '',
    temperatureControl: false,
    specialRequirements: '',
    duration: '3-6',
    urgency: 'standard'
  });
  const [quote, setQuote] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState('professional');

  // Pricing calculation logic
  const calculatePricing = () => {
    const baseRates = {
      standard: 45000, // UGX per pallet per month
      temperature: 65000, // UGX per pallet per month for temperature-controlled
      pharmaceutical: 75000 // UGX per pallet per month for pharmaceutical
    };

    const volume = parseInt(formData.storageVolume) || 1;
    let baseRate = baseRates.standard;

    if (formData.productType === 'pharmaceutical') {
      baseRate = baseRates.pharmaceutical;
    } else if (formData.temperatureControl) {
      baseRate = baseRates.temperature;
    }

    // Duration discounts
    const durationDiscounts = {
      '1-3': 0,
      '3-6': 0.05,
      '6-12': 0.10,
      '12+': 0.15
    };

    // Volume discounts
    let volumeDiscount = 0;
    if (volume >= 50) volumeDiscount = 0.15;
    else if (volume >= 25) volumeDiscount = 0.10;
    else if (volume >= 10) volumeDiscount = 0.05;

    const discount = Math.max(durationDiscounts[formData.duration], volumeDiscount);
    const monthlyRate = Math.round(baseRate * volume * (1 - discount));
    
    // Package pricing
    const packagePricing = {
      essential: 0,
      professional: Math.round(monthlyRate * 0.15),
      premium: Math.round(monthlyRate * 0.30)
    };

    const competitorSavings = Math.round(monthlyRate * 0.20); // Assuming 20% savings vs competitors

    return {
      baseRate: monthlyRate,
      packageCost: packagePricing[selectedPackage],
      totalMonthly: monthlyRate + packagePricing[selectedPackage],
      discount: Math.round(discount * 100),
      competitorSavings,
      sqMeterRate: Math.round(monthlyRate / (volume * 0.96)), // 0.96 sqm per pallet
      valueAdded: packagePricing[selectedPackage]
    };
  };

  useEffect(() => {
    if (formData.storageVolume && formData.productType) {
      setQuote(calculatePricing());
    }
  }, [formData, selectedPackage]);

  const packages = {
    essential: {
      name: 'Essential',
      price: 'Base Rate',
      features: [
        'Basic ambient storage',
        'Monthly reporting',
        'Standard security',
        'Email support',
        'Basic inventory tracking'
      ],
      icon: Package,
      color: 'bg-blue-500'
    },
    professional: {
      name: 'Professional',
      price: '+15%',
      features: [
        'Climate-controlled storage',
        'Bi-weekly reporting',
        '24/7 monitoring',
        'Dedicated account manager',
        'Advanced inventory management',
        'Pick & pack services'
      ],
      icon: Shield,
      color: 'bg-green-500'
    },
    premium: {
      name: 'Premium',
      price: '+30%',
      features: [
        'Pharmaceutical-grade storage',
        'Real-time tracking',
        'Weekly custom reports',
        'Priority support (2hr response)',
        'Full distribution services',
        'Compliance documentation',
        'Quality control inspections'
      ],
      icon: Award,
      color: 'bg-purple-500'
    }
  };

  const steps = [
    { id: 1, title: 'Business Information', icon: Building },
    { id: 2, title: 'Storage Requirements', icon: Package },
    { id: 3, title: 'Service Packages', icon: Award },
    { id: 4, title: 'Documentation', icon: Upload },
    { id: 5, title: 'Review & Submit', icon: CheckCircle }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your business</h2>
        <p className="text-gray-600">We'll use this information to customize your storage solution</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your company name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person *</label>
          <input
            type="text"
            value={formData.contactPerson}
            onChange={(e) => handleInputChange('contactPerson', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Full name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="business@company.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+256 XXX XXX XXX"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Type *</label>
          <select
            value={formData.businessType}
            onChange={(e) => handleInputChange('businessType', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select business type</option>
            <option value="pharmaceutical">Pharmaceutical Company</option>
            <option value="fmcg">FMCG / Consumer Goods</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="trading">Trading Company</option>
            <option value="ecommerce">E-commerce</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Storage Requirements</h2>
        <p className="text-gray-600">Help us understand what you need to store</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Type *</label>
          <select
            value={formData.productType}
            onChange={(e) => handleInputChange('productType', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select product type</option>
            <option value="pharmaceutical">Pharmaceutical Products</option>
            <option value="medical">Medical Devices</option>
            <option value="consumer">Consumer Goods</option>
            <option value="industrial">Industrial Products</option>
            <option value="food">Food & Beverages</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Storage Volume (Pallets) *</label>
          <input
            type="number"
            value={formData.storageVolume}
            onChange={(e) => handleInputChange('storageVolume', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Number of pallets needed"
            min="1"
          />
          {formData.storageVolume && (
            <p className="text-sm text-gray-500 mt-1">
              Approximately {(parseFloat(formData.storageVolume) * 0.96).toFixed(1)} square meters
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Storage Duration *</label>
          <select
            value={formData.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1-3">1-3 months</option>
            <option value="3-6">3-6 months</option>
            <option value="6-12">6-12 months</option>
            <option value="12+">12+ months</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
          <select
            value={formData.urgency}
            onChange={(e) => handleInputChange('urgency', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="standard">Standard (5-7 days)</option>
            <option value="urgent">Urgent (2-3 days)</option>
            <option value="immediate">Immediate (24 hours)</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.temperatureControl}
              onChange={(e) => handleInputChange('temperatureControl', e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Temperature-controlled storage required</span>
          </label>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements</label>
          <textarea
            value={formData.specialRequirements}
            onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="Any special handling, security, or compliance requirements..."
          />
        </div>
      </div>
      
      {quote && (
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
          <div className="flex items-center mb-4">
            <Calculator className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Instant Quote Preview</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">UGX {quote.baseRate.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Base Monthly Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{quote.discount}%</div>
              <div className="text-sm text-gray-600">Discount Applied</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">UGX {quote.competitorSavings.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Monthly Savings vs Competitors</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Service Package</h2>
        <p className="text-gray-600">Select the level of service that best fits your needs</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(packages).map(([key, pkg]) => {
          const Icon = pkg.icon;
          const isSelected = selectedPackage === key;
          
          return (
            <div
              key={key}
              onClick={() => setSelectedPackage(key)}
              className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="text-center mb-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${pkg.color} text-white mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                <p className="text-lg font-semibold text-blue-600">{pkg.price}</p>
              </div>
              
              <ul className="space-y-2">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-2">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {quote && (
        <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Customized Quote</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Storage Rate:</span>
                  <span className="font-medium">UGX {quote.baseRate.toLocaleString()}/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{packages[selectedPackage].name} Package:</span>
                  <span className="font-medium">UGX {quote.packageCost.toLocaleString()}/month</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Monthly Cost:</span>
                    <span className="text-blue-600">UGX {quote.totalMonthly.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rate per Pallet:</span>
                  <span className="font-medium">UGX {Math.round(quote.totalMonthly / parseInt(formData.storageVolume || 1)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rate per Sq Meter:</span>
                  <span className="font-medium">UGX {quote.sqMeterRate.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Monthly Savings:</span>
                  <span>UGX {quote.competitorSavings.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Upload</h2>
        <p className="text-gray-600">Please upload the required documents for verification</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'Business Registration Certificate', required: true, desc: 'Official business registration document' },
          { name: 'Tax Identification Number', required: true, desc: 'Valid TIN certificate' },
          { name: 'Product Licenses', required: formData.productType === 'pharmaceutical', desc: 'Required for pharmaceutical products' },
          { name: 'Insurance Certificate', required: false, desc: 'Product liability insurance (recommended)' },
          { name: 'Safety Data Sheets', required: false, desc: 'For hazardous or special materials' },
          { name: 'Previous Storage Contracts', required: false, desc: 'For reference and migration planning' }
        ].map((doc, index) => (
          <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">
              {doc.name} {doc.required && <span className="text-red-500">*</span>}
            </h3>
            <p className="text-sm text-gray-500 mb-3">{doc.desc}</p>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Choose File
            </button>
          </div>
        ))}
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">Document Processing Timeline</h4>
            <p className="text-yellow-700 text-sm mt-1">
              Document verification typically takes 24-48 hours. We'll notify you immediately once approved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-600">Review your information before submitting your application</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-600" />
              Business Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Company:</span>
                <span className="font-medium">{formData.companyName || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contact:</span>
                <span className="font-medium">{formData.contactPerson || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{formData.email || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Business Type:</span>
                <span className="font-medium capitalize">{formData.businessType || 'Not selected'}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-green-600" />
              Storage Requirements
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Product Type:</span>
                <span className="font-medium capitalize">{formData.productType || 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Volume:</span>
                <span className="font-medium">{formData.storageVolume || '0'} pallets</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{formData.duration} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Temperature Control:</span>
                <span className="font-medium">{formData.temperatureControl ? 'Required' : 'Not required'}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-purple-600" />
              Selected Package
            </h3>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-3">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">{packages[selectedPackage].name}</h4>
              <p className="text-purple-600 font-medium">{packages[selectedPackage].price}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {quote && (
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Final Quote Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Monthly Storage Cost:</span>
                  <span className="text-xl font-bold">UGX {quote.totalMonthly.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-green-200">
                  <span>Monthly Savings:</span>
                  <span className="font-semibold">UGX {quote.competitorSavings.toLocaleString()}</span>
                </div>
                <div className="border-t border-white/30 pt-3">
                  <div className="flex justify-between items-center">
                    <span>Rate per Pallet:</span>
                    <span className="font-semibold">UGX {Math.round(quote.totalMonthly / parseInt(formData.storageVolume || 1)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Rate per Sq Meter:</span>
                    <span className="font-semibold">UGX {quote.sqMeterRate.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              What Happens Next?
            </h3>
            <div className="space-y-3 text-sm text-green-700">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium">Immediate Confirmation</p>
                  <p className="text-green-600">You'll receive an email confirmation within 5 minutes</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium">Document Review</p>
                  <p className="text-green-600">Our compliance team will verify your documents (24-48 hours)</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium">Contract & Setup</p>
                  <p className="text-green-600">Digital contract signing and space allocation</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">4</span>
                </div>
                <div>
                  <p className="font-medium">Service Activation</p>
                  <p className="text-green-600">Your dedicated account manager contacts you to schedule first delivery</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-blue-800">Secure & Confidential</h4>
                <p className="text-blue-700 text-sm">All information is encrypted and stored securely. We never share your data with third parties.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return renderStep1();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.companyName && formData.contactPerson && formData.email && formData.businessType;
      case 2:
        return formData.productType && formData.storageVolume;
      case 3:
        return selectedPackage;
      case 4:
        return true; // Documents are optional for demo
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Beyond Logistics Limited</h1>
                <p className="text-sm text-gray-600">Digital Onboarding Platform</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Step {currentStep} of 5</p>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                  isCompleted ? 'bg-green-500 border-green-500 text-white' :
                  isActive ? 'bg-blue-500 border-blue-500 text-white' :
                  'bg-white border-gray-300 text-gray-400'
                }`}>
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <div className="ml-3 hidden md:block">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 ml-4 hidden md:block ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {renderCurrentStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          {currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceed()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <span>Continue</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => alert('Application submitted successfully! You will receive a confirmation email shortly.')}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Submit Application</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BLLOnboardingPlatform;