
import React, { useState } from 'react';
import { Song } from '../types';

interface DashboardProps {
  songs: Song[];
  onSelectSong: (song: Song) => void;
  onDeleteSong: (id: string) => void;
  onAdd: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ songs, onSelectSong, onDeleteSong, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    song.lyrics.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fadeIn pb-10">
      {/* Hero Section inspired by logo ribbon */}
      <div className="p-6">
        <div className="relative bg-[#FF4D4D] p-8 rounded-[2.5rem] shadow-2xl overflow-hidden mb-8 flex flex-col items-center border-b-8 border-black/20">
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-black/5 rounded-full blur-3xl"></div>
          
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl rotate-3">
            <i className="fas fa-quote-left text-[#FF4D4D] text-2xl"></i>
          </div>
          
          <p className="relative z-10 text-white text-[15px] font-black text-center italic leading-tight uppercase tracking-tight max-w-[280px]">
            "Fa ny fahasoavan'ANDRIAMANITRA no manery Anay hitory an'i KRISTY"
          </p>
          
          <div className="mt-6 flex items-center gap-3">
            <div className="h-0.5 w-6 bg-black/20"></div>
            <span className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">Omega Fitiavana</span>
            <div className="h-0.5 w-6 bg-black/20"></div>
          </div>
        </div>

        <div className="flex justify-between items-end mb-6 px-2">
          <div>
            <h2 className="text-2xl font-black text-black leading-none">HIRA REHETRA</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Tahiry ho an'ny Fanilon'ny Famonjena</p>
          </div>
          <button 
            onClick={onAdd}
            className="bg-black text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-slate-900 transition-all shadow-xl active:scale-95"
          >
            <i className="fas fa-plus text-lg text-red-500"></i>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative group px-2">
          <div className="absolute inset-y-0 left-6 pl-4 flex items-center pointer-events-none">
            <i className="fas fa-search text-slate-300 group-focus-within:text-red-600 transition-colors"></i>
          </div>
          <input
            type="text"
            placeholder="Hikaroka hira..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 py-4 pl-12 pr-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-red-600/5 focus:border-red-600 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="px-6 space-y-4">
        <div className="flex items-center gap-2 mb-2 px-3">
          <div className="w-1.5 h-4 bg-red-600 rounded-full"></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hira miisa {filteredSongs.length}</span>
        </div>
        
        {filteredSongs.length === 0 ? (
          <div className="text-center py-20 opacity-30">
            <i className="fas fa-music text-6xl mb-4 text-slate-300"></i>
            <p className="font-bold">Tsy misy hira voatahiry</p>
          </div>
        ) : (
          filteredSongs.map((song) => (
            <div 
              key={song.id}
              onClick={() => onSelectSong(song)}
              className="bg-white p-5 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex items-center gap-5 border border-slate-50 active:scale-[0.98]"
            >
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-red-600 shrink-0 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-inner overflow-hidden relative">
                <i className="fas fa-bible text-xl relative z-10"></i>
                <div className="absolute inset-0 bg-red-600 scale-0 group-hover:scale-100 transition-transform origin-center"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-black text-slate-800 truncate uppercase tracking-tight">{song.title}</h3>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[9px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-lg tracking-wider uppercase">
                    {song.category}
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold italic">{song.addedAt}</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                <i className="fas fa-chevron-right text-slate-300 group-hover:text-red-600 transition-colors text-[10px]"></i>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="flex justify-center py-12 opacity-10">
        <img src="./logo.png" alt="Logo Footer" className="w-20 h-20 grayscale object-contain" />
      </div>
    </div>
  );
};

export default Dashboard;
