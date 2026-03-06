
import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="p-6 animate-fadeIn pb-24">
      <h2 className="text-2xl font-black text-black mb-8 flex items-center gap-4">
        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-100">
          <i className="fas fa-info-circle"></i>
        </div>
        Mombamomba
      </h2>
      
      <div className="space-y-6">
        <section className="bg-white p-8 rounded-[40px] border-b-8 border-red-600 text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-red-600/10"></div>
          
          <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-slate-50 shadow-2xl overflow-hidden ring-8 ring-red-50">
            <img 
              src="./logo.png"
              alt="Logo Fanilon'ny Famonjena" 
              className="w-full h-full object-contain p-2"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<i class="fas fa-fire-alt text-5xl text-red-600"></i>';
              }}
            />
          </div>

          <h3 className="text-3xl font-black text-black mb-1 tracking-tighter">TSY AZO AMIDY</h3>
          <p className="text-[11px] font-black text-red-600 uppercase tracking-[0.2em] mb-6">NOT FOR SALE</p>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-px w-8 bg-slate-200"></div>
            <i className="fas fa-dove text-slate-300 text-xs"></i>
            <div className="h-px w-8 bg-slate-200"></div>
          </div>

          <p className="text-sm text-slate-600 font-bold leading-relaxed px-4">
            Ity fampiharana ity dia natao manokana ho an'ny voninahitr'Andriamanitra sy ho fitaovana ho an'ny <strong>STK Fanilon'ny FAMONJENA</strong>. 
          </p>
        </section>

        <section className="bg-black p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
           <div className="absolute -right-8 -bottom-8 text-[140px] text-white/5 rotate-12">
             <i className="fas fa-bible"></i>
           </div>
           
           <div className="flex justify-center mb-6 relative z-10">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                <i className="fas fa-quote-left text-red-600 text-2xl"></i>
              </div>
           </div>

           <p className="text-base leading-tight text-center font-black italic relative z-10 uppercase tracking-tight mb-8">
            "Fa ny fahasoavan'ANDRIAMANITRA no manery Anay hitory an'i KRISTY"
          </p>

          <div className="pt-6 border-t border-white/10 flex justify-between items-center relative z-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-widest uppercase text-red-500">Fanilon'ny</span>
              <span className="text-lg font-black tracking-widest uppercase">Famonjena</span>
            </div>
            <div className="bg-red-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/50">
              <i className="fas fa-music text-white"></i>
            </div>
          </div>
        </section>

        <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <i className="fas fa-database text-red-600"></i>
            Fampahalalana ny APP
          </h4>
          <div className="space-y-5">
            <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                <span className="text-sm font-bold text-slate-700">Anarana</span>
                <span className="text-sm font-black text-red-600">Fanilon'ny Famonjena</span>
            </div>
            <div className="flex flex-col gap-2 pb-4 border-b border-slate-50">
                <span className="text-sm font-bold text-slate-700">Fikambanana</span>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-black">STK FANILON'NY FAMONJENA</span>
                  <span className="text-[11px] font-bold text-slate-500 uppercase">FITANDREMANA OMEGA FITIAVANA Antanimalandy</span>
                </div>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                <span className="text-sm font-bold text-slate-700">Faritra</span>
                <span className="text-sm font-black text-black uppercase tracking-tighter">MAJUNGA</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-700">Version</span>
                <span className="text-sm font-black text-slate-400">1.0.4</span>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-12 text-center">
        <div className="inline-block bg-black text-white text-[10px] font-black px-6 py-3 rounded-full uppercase tracking-[0.2em] border border-red-600 shadow-xl shadow-slate-200">
            Miderà an'i Jehovah
        </div>
        <p className="text-[10px] mt-6 font-bold text-slate-300 uppercase tracking-tighter italic">STK Fanilon'ny FAMONJENA © 2025</p>
      </div>
    </div>
  );
};

export default Settings;
