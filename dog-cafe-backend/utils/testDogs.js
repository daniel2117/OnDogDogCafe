const axios = require('axios');

const API_URL = 'http://localhost:10000/api';

const testDogAPI = async () => {
    try {
        console.log('Testing Dog API...\n');

        // Test pagination
        for (let page = 1; page <= 3; page++) {
            console.log(`\nFetching page ${page}...`);
            const response = await axios.get(`${API_URL}/adoption/dogs`, {
                params: { page, limit: 9 }
            });
            
            console.log(`Page ${page} results:`, {
                totalDogs: response.data.total,
                currentPage: response.data.currentPage,
                dogsInPage: response.data.dogs.length
            });
        }

        // Test filters
        console.log('\nTesting filters...');
        const filters = {
            breed: 'Shiba Inu',
            size: 'small',
            gender: 'female'
        };

        const filteredResponse = await axios.get(`${API_URL}/adoption/dogs`, {
            params: { ...filters, page: 1, limit: 9 }
        });

        console.log('Filtered results:', {
            totalFiltered: filteredResponse.data.total,
            dogsFound: filteredResponse.data.dogs.length,
            appliedFilters: filters
        });

    } catch (error) {
        console.error('Test failed:', error.message);
    }
};

testDogAPI();