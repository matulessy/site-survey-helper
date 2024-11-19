import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { MapPin, ZoomIn, ZoomOut, Move } from 'lucide-react';
import type { Marker, FloorPlan } from '../types';

interface MarkerProps {
  marker: Marker;
  onClick: () => void;
}

const MarkerPoint: React.FC<MarkerProps> = ({ marker, onClick }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: marker.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        left: `${marker.x}%`,
        top: `${marker.y}%`,
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
        ...style
      }}
      onClick={onClick}
      {...listeners}
      {...attributes}
    >
      <MapPin className="w-6 h-6 text-red-500 hover:text-red-600 transition-colors" />
    </div>
  );
};

interface FloorPlanViewerProps {
  floorPlan: FloorPlan;
  onMarkerClick: (marker: Marker) => void;
  onMarkerAdd: (marker: Marker) => void;
  onMarkerMove: (id: string, x: number, y: number) => void;
}

export const FloorPlanViewer: React.FC<FloorPlanViewerProps> = ({
  floorPlan,
  onMarkerClick,
  onMarkerAdd,
  onMarkerMove,
}) => {
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const { setNodeRef } = useDroppable({ id: 'droppable' });

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingMarker) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newMarker: Marker = {
      id: `marker-${Date.now()}`,
      x,
      y,
    };

    onMarkerAdd(newMarker);
    setIsAddingMarker(false);
  };

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setIsAddingMarker(!isAddingMarker)}
          className={`p-2 rounded-lg ${
            isAddingMarker ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
          } shadow-lg hover:bg-blue-600 transition-colors`}
        >
          <MapPin className="w-5 h-5" />
        </button>
      </div>

      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={4}
        wheel={{ disabled: isAddingMarker }}
        pan={{ disabled: isAddingMarker }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute bottom-4 right-4 z-10 flex gap-2">
              <button
                onClick={() => zoomIn()}
                className="p-2 rounded-lg bg-white text-gray-700 shadow-lg hover:bg-gray-50"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={() => zoomOut()}
                className="p-2 rounded-lg bg-white text-gray-700 shadow-lg hover:bg-gray-50"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={() => resetTransform()}
                className="p-2 rounded-lg bg-white text-gray-700 shadow-lg hover:bg-gray-50"
              >
                <Move className="w-5 h-5" />
              </button>
            </div>

            <TransformComponent wrapperClass="w-full h-full">
              <div
                ref={setNodeRef}
                className="relative cursor-crosshair"
                onClick={handleImageClick}
              >
                <img
                  src={floorPlan.imageUrl}
                  alt={floorPlan.name}
                  className="max-w-full h-auto"
                />
                <DndContext onDragEnd={({ active, delta }) => {
                  if (active) {
                    const marker = floorPlan.markers.find(m => m.id === active.id);
                    if (marker) {
                      onMarkerMove(
                        marker.id,
                        marker.x + (delta.x / window.innerWidth) * 100,
                        marker.y + (delta.y / window.innerHeight) * 100
                      );
                    }
                  }
                }}>
                  {floorPlan.markers.map((marker) => (
                    <MarkerPoint
                      key={marker.id}
                      marker={marker}
                      onClick={() => onMarkerClick(marker)}
                    />
                  ))}
                </DndContext>
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};