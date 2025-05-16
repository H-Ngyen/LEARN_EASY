const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RoadMapApi() {
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

  const getRoadmapsByUser = async (userId) => {
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/api/roadmap/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch roadmaps');
      }

      const data = await response.json();
      return data.roadmaps;
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      throw error;
    }
  };

  const getRoadmapById = async (id) => {
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/api/roadmap/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch roadmap');
      }

      const data = await response.json();
      return data.roadmap;
    } catch (error) {
      console.error('Error fetching roadmap:', error);
      throw error;
    }
  };

  return { createRoadMap, getRoadmapsByUser, getRoadmapById };
}