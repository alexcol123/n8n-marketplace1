import React from 'react';
import { BookOpen, Lightbulb, Target, FileText } from 'lucide-react';

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

const WorkflowStepTeaching: React.FC<WorkflowStepTeachingProps> = ({
  id,
  stepNumber,
  stepTitle,
  teachingSummary,
  teachingExplanation,
  teachingTips,
  teachingKeyPoints,
  className = ""
}) => {

  return (
    <div className={`max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full">
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {stepNumber}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {stepTitle}
          </h2>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-3">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-blue-900 dark:text-blue-100 text-sm uppercase tracking-wide">
              Summary
            </span>
          </div>
          <p className="text-base font-medium text-blue-800 dark:text-blue-200 leading-relaxed">
            {teachingSummary}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Explanation */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              What This Step Does
            </h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {teachingExplanation}
          </p>
        </div>

        {/* Tips */}
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Pro Tips
            </h3>
          </div>
          <ul className="space-y-2">
            {teachingTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  {tip}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Key Points */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Key Learning Points
            </h3>
          </div>
          <ul className="space-y-2">
            {teachingKeyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkflowStepTeaching;