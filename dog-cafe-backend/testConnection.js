require('dotenv').config();
const mongoose = require('mongoose');

// Print the connection string (with hidden password)
const connectionString = process.env.MONGODB_URI;
console.log('Attempting to connect with URI:', 
  connectionString.replace(/:([^:@]{8})[^:@]*@/, ':****@'));

// Connection options
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

// Test connection
async function testConnection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, options);
        console.log('Successfully connected to MongoDB!');
        
        // Test database operations
        const Test = mongoose.model('Test', { name: String });
        await Test.create({ name: 'test' });
        console.log('Successfully created test document!');
        
        // Clean up
        await mongoose.connection.close();
        console.log('Connection closed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Connection error details:', {
            name: error.name,
            message: error.message,
            code: error.code,
            codeName: error.codeName
        });
        
        if (error.message.includes('bad auth')) {
            console.log('\nPossible authentication issues:');
            console.log('1. Check if username and password are correct');
            console.log('2. Verify the connection string format');
            console.log('3. Ensure the database user has proper permissions');
        }
        
        process.exit(1);
    }
}

testConnection();