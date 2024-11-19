import React, { useState } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import type { Marker } from '../types';

interface MarkerDetailsProps {
  marker: Marker;
  onClose: () => void;
  onUpdate: (marker: Marker) => void;
  onDelete: (id: string) => void;
}

export const MarkerDetails: React.FC<MarkerDetailsProps> = ({
  marker,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [description, setDescription] = useState(marker.description || '');
  const [imageUrl, setImageUrl] = useState(marker.imageUrl || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...marker,
      description,
      imageUrl,
      date: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Marker Details</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo
          </label>
          {imageUrl ? (
            <div className="relative group">
              <img
                src={imageUrl}
                alt="Location"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="w-8 h-8 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Upload a photo or paste a URL
              </p>
              <input
                type="text"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="mt-2 w-full px-3 py-2 border rounded-md"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Add notes about this location..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => onDelete(marker.id)}
            className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};