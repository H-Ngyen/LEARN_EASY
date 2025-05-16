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
            return data;
        } catch (error) {
            handleError(error);
        }
    };

    return { loginUser, registerUser };
}