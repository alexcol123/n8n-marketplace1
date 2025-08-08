import React, { useState } from 'react';
import { BookOpen, Lightbulb, Target, FileText, CheckCircle, ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';

export interface WorkflowStepTeachingProps {

  stepNumber: number;
  stepTitle: string;
  teachingSummary: string;
  teachingExplanation: string;
  teachingTips: string[];
  teachingKeyPoints: string[];
  className?: string;
}

const WorkflowStepTeaching = ({

  stepNumber,
  stepTitle,
  teachingSummary,
  teachingExplanation,
  teachingTips,
  teachingKeyPoints,
  className = ""
}: WorkflowStepTeachingProps) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className={`max-w-5xl mx-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden ${className}`}>
      
      {/* Compact Header - Clean and minimal */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">{stepTitle}</h1>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <div className="flex items-center justify-center w-5 h-5 bg-indigo-100 dark:bg-indigo-900 rounded text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {stepNumber}
              </div>
              <span className="text-sm">Tutorial Step</span>
            </div>
          </div>
        </div>
        
        {/* Summary with larger text */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50 rounded-lg p-4 border border-indigo-100 dark:border-indigo-900/50">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-800 dark:text-indigo-300 uppercase tracking-wide">Summary</span>
          </div>
          <p className="text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
            {teachingSummary}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">

        {/* Main Explanation */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
              <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              How step &quot;{stepTitle}&quot; works
            </h2>
          </div>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">
              {teachingExplanation}
            </p>
          </div>
        </div>

        {/* Collapsible Actions Row - Made smaller */}
        <div className="grid md:grid-cols-2 gap-3">
          
          {/* Pro Tips Toggle - Smaller */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              onClick={() => toggleSection('tips')}
              className="w-full p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 dark:bg-amber-900/50 rounded-md">
                  <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Pro Tips
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {teachingTips.length} tips
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                {activeSection === 'tips' ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {activeSection === 'tips' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
            </button>
            
            {/* Collapsible Tips Content */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
              activeSection === 'tips' ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="p-3 pt-0 border-t border-slate-100 dark:border-slate-700">
                <div className="space-y-2">
                  {teachingTips.map((tip, index) => (
                    <div key={index} className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-md p-2.5 border border-amber-200 dark:border-amber-800/50">
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                          {tip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Key Points Toggle - Smaller */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              onClick={() => toggleSection('keypoints')}
              className="w-full p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/50 rounded-md">
                  <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Key Points
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {teachingKeyPoints.length} points
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                {activeSection === 'keypoints' ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {activeSection === 'keypoints' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
            </button>
            
            {/* Collapsible Key Points Content */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
              activeSection === 'keypoints' ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="p-3 pt-0 border-t border-slate-100 dark:border-slate-700">
                <ul className="space-y-2">
                  {teachingKeyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mt-0.5">
                        <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center pt-4">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Step {stepNumber} completed - Ready for next step</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowStepTeaching;