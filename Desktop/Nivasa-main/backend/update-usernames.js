const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Import User model
const User = require('./models/User');

async function updateUsernames() {
    try {
        // Find all users without usernames
        const usersWithoutUsername = await User.find({ username: { $exists: false } });
        console.log(`Found ${usersWithoutUsername.length} users without usernames`);

        if (usersWithoutUsername.length === 0) {
            console.log('All users already have usernames!');
            return;
        }

        // Update each user with a default username
        for (const user of usersWithoutUsername) {
            const defaultUsername = `User_${user.phoneNumber.slice(-4)}`; // Use last 4 digits of phone

            await User.findByIdAndUpdate(user._id, { username: defaultUsername });
            console.log(`Updated user ${user.phoneNumber} with username: ${defaultUsername}`);
        }

        console.log(`\n✅ Successfully updated ${usersWithoutUsername.length} users with default usernames`);

        // Show some examples
        const updatedUsers = await User.find({}).limit(5);
        console.log('\nExample updated users:');
        updatedUsers.forEach(user => {
            console.log(`  - Phone: ${user.phoneNumber}, Username: ${user.username}`);
        });

    } catch (error) {
        console.error('Error updating usernames:', error);
    } finally {
        mongoose.connection.close();
    }
}

updateUsernames();
