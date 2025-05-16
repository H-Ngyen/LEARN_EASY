const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MyRoadmapApi() {
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

  const SaveRoadmapFromCommunityApi = async ({id, userId}) => {
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/api/my/roadmap/community/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, userId })
      })

      if (!response.ok) {
        throw new Error('Failed to download roadmap from community');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error down download from community:', error);
      throw error;
    }
  }

  return { updateRoadmap, SaveRoadmapFromCommunityApi }
};