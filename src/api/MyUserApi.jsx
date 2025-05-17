const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MyUserApi() {
    async function getPerformanceFromUser(userId) {
        try {
            
            const response = await fetch(`${VITE_API_BASE_URL}/api/my/user/performance/${userId}`, {
                method: 'GET',
            })
            if (!response.ok) {
                throw new Error('Failed to fetch user performance')
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching roadmaps:', error);
            throw error;
        }
    }

    return { getPerformanceFromUser };
};