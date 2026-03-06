
import React from 'react';
import { View } from '../types';

interface NavigationProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setCurrentView }) => {
  const items = [
    { view: View.DASHBOARD, icon: 'fa-bible', label: 'Hira' },
    { view: View.AI_IMPORT, icon: 'fa-magic', label: 'Import' },
    { view: View.SETTINGS, icon: 'fa-info-circle', label: 'Momba' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-black border-t border-red-600/30 px-6 py-4 flex justify-around items-center z-20 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.5)]">
      {items.map((item) => (
        <button
          key={item.view}
          onClick={() => setCurrentView(item.view)}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            currentView === item.view ? 'text-white scale-110' : 'text-slate-500'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            currentView === item.view ? 'bg-red-600 shadow-lg shadow-red-900/40' : 'bg-transparent'
          }`}>
            <i className={`fas ${item.icon} text-lg`}></i>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest mt-1">{item.label}</span>
          {currentView === item.view && (
            <div className="w-1 h-1 bg-white rounded-full mt-1"></div>
          )}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
