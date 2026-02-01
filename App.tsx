
import React, { useState, useCallback, useRef } from 'react';
import { AppState, PhotoMode } from './types';
import { transformImage } from './services/geminiService';
import { 
  Camera, 
  Upload, 
  Briefcase, 
  FileText, 
  RefreshCw, 
  Download, 
  ArrowLeft,
  Settings2,
  Brush,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppState>(AppState.HOME);
  const [selectedMode, setSelectedMode] = useState<PhotoMode | null>(null);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Customization state
  const [background, setBackground] = useState('a modern blurred office interior');
  const [attire, setAttire] = useState('a professional charcoal suit with a white shirt');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSourceImage(event.target?.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!sourceImage || !selectedMode) return;
    
    setIsProcessing(true);
    setCurrentStep(AppState.PROCESSING);
    setError(null);
    
    try {
      const transformed = await transformImage(sourceImage, selectedMode, {
        background,
        attire
      });
      setResultImage(transformed);
      setCurrentStep(AppState.RESULT);
    } catch (err) {
      setError("Failed to transform image. Please try again with a clearer photo.");
      setCurrentStep(AppState.HOME);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setCurrentStep(AppState.HOME);
    setSourceImage(null);
    setResultImage(null);
    setSelectedMode(null);
    setError(null);
  };

  const downloadResult = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `proshot_${selectedMode?.toLowerCase()}_${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Camera className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">ProShot AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Pricing</button>
            <button className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Enterprise</button>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all">Sign In</button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3">
            <span className="font-medium">Error:</span> {error}
          </div>
        )}

        {currentStep === AppState.HOME && (
          <div className="animate-in fade-in duration-500">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
                Professional Headshots in <span className="text-indigo-600">Seconds</span>
              </h1>
              <p className="text-lg text-slate-600">
                Turn any casual selfie into a high-end studio portrait for LinkedIn, CVs, or official passports. Powered by Gemini AI.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Option: Headshot */}
              <div 
                onClick={() => setSelectedMode(PhotoMode.HEADSHOT)}
                className={`relative overflow-hidden group p-8 rounded-3xl border-2 transition-all cursor-pointer ${selectedMode === PhotoMode.HEADSHOT ? 'border-indigo-600 bg-indigo-50/50 shadow-lg ring-4 ring-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${selectedMode === PhotoMode.HEADSHOT ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Briefcase className="w-8 h-8" />
                  </div>
                  {selectedMode === PhotoMode.HEADSHOT && <CheckCircle2 className="text-indigo-600 w-6 h-6" />}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Corporate Headshot</h3>
                <p className="text-slate-600 mb-4">Perfect for LinkedIn profiles, corporate directories, and professional resumes.</p>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-500" /> AI-generated professional attire</li>
                  <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-500" /> Studio background options</li>
                  <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-500" /> High-fidelity facial preservation</li>
                </ul>
              </div>

              {/* Option: Passport */}
              <div 
                onClick={() => setSelectedMode(PhotoMode.PASSPORT)}
                className={`relative overflow-hidden group p-8 rounded-3xl border-2 transition-all cursor-pointer ${selectedMode === PhotoMode.PASSPORT ? 'border-indigo-600 bg-indigo-50/50 shadow-lg ring-4 ring-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${selectedMode === PhotoMode.PASSPORT ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <FileText className="w-8 h-8" />
                  </div>
                  {selectedMode === PhotoMode.PASSPORT && <CheckCircle2 className="text-indigo-600 w-6 h-6" />}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Passport Photo</h3>
                <p className="text-slate-600 mb-4">Compliant, high-resolution ID photos with solid backgrounds for any country.</p>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-500" /> Flat background colors</li>
                  <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-500" /> Even studio lighting</li>
                  <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-500" /> Multi-country sizing support</li>
                </ul>
              </div>
            </div>

            {/* Upload Area */}
            <div className="max-w-xl mx-auto">
              {sourceImage ? (
                <div className="relative group">
                  <img src={sourceImage} alt="Source" className="w-full h-80 object-cover rounded-3xl shadow-xl border-4 border-white" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center gap-4">
                    <button 
                      onClick={() => setSourceImage(null)}
                      className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" /> Change Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-3 border-dashed border-slate-300 rounded-3xl p-12 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*,.pdf" 
                    onChange={handleFileUpload} 
                  />
                  <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="text-indigo-600 w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Upload your photo</h4>
                  <p className="text-slate-500">Drag & drop or click to browse. Supports JPG, PNG, PDF.</p>
                </div>
              )}

              <button
                disabled={!sourceImage || !selectedMode}
                onClick={processImage}
                className={`w-full mt-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${(!sourceImage || !selectedMode) ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:-translate-y-1'}`}
              >
                Generate {selectedMode === PhotoMode.HEADSHOT ? 'Headshot' : 'Passport Photo'}
              </button>
            </div>
          </div>
        )}

        {currentStep === AppState.PROCESSING && (
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-indigo-600 animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Magic is happening...</h2>
            <div className="space-y-3 max-w-sm mx-auto">
              <p className="text-slate-600 animate-pulse flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Analyzing facial features
              </p>
              <p className="text-slate-600 animate-pulse delay-75 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Applying professional attire
              </p>
              <p className="text-slate-600 animate-pulse delay-150 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Enhancing studio lighting
              </p>
            </div>
          </div>
        )}

        {currentStep === AppState.RESULT && resultImage && (
          <div className="animate-in slide-in-from-bottom duration-700">
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              {/* Preview Section */}
              <div className="flex-1 w-full">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                  <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Enhanced Result</span>
                    <div className="flex gap-2">
                       <button onClick={() => setCurrentStep(AppState.HOME)} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-colors">
                         <RefreshCw className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                  <div className="relative bg-slate-200 aspect-[4/5] flex items-center justify-center overflow-hidden">
                    <img src={resultImage} alt="Generated" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* Controls Section */}
              <div className="w-full lg:w-[400px] space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Looks Sharp!</h2>
                  <p className="text-slate-600">Your AI-generated professional photo is ready for use.</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                      <Settings2 className="w-4 h-4 text-indigo-600" /> Fine-tune result
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Background</label>
                        <select 
                          value={background}
                          onChange={(e) => setBackground(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                        >
                          <option value="a modern blurred office interior">Modern Office</option>
                          <option value="a minimalist grey studio background">Classic Grey</option>
                          <option value="a clean plain white studio background">Pure White</option>
                          <option value="a sophisticated dark mahogany library">Library/Executive</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Attire Style</label>
                        <select 
                          value={attire}
                          onChange={(e) => setAttire(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                        >
                          <option value="a professional charcoal suit with a white shirt">Formal Charcoal Suit</option>
                          <option value="a smart business casual blazer with an open-neck shirt">Business Casual</option>
                          <option value="a crisp professional white blouse">Professional Blouse</option>
                          <option value="a black executive suit with a silk tie">Executive Black</option>
                        </select>
                      </div>

                      <button 
                        onClick={processImage}
                        className="w-full py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Brush className="w-4 h-4" /> Re-apply Styles
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={downloadResult}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                  >
                    <Download className="w-6 h-6" /> Download Photo
                  </button>

                  <button 
                    onClick={reset}
                    className="w-full py-3 text-slate-500 font-semibold hover:text-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Start Over
                  </button>
                </div>

                <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex gap-3 items-start">
                  <div className="bg-green-500 p-1 rounded-full shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm text-green-800">
                    <strong>Pro Tip:</strong> This photo has been optimized for Applicant Tracking Systems (ATS) and professional social media compression algorithms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h5 className="font-bold text-slate-900 mb-4">Product</h5>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-indigo-600">Headshot Maker</a></li>
                <li><a href="#" className="hover:text-indigo-600">Passport Tool</a></li>
                <li><a href="#" className="hover:text-indigo-600">API Access</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 mb-4">Support</h5>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-indigo-600">FAQ</a></li>
                <li><a href="#" className="hover:text-indigo-600">Guides</a></li>
                <li><a href="#" className="hover:text-indigo-600">Contact</a></li>
              </ul>
            </div>
            <div className="col-span-2">
              <h5 className="font-bold text-slate-900 mb-4">Newsletter</h5>
              <p className="text-slate-600 mb-4">Get professional photo tips and feature updates.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email address" className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors">Join</button>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-50 text-slate-400 text-sm">
            <p>© 2024 ProShot AI. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-slate-600">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
