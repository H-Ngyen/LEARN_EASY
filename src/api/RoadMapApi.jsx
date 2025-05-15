const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CreateRoadMapApi() {
  const createRoadMap = async ({ topic, userId, level, duration }) => {
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/api/roadmap/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          userId,
          level,
          duration,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create roadmap');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating roadmap:', error);
      throw error;
    }
  };

  return { createRoadMap };
}