const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MyRoadmapApi(){
   const updateRoadmap = async (id, roadmapData) => {
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/api/my/roadmap/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roadmapData),
      });

      if (!response.ok) {
        throw new Error('Failed to update roadmap');
      }

      const data = await response.json();
      return data.roadmap;
    } catch (error) {
      console.error('Error updating roadmap:', error);
      throw error;
    }
  };
  return { updateRoadmap, }
};