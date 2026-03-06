
import React, { useState, useRef } from 'react';
import { Song } from '../types';
import { processLyricInput } from '../services/geminiService';

interface AIAssistantProps {
  onSongImported: (song: Song) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onSongImported }) => {
  const [input, setInput] = useState('');
  const [fileData, setFileData] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState<{ title: string; lyrics: string; category: string; reasoning: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileData(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setFileData(null);
    setFileName(null);
    setMimeType('image/jpeg');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleProcess = async () => {
    if (!input && !fileData) return;
    setIsLoading(true);
    setError(null);

    try {
      const base64Data = fileData ? fileData.split(',')[1] : undefined;
      const result = await processLyricInput(input, base64Data, mimeType);

      if (!result.title || !result.lyrics) {
        throw new Error("Tsy nahazo valiny mazava avy amin'ny AI.");
      }
      
      setReviewData({
        title: result.title,
        lyrics: result.lyrics,
        category: result.category || 'Hafa',
        reasoning: result.categoryReasoning || ''
      });
    } catch (err: any) {
      setError(err.message || "Nisy olana teo am-panodinana ny hira.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!reviewData) return;
    
    const newSong: Song = {
      id: Date.now().toString(),
      title: reviewData.title,
      lyrics: reviewData.lyrics,
      category: reviewData.category,
      addedAt: new Date().toISOString().split('T')[0],
      // If the source was a PDF, attach it to the new song
      pdfUrl: mimeType === 'application/pdf' ? (fileData || undefined) : undefined
    };

    onSongImported(newSong);
    setReviewData(null);
    clearFile();
  };

  if (reviewData) {
    return (
      <div className="p-6 animate-fadeIn pb-24">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setReviewData(null)} className="text-slate-400 hover:text-red-600 transition-colors">
            <i className="fas fa-arrow-left text-xl"></i>
          </button>
          <h2 className="text-2xl font-black text-black leading-tight">Hamarino ny valiny</h2>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Lohatenin'ny hira</label>
              <input 
                type="text" 
                value={reviewData.title}
                onChange={(e) => setReviewData({...reviewData, title: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Sokajy naroso</label>
                <div className="flex items-center gap-1.5 bg-red-50 px-2 py-0.5 rounded text-[9px] font-bold text-red-600">
                  <i className="fas fa-sparkles text-[8px]"></i>
                  <span>Soso-kevitra AI</span>
                </div>
              </div>
              <div className="relative">
                <select 
                  value={reviewData.category}
                  onChange={(e) => setReviewData({...reviewData, category: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold text-red-600 focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none appearance-none"
                >
                  <option value="Fiderana">Fiderana</option>
                  <option value="Fibebahana">Fibebahana</option>
                  <option value="Faneva">Faneva</option>
                  <option value="Fanahy Masina">Fanahy Masina</option>
                  <option value="Noely">Noely</option>
                  <option value="Paska">Paska</option>
                  <option value="Fanoloran-tena">Fanoloran-tena</option>
                  <option value="Fitiavana">Fitiavana</option>
                  <option value="Fisaorana">Fisaorana</option>
                  <option value="Hafa">Hafa</option>
                </select>
                <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-xs"></i>
              </div>
              
              {reviewData.reasoning && (
                <div className="mt-2.5 bg-slate-50/80 p-3 rounded-xl border border-slate-100 flex items-start gap-3">
                  <i className="fas fa-info-circle text-red-400 mt-0.5 text-xs"></i>
                  <p className="text-[11px] text-slate-500 font-medium italic leading-relaxed">
                    "{reviewData.reasoning}"
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Tonon-kira voarindra</label>
              <textarea 
                value={reviewData.lyrics}
                onChange={(e) => setReviewData({...reviewData, lyrics: e.target.value})}
                className="w-full h-80 bg-slate-50 border border-slate-200 p-4 rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={handleSave}
              className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-red-700 shadow-xl shadow-red-200 transition-all active:scale-95"
            >
              <i className="fas fa-check-circle"></i>
              TEHIRIZO IZAO
            </button>
            
            <button 
              onClick={() => setReviewData(null)}
              className="w-full bg-black text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95"
            >
              <i className="fas fa-redo text-[10px]"></i>
              Avereno ny fanodinana
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPDF = mimeType === 'application/pdf';

  return (
    <div className="p-6 animate-fadeIn pb-24">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200">
           <i className="fas fa-wand-magic-sparkles text-xl"></i>
        </div>
        <div>
          <h2 className="text-2xl font-black text-black">Manafatra Hira</h2>
          <p className="text-xs text-slate-500 font-medium italic">Ampiasao ny AI hamakiana ny tonon-kira</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-4xl text-black">
            <i className="fas fa-robot"></i>
          </div>
          
          <h3 className="font-bold text-black mb-4 flex items-center gap-2">
            Ampidiro ny tahirin-kevitra
          </h3>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center gap-3 hover:border-red-400 hover:bg-red-50 transition-all active:scale-95"
            >
              <i className="fas fa-file-pdf-o text-red-600 text-2xl hidden group-hover:block"></i>
              <div className="flex gap-2">
                 <i className="fas fa-camera text-red-600 text-xl"></i>
                 <i className="fas fa-file-pdf text-red-600 text-xl"></i>
              </div>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter text-center">
                Maka sary na PDF
              </span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
            />
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center overflow-hidden">
              {fileData ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                   {isPDF ? (
                     <div className="text-center p-1">
                        <i className="fas fa-file-pdf text-red-600 text-2xl mb-1"></i>
                        <p className="text-[8px] font-bold text-slate-500 truncate max-w-[80px]">{fileName}</p>
                     </div>
                   ) : (
                     <img src={fileData} className="w-full h-16 object-cover rounded shadow-sm" alt="Preview" />
                   )}
                   <button 
                    onClick={(e) => { e.stopPropagation(); clearFile(); }} 
                    className="absolute -top-1 -right-1 bg-black text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md active:scale-90"
                   >
                    <i className="fas fa-times text-[10px]"></i>
                   </button>
                </div>
              ) : (
                <div className="text-center">
                   <i className="fas fa-file-alt text-slate-300 mb-2"></i>
                   <p className="text-[9px] text-slate-400 font-bold uppercase italic leading-none">Tsy misy rakitra</p>
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ampidiro eto ny lahatsoratra na torolàlana fanampiny..."
              className="w-full h-40 bg-slate-50 rounded-2xl p-4 text-sm border border-slate-200 focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all resize-none font-medium text-slate-700"
            />
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-[11px] font-bold border border-red-100 flex items-center gap-2">
              <i className="fas fa-exclamation-triangle"></i>
              {error}
            </div>
          )}

          <button 
            onClick={handleProcess}
            disabled={isLoading || (!input && !fileData)}
            className="w-full mt-6 bg-red-600 text-white py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-red-200 transition-all active:scale-95"
          >
            {isLoading ? (
              <>
                <i className="fas fa-circle-notch animate-spin"></i>
                Eo am-pamakiana sy famakafakana...
              </>
            ) : (
              <>
                <i className="fas fa-microchip"></i>
                HIKARAKARA NY HIRA
              </>
            )}
          </button>
        </div>
        
        <div className="bg-slate-100/50 p-6 rounded-3xl border border-slate-100 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-amber-400"></div>
          <i className="fas fa-lightbulb text-amber-500 mb-2"></i>
          <p className="text-[10px] text-slate-500 font-medium leading-relaxed px-2">
            Afaka mampiditra rakitra <strong>PDF</strong> ianao izao. Ny AI dia handinika ny takelaka rehetra ao anatin'ilay rakitra mba hamoahana ny tonon-kira voarindra.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
