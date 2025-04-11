export const handleApiResponse = (response) => {
    if (!response.ok) {
        throw new Error(response.message || 'Something went wrong');
    }
    return response.data;
};

export const formatErrorMessage = (error) => {
    return error.response?.data?.message || error.message || 'An error occurred';
};