
import React, { useState, useEffect } from 'react';
import { View, Song } from './types';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import Navigation from './components/Navigation';
import SongDetail from './components/SongDetail';
import Settings from './components/Settings';

const STORAGE_KEY = 'stk_fanilonny_famonjena_songs_v1';

const DEFAULT_SONGS: Song[] = [
  {
    id: '1',
    title: 'Miderà an\'i Jehovah',
    lyrics: 'Couplet 1:\nMiderà an\'i Jehovah ry fanahiko...\n\nRefrain:\nHaleloia, Haleloia!',
    category: 'Fiderana',
    addedAt: '2024-05-20',
    notes: 'Hira fiderana fampiasa matetika amin\'ny fanombohana fotoana.'
  },
  {
    id: '2',
    title: 'Ny Fanilonay',
    lyrics: 'Hira faneva...\n\nFanilon\'ny Famonjena izahay...',
    category: 'Faneva',
    addedAt: '2024-05-21'
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  
  const [songs, setSongs] = useState<Song[]>(() => {
    try {
      const savedSongs = localStorage.getItem(STORAGE_KEY);
      if (savedSongs) {
        return JSON.parse(savedSongs);
      }
    } catch (error) {
      console.error("Fahadisoana teo am-pamakiana ny LocalStorage:", error);
    }
    return DEFAULT_SONGS;
  });

  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
    } catch (error) {
      console.error("Tsy afaka nitahiry tao amin'ny LocalStorage:", error);
    }
  }, [songs]);

  const handleAddSong = (newSong: Song) => {
    setSongs(prev => [newSong, ...prev]);
    setCurrentView(View.DASHBOARD);
  };

  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
    setCurrentView(View.SONG_DETAIL);
  };

  const handleUpdateSong = (updatedSong: Song) => {
    setSongs(prev => prev.map(s => s.id === updatedSong.id ? updatedSong : s));
    setSelectedSong(updatedSong);
  };

  const handleDeleteSong = (id: string) => {
    if (window.confirm('Tena hofafanao ve ity hira ity?')) {
      const updatedSongs = songs.filter(s => s.id !== id);
      setSongs(updatedSongs);
      setCurrentView(View.DASHBOARD);
      setSelectedSong(null);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return (
          <Dashboard 
            songs={songs} 
            onSelectSong={handleSelectSong} 
            onDeleteSong={handleDeleteSong}
            onAdd={() => setCurrentView(View.AI_IMPORT)} 
          />
        );
      case View.AI_IMPORT:
        return <AIAssistant onSongImported={handleAddSong} />;
      case View.SONG_DETAIL:
        return selectedSong ? (
          <SongDetail 
            song={selectedSong} 
            onBack={() => setCurrentView(View.DASHBOARD)} 
            onUpdate={handleUpdateSong}
            onDelete={handleDeleteSong}
          />
        ) : <Dashboard songs={songs} onSelectSong={handleSelectSong} onDeleteSong={handleDeleteSong} onAdd={() => setCurrentView(View.AI_IMPORT)} />;
      case View.SETTINGS:
        return <Settings />;
      default:
        return <Dashboard songs={songs} onSelectSong={handleSelectSong} onDeleteSong={handleDeleteSong} onAdd={() => setCurrentView(View.AI_IMPORT)} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 max-w-lg mx-auto border-x border-slate-200 shadow-2xl overflow-hidden relative">
      <header className="bg-white pt-8 pb-4 px-6 sticky top-0 z-30 flex flex-col items-center justify-center shadow-sm border-b-4 border-red-600">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-slate-100 shadow-2xl ring-8 ring-red-50">
              <img 
                src="./logo.png" 
                alt="Logo STK Fanilon'ny Famonjena" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<i class="fas fa-bible text-5xl text-red-600"></i>';
                }}
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-black rounded-xl flex items-center justify-center text-sm text-white border-2 border-white shadow-lg rotate-12">
              <i className="fas fa-music text-red-500"></i>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-black tracking-tighter text-black leading-none uppercase">Fanilon'ny Famonjena</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="h-0.5 w-4 bg-red-600 rounded-full"></span>
              <p className="text-[10px] font-black text-red-600 tracking-[0.4em] uppercase">OMEGA FITIAVANA</p>
              <span className="h-0.5 w-4 bg-red-600 rounded-full"></span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 bg-slate-50">
        {renderView()}
      </main>

      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
};

export default App;
