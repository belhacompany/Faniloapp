
import React from 'react';
import { Project } from '../types';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onOpenAI: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, onOpenAI }) => {
  return (
    <div className="animate-fadeIn">
      <div className="relative h-48 bg-indigo-600 p-6 flex flex-col justify-end overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-[120px]">
          <i className="fas fa-mobile-alt"></i>
        </div>
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 text-white/80 hover:text-white bg-white/10 backdrop-blur-md p-2 rounded-lg transition-colors"
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <div className="relative z-10">
          <span className="text-[10px] font-bold text-indigo-100 bg-indigo-500 px-2 py-0.5 rounded-full uppercase tracking-widest mb-2 inline-block">
            {project.language}
          </span>
          <h2 className="text-3xl font-bold text-white leading-tight">{project.name}</h2>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-2xl -mt-12 p-6 shadow-xl border border-gray-100 relative z-10">
          <h3 className="font-bold text-gray-800 mb-2">Description</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            {project.description}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Plateforme</span>
              <span className="text-sm font-bold text-gray-700">{project.platform}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Dernier Commit</span>
              <span className="text-sm font-bold text-gray-700">Hier</span>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="font-bold text-gray-800 px-1">Étapes Suivantes</h3>
          
          <div className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-4 hover:border-indigo-100 transition-colors group">
            <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
              <i className="fas fa-pencil-ruler"></i>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-800">Maquettage UI</h4>
              <p className="text-xs text-gray-400">Définir les écrans principaux</p>
            </div>
            <div className="w-5 h-5 border-2 border-gray-200 rounded group-hover:border-orange-200"></div>
          </div>

          <div className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-4 hover:border-indigo-100 transition-colors group">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
              <i className="fas fa-database"></i>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-800">Architecture Data</h4>
              <p className="text-xs text-gray-400">Modèles et stockage local</p>
            </div>
            <div className="w-5 h-5 border-2 border-gray-200 rounded group-hover:border-blue-200"></div>
          </div>
        </div>

        <button 
          onClick={onOpenAI}
          className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
        >
          <i className="fas fa-robot"></i>
          Aider moi à coder l'étape suivante
        </button>
      </div>
    </div>
  );
};

export default ProjectDetail;
