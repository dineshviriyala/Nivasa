const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Import User model
const User = require('./models/User');

async function checkUsers() {
    try {
        const users = await User.find({});
        console.log('All users in database:');
        users.forEach((user, index) => {
            console.log(`User ${index + 1}:`);
            console.log(`  - Username: ${user.username}`);
            console.log(`  - Phone: ${user.phoneNumber}`);
            console.log(`  - Role: ${user.role}`);
            console.log(`  - Flat Number: ${user.flatNumber}`);
            console.log(`  - Apartment Code: ${user.apartmentCode}`);
            console.log('  ---');
        });

        // Check for users without usernames
        const usersWithoutUsername = users.filter(user => !user.username);
        if (usersWithoutUsername.length > 0) {
            console.log(`\n⚠️  Found ${usersWithoutUsername.length} users without usernames:`);
            usersWithoutUsername.forEach(user => {
                console.log(`  - Phone: ${user.phoneNumber}, Role: ${user.role}`);
            });
        } else {
            console.log('\n✅ All users have usernames');
        }

    } catch (error) {
        console.error('Error checking users:', error);
    } finally {
        mongoose.connection.close();
    }
}

checkUsers(); 