import React from "react";
import {
  BookOpen,
  Lightbulb,
  Target,
  FileText,
  Play,
  CheckCircle,
} from "lucide-react";

interface WorkflowStepTeachingProps {
  id: string;
  stepNumber: number;
  stepTitle: string;
  teachingSummary: string;
  teachingExplanation: string;
  teachingTips: string[];
  teachingKeyPoints: string[];
  className?: string;
}

const WorkflowStepTeaching = ({
  id,
  stepNumber,
  stepTitle,
  teachingSummary,
  teachingExplanation,
  teachingTips,
  teachingKeyPoints,
  className = "",
}: WorkflowStepTeachingProps) => {
  return (
    <div
      className={`max-w-5xl mx-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden ${className}`}
    >
      {/* Header Section with gradient */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
              <span className="text-lg font-bold">{stepNumber}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">{stepTitle}</h1>
              <div className="flex items-center gap-2 text-white/80">
                <Play className="w-4 h-4" />
                <span className="text-sm">Step {stepNumber} Tutorial</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-white/80 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Ready to learn</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Summary - Hero style */}
        <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
          <div className="absolute top-4 right-4 opacity-20">
            <FileText className="w-16 h-16" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold tracking-wide uppercase">
                Quick Summary
              </div>
            </div>
            <p className="text-xl font-semibold leading-relaxed">
              {teachingSummary}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Explanation - Takes more space */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                How It Works
              </h2>
            </div>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">
                {teachingExplanation}
              </p>
            </div>
          </div>

          {/* Key Points - Sidebar */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Key Points
              </h3>
            </div>
            <ul className="space-y-3">
              {teachingKeyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pro Tips - Full width with cards */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
              <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Pro Tips & Best Practices
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachingTips.map((tip, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800/50"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    {tip}
                  </p>
                </div>
              </div>
            ))}
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
