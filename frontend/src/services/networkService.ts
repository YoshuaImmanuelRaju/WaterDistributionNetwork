import { Network } from '../types/network.ts';

// const API_BASE_URL = 'https://water-network-backend.onrender.com';
const API_BASE_URL = 'http://localhost:8000';

export async function uploadNetwork(
  file: File
): Promise<Network> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `${API_BASE_URL}/networks/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Failed to upload network');
  }

  return response.json();
}

export async function fetchNetwork(networkId: string): Promise<Network> {
  const response = await fetch(`${API_BASE_URL}/networks/${networkId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch updated network data');
  }
  
  return response.json();
}

// Add this to the bottom of networkService.ts
import { Anomaly } from './anomalyService';

export async function fetchOptimizationRecommendations(networkId: string, anomalies: Anomaly[]) {
  if (!anomalies || anomalies.length === 0) return [];

  const response = await fetch(`${API_BASE_URL}/networks/${networkId}/optimize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      anomalies: anomalies,
      hour: new Date().getHours() // Send current hour for time-aware simulation
    }),
  });

  if (!response.ok) {
    console.error("Failed to fetch optimizations");
    return [];
  }

  return response.json();
}
