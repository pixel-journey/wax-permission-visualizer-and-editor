'use client';

import React from 'react';

interface Template {
  name: string;
  description: string;
  useCase: string;
}

interface CommonPermissionTemplatesProps {
  templates: Template[];
  onSelect?: (template: Template) => void;
  className?: string;
}

/**
 * Component showing common permission structure templates.
 * Educational and practical for quick starts.
 */
export function CommonPermissionTemplates({ templates, onSelect, className = '' }: CommonPermissionTemplatesProps) {
  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Common Permission Templates</h3>

      <div className="space-y-3">
        {templates.length > 0 ? (
          templates.map((template, index) => (
            <div
              key={index}
              onClick={() => onSelect?.(template)}
              className="cursor-pointer bg-white/5 hover:bg-white/10 rounded-lg p-3 transition-colors"
            >
              <div className="font-medium text-emerald-400">{template.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{template.description}</div>
              <div className="text-xs text-amber-400 mt-1">Use case: {template.useCase}</div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No templates available.</p>
        )}
      </div>
    </div>
  );
}
