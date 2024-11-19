export interface Marker {
  id: string;
  x: number;
  y: number;
  imageUrl?: string;
  description?: string;
  date?: string;
}

export interface FloorPlan {
  id: string;
  imageUrl: string;
  name: string;
  markers: Marker[];
}