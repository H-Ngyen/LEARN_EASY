const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function UserAPI() {
    const handleError = (error) => {
        console.error('API Error:', error);
        throw error;
    };

    const loginUser = async (identifier, password) => {
        try {
            const response = await fetch(`${VITE_API_BASE_URL}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            handleError(error);
        }
    };

    const registerUser = async (userData) => {
        try {
            const response = await fetch(`${VITE_API_BASE_URL}/api/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const data = await response.json();
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            handleError(error);
        }
    };

    const getUserId = () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user).userId : null;
    };

const getRanking = async () => {
      try {
        const response = await fetch(`${VITE_API_BASE_URL}/api/user/ranking`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch ranking');
        }

        const data = await response.json();
        return data.ranking;
      } catch (error) {
        console.error('Error fetching ranking:', error);
        throw error;
      }
    };

    return { loginUser, registerUser, getUserId, getRanking };
}