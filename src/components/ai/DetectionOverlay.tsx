'use client';

import React from 'react';
import { Detection } from '../../types/ai';

interface DetectionOverlayProps {
  detections: Detection[];
  imageWidth: number;
  imageHeight: number;
  onSelectDetection?: (detection: Detection) => void;
  selectedDetectionId?: number;
}

export const DetectionOverlay: React.FC<DetectionOverlayProps> = ({
  detections,
  imageWidth,
  imageHeight,
  onSelectDetection,
  selectedDetectionId,
}) => {
  if (!detections || detections.length === 0) return null;

  if (!imageWidth || !imageHeight) return null;

  const colors = [
    {
      border: 'border-emerald-400',
      bg: 'bg-emerald-500/10',
      tag: 'bg-emerald-500 text-slate-950',
    },
    {
      border: 'border-cyan-400',
      bg: 'bg-cyan-500/10',
      tag: 'bg-cyan-500 text-slate-950',
    },
    {
      border: 'border-amber-400',
      bg: 'bg-amber-500/10',
      tag: 'bg-amber-500 text-slate-950',
    },
    {
      border: 'border-purple-400',
      bg: 'bg-purple-500/10',
      tag: 'bg-purple-500 text-slate-950',
    },
  ];

  return (
    <div
      className="absolute pointer-events-none z-20"
      style={{
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
      }}
    >
      {detections.map((det, index) => {
        const bbox = det.bbox;
        const color = colors[index % colors.length];

        const isSelected =
          selectedDetectionId === det.class_id;

        const leftPercent =
          (bbox.x1 / imageWidth) * 100;

        const topPercent =
          (bbox.y1 / imageHeight) * 100;

        const widthPercent =
          ((bbox.x2 - bbox.x1) / imageWidth) * 100;

        const heightPercent =
          ((bbox.y2 - bbox.y1) / imageHeight) * 100;

        const confidencePct =
          Math.round(det.confidence * 100);

        return (
          <div
            key={`${det.class_name}-${index}`}
            style={{
              left: `${leftPercent}%`,
              top: `${topPercent}%`,
              width: `${widthPercent}%`,
              height: `${heightPercent}%`,
            }}
            onClick={() => onSelectDetection?.(det)}
            className={`
              absolute
              border-2
              ${color.border}
              ${color.bg}
              rounded-lg
              pointer-events-auto
              cursor-pointer
              transition-all
              shadow-lg
              ${isSelected
                ? 'ring-4 ring-white shadow-emerald-500/50'
                : ''
              }
            `}
          >
            <div className="absolute -top-3.5 left-2 flex items-center space-x-1 shadow-md">
              <span
                className={`
                  px-2
                  py-0.5
                  rounded
                  text-[11px]
                  font-black
                  tracking-wide
                  uppercase
                  shadow-sm
                  ${color.tag}
                `}
              >
                {det.class_name}
              </span>

              <span className="bg-slate-950/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-700">
                {confidencePct}%
              </span>
            </div>

            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white rounded-full border border-slate-900" />

            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full border border-slate-900" />

            <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-white rounded-full border border-slate-900" />

            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white rounded-full border border-slate-900" />
          </div>
        );
      })}
    </div>
  );
};