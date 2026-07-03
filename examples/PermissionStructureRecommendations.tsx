'use client';

import React from 'react';

interface Recommendation {
  useCase: string;
  recommendedStructure: string;
  keyPoints: string[];
}

interface PermissionStructureRecommendationsProps {
  recommendations: Recommendation[];
  className?: string;
}

/**
 * Component showing recommended permission structures for different use cases.
 * Educational and practical for quick guidance.
 */
export function PermissionStructureRecommendations({ recommendations, className = '' }: PermissionStructureRecommendationsProps) {
  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Recommended Permission Structures</h3>

      <div className="space-y-4">
        {recommendations.length > 0 ? (
          recommendations.map((rec, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4">
              <div className="font-medium text-emerald-400 mb-1">{rec.useCase}</div>
              <div className="text-sm mb-2">{rec.recommendedStructure}</div>
              <ul className="text-xs text-muted-foreground list-disc list-inside">
                {rec.keyPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No recommendations available.</p>
        )}
      </div>
    </div>
  );
}
