
import React, { useState, useEffect, useRef } from 'react';
import { Song } from '../types';

interface SongDetailProps {
  song: Song;
  onBack: () => void;
  onUpdate: (updatedSong: Song) => void;
  onDelete: (id: string) => void;
}

const SongDetail: React.FC<SongDetailProps> = ({ song, onBack, onUpdate, onDelete }) => {
  const [fontSize, setFontSize] = useState(18);
  const [notes, setNotes] = useState(song.notes || '');
  const [audioUrl, setAudioUrl] = useState(song.audioUrl || '');
  const [pdfUrl, setPdfUrl] = useState(song.pdfUrl || '');
  const [imageUrl, setImageUrl] = useState(song.imageUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  
  // Audio Playback Status States
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  
  // Web Audio API Visualizer States
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Recording & Upload states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [tempAudioUrl, setTempAudioUrl] = useState<string | null>(null);
  const [tempFileName, setTempFileName] = useState<string | null>(null);
  
  // PDF Temp States
  const [tempPdfUrl, setTempPdfUrl] = useState<string | null>(null);
  const [tempPdfName, setTempPdfName] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    setNotes(song.notes || '');
    setAudioUrl(song.audioUrl || '');
    setPdfUrl(song.pdfUrl || '');
    setImageUrl(song.imageUrl || '');
    setIsPlaying(false);
    setCurrentTime(0);
    setTempAudioUrl(null);
    setTempFileName(null);
    setTempPdfUrl(null);
    setTempPdfName(null);
    setShowPdfViewer(false);
    
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  }, [song.id]);

  // Visualizer Animation Loop
  const updateVisualizer = () => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      barsRef.current.forEach((bar, i) => {
        if (bar) {
          const val = dataArray[i] || 0;
          const height = (val / 255) * 80 + 20;
          bar.style.height = `${height}%`;
        }
      });
    }
    animationFrameRef.current = requestAnimationFrame(updateVisualizer);
  };

  const initAudioAPI = () => {
    if (!audioRef.current || audioCtxRef.current) return;
    
    try {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      
      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
    } catch (e) {
      console.error("Audio API initialization failed:", e);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      if (!audioCtxRef.current) initAudioAPI();
      if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();
      updateVisualizer();
    } else {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);

  const handleSaveData = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdate({ ...song, notes, audioUrl, pdfUrl, imageUrl });
      setIsSaving(false);
    }, 600);
  };

  const clearPdfStored = () => {
    if (window.confirm("Tena hofafanao ve ity takelaka PDF ity?")) {
      setPdfUrl('');
    }
  };

  const clearAudioStored = () => {
    if (window.confirm("Tena hofafanao ve ity feo ity?")) {
      setAudioUrl('');
      setIsPlaying(false);
    }
  };

  const clearImageStored = () => {
    if (window.confirm("Tena hofafanao ve ity sary ity?")) {
      setImageUrl('');
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => {
          alert("Tsy afaka mandefa ny feo.");
          setIsPlaying(false);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) audioRef.current.currentTime = time;
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Recording & File Input Logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => audioChunksRef.current.push(event.data);
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' });
        setTempAudioUrl(URL.createObjectURL(audioBlob));
        setTempFileName("Feo_vaovao.mp3");
      };
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      timerIntervalRef.current = window.setInterval(() => setRecordingDuration(p => p + 1), 1000);
    } catch (err) {
      alert("Micro tsy misokatra.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const hasChanges = notes !== (song.notes || '') || audioUrl !== (song.audioUrl || '') || pdfUrl !== (song.pdfUrl || '') || imageUrl !== (song.imageUrl || '');

  return (
    <div className="animate-fadeIn bg-white min-h-full">
      {/* PDF Viewer Layer */}
      {showPdfViewer && pdfUrl && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="p-4 bg-black/80 flex justify-between items-center border-b border-white/10">
            <h3 className="text-white font-bold text-sm truncate">{song.title}</h3>
            <button onClick={() => setShowPdfViewer(false)} className="w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <iframe src={pdfUrl} className="flex-1 w-full border-none" />
        </div>
      )}

      {/* Header */}
      <div className="bg-black p-8 text-white relative border-b-4 border-red-600">
        <div className="flex justify-between items-start mb-6">
          <button onClick={onBack} className="bg-red-600 p-3 rounded-xl shadow-lg">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="flex gap-2">
            {pdfUrl && (
              <button onClick={() => setShowPdfViewer(true)} className="bg-white/10 p-3 rounded-xl flex items-center gap-2">
                <i className="fas fa-file-pdf text-red-500"></i>
                <span className="text-[10px] font-black uppercase">PDF</span>
              </button>
            )}
            <button onClick={() => onDelete(song.id)} className="bg-white/10 p-3 rounded-xl text-white/60">
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
        <h2 className="text-2xl font-black uppercase leading-tight">{song.title}</h2>
        <span className="bg-red-600/20 text-red-500 border border-red-600/30 text-[9px] font-black px-3 py-1 rounded-full uppercase mt-2 inline-block">
          {song.category}
        </span>
      </div>

      <div className="p-8">
        {/* Audio Section */}
        {audioUrl && (
          <div className="mb-8 bg-black rounded-3xl p-6 shadow-xl border border-red-600/20 relative overflow-hidden">
            <div className="flex justify-end mb-2">
               <button onClick={clearAudioStored} className="text-red-500 text-[10px] font-black uppercase hover:underline">
                 <i className="fas fa-times-circle mr-1"></i> Fafao ny feo
               </button>
            </div>
            
            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <button 
                  onClick={togglePlayback} 
                  className={`w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg active:scale-95 transition-all relative z-10 ${isPlaying ? 'animate-scalePulse' : ''}`}
                >
                  {isBuffering ? <i className="fas fa-circle-notch animate-spin"></i> : <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play ml-1'}`}></i>}
                </button>
                {isPlaying && (
                  <div className="absolute -inset-2 bg-red-600/20 rounded-3xl animate-pulse -z-0"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-red-500 uppercase">Hira henoina</p>
                <h4 className="text-white font-bold text-sm truncate">{song.title}</h4>
                <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>

            <div className="relative h-12 flex items-center">
              <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none opacity-20">
                {[...Array(30)].map((_, i) => (
                  <div key={i} ref={el => { barsRef.current[i] = el; }} className="w-0.5 bg-red-500 rounded-full h-[20%] transition-all duration-75"></div>
                ))}
              </div>
              <input type="range" min="0" max={duration || 0} value={currentTime} onChange={handleSeek} className="w-full h-1.5 bg-white/10 rounded-full appearance-none outline-none accent-red-600 z-10" />
            </div>

            <audio ref={audioRef} src={audioUrl} crossOrigin="anonymous" onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={() => setIsPlaying(false)} className="hidden" />
          </div>
        )}

        {/* Lyrics */}
        <div className="flex justify-center gap-2 mb-8 bg-slate-50 p-2 rounded-2xl border border-slate-100">
           <button onClick={() => setFontSize(prev => Math.max(12, prev - 2))} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-600"><i className="fas fa-minus text-xs"></i></button>
           <span className="flex items-center text-[10px] font-black uppercase text-slate-300">Vakiteny</span>
           <button onClick={() => setFontSize(prev => Math.min(36, prev + 2))} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-600"><i className="fas fa-plus text-xs"></i></button>
        </div>
        
        <div className="whitespace-pre-wrap leading-relaxed font-bold text-slate-800 text-center mb-16" style={{ fontSize: `${fontSize}px` }}>
          {song.lyrics}
        </div>

        {/* Media Management Tools */}
        <div className="space-y-6">
          
          {/* Audio Tool */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-slate-800 uppercase">Feo (Audio)</h3>
              {audioUrl && (
                <button onClick={clearAudioStored} className="text-red-600 text-[10px] font-black uppercase"><i className="fas fa-trash mr-1"></i> Fafao</button>
              )}
            </div>
            
            {!tempAudioUrl ? (
              <div className="grid grid-cols-2 gap-3">
                <button onClick={isRecording ? stopRecording : startRecording} className={`p-6 rounded-2xl border-2 transition-all ${isRecording ? 'bg-black border-red-600 text-white' : 'bg-white border-slate-100 text-slate-700'}`}>
                  <i className={`fas ${isRecording ? 'fa-stop text-red-500 animate-pulse' : 'fa-microphone text-red-600'} text-xl mb-2`}></i>
                  <p className="text-[9px] font-black uppercase">{isRecording ? 'Ajanony' : 'Handray feo'}</p>
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="bg-white p-6 rounded-2xl border-2 border-slate-100 text-slate-700">
                  <i className="fas fa-file-audio text-red-600 text-xl mb-2"></i>
                  <p className="text-[9px] font-black uppercase">Fichier feo</p>
                </button>
                <input type="file" ref={fileInputRef} accept="audio/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) { setTempAudioUrl(URL.createObjectURL(file)); setTempFileName(file.name); }
                }} />
              </div>
            ) : (
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600"><i className="fas fa-music"></i></div>
                  <p className="text-xs font-bold text-slate-700 truncate flex-1">{tempFileName}</p>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => { setTempAudioUrl(null); }} className="flex-1 bg-slate-100 py-3 rounded-xl font-black text-[10px] uppercase">Aoka ihany</button>
                   <button onClick={() => { setAudioUrl(tempAudioUrl!); setTempAudioUrl(null); }} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-black text-[10px] uppercase">Hampiasa</button>
                </div>
              </div>
            )}
          </div>

          {/* PDF Tool */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-slate-800 uppercase">Tahirin-kevitra (PDF)</h3>
              {pdfUrl && (
                <button onClick={clearPdfStored} className="text-red-600 text-[10px] font-black uppercase"><i className="fas fa-trash mr-1"></i> Fafao</button>
              )}
            </div>
            
            {!tempPdfUrl ? (
              <button onClick={() => pdfInputRef.current?.click()} className="w-full bg-white p-8 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-red-400 flex flex-col items-center gap-2">
                <i className="fas fa-file-pdf text-red-600 text-2xl"></i>
                <p className="text-[9px] font-black uppercase tracking-tight">Ampidiro ny PDF</p>
              </button>
            ) : (
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col gap-4">
                <p className="text-xs font-bold text-slate-700 text-center">{tempPdfName}</p>
                <div className="flex gap-2">
                   <button onClick={() => setTempPdfUrl(null)} className="flex-1 bg-slate-100 py-3 rounded-xl font-black text-[10px] uppercase">Hanafoana</button>
                   <button onClick={() => { setPdfUrl(tempPdfUrl!); setTempPdfUrl(null); }} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-black text-[10px] uppercase">Hampiasa</button>
                </div>
              </div>
            )}
            <input type="file" ref={pdfInputRef} accept="application/pdf" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => { setTempPdfUrl(reader.result as string); setTempPdfName(file.name); };
                reader.readAsDataURL(file);
              }
            }} />
          </div>

          {/* Image Tool */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-slate-800 uppercase">Sary (Image)</h3>
              {imageUrl && (
                <button onClick={clearImageStored} className="text-red-600 text-[10px] font-black uppercase"><i className="fas fa-trash mr-1"></i> Fafao</button>
              )}
            </div>
            
            {imageUrl ? (
              <div className="relative group rounded-2xl overflow-hidden border-2 border-slate-200">
                <img src={imageUrl} className="w-full h-48 object-cover" alt="Source Image" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                   <button onClick={clearImageStored} className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase">Fafao ity sary ity</button>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
                 <p className="text-[10px] text-slate-400 font-bold uppercase">Tsy misy sary voatahiry</p>
                 <p className="text-[8px] text-slate-300 mt-1 italic">Afaka mampiditra sary avy amin'ny "Import" ianao.</p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
            <h3 className="text-sm font-black text-slate-800 uppercase mb-4">Fanamarihana</h3>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="..." className="w-full h-32 bg-white rounded-2xl p-4 text-sm border border-slate-200 outline-none" />
          </div>

          <button onClick={handleSaveData} disabled={isSaving || !hasChanges} className="w-full bg-black text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest disabled:opacity-30 shadow-xl flex items-center justify-center gap-3">
            {isSaving ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-save text-red-500"></i>}
            TEHIRIZO NY FANOVANA REHETRA
          </button>
        </div>

        <div className="mt-12 pt-10 border-t border-slate-50 text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">STK Fanilon'ny FAMONJENA</p>
        </div>
      </div>
    </div>
  );
};

export default SongDetail;
