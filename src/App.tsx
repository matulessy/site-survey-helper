import React, { useState } from 'react';
import { FloorPlanViewer } from './components/FloorPlanViewer';
import { MarkerDetails } from './components/MarkerDetails';
import { UploadFloorPlan } from './components/UploadFloorPlan';
import { Map } from 'lucide-react';
import type { FloorPlan, Marker } from './types';

function App() {
  const [floorPlan, setFloorPlan] = useState<FloorPlan | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);

  const handleFloorPlanUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setFloorPlan({
      id: `plan-${Date.now()}`,
      imageUrl,
      name: file.name,
      markers: [],
    });
  };

  const handleMarkerAdd = (marker: Marker) => {
    if (!floorPlan) return;
    setFloorPlan({
      ...floorPlan,
      markers: [...floorPlan.markers, marker],
    });
    setSelectedMarker(marker);
  };

  const handleMarkerUpdate = (updatedMarker: Marker) => {
    if (!floorPlan) return;
    setFloorPlan({
      ...floorPlan,
      markers: floorPlan.markers.map((m) =>
        m.id === updatedMarker.id ? updatedMarker : m
      ),
    });
  };

  const handleMarkerMove = (id: string, x: number, y: number) => {
    if (!floorPlan) return;
    setFloorPlan({
      ...floorPlan,
      markers: floorPlan.markers.map((m) =>
        m.id === id ? { ...m, x, y } : m
      ),
    });
  };

  const handleMarkerDelete = (id: string) => {
    if (!floorPlan) return;
    setFloorPlan({
      ...floorPlan,
      markers: floorPlan.markers.filter((m) => m.id !== id),
    });
    setSelectedMarker(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <Map className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">
              Floor Plan Annotator
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!floorPlan ? (
          <div className="max-w-2xl mx-auto">
            <UploadFloorPlan onUpload={handleFloorPlanUpload} />
          </div>
        ) : (
          <div className="relative h-[calc(100vh-12rem)]">
            <FloorPlanViewer
              floorPlan={floorPlan}
              onMarkerClick={setSelectedMarker}
              onMarkerAdd={handleMarkerAdd}
              onMarkerMove={handleMarkerMove}
            />
            {selectedMarker && (
              <MarkerDetails
                marker={selectedMarker}
                onClose={() => setSelectedMarker(null)}
                onUpdate={handleMarkerUpdate}
                onDelete={handleMarkerDelete}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;