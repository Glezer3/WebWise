import cron from "node-cron";
import User from "../models/user.model.js";

const databaseCleanUp = cron.schedule('0 0 * * *', async () => {
    try {

        console.log("Automatic cleanup state: START");

        const olderThan = new Date();
        olderThan.setDate(olderThan.getDate() - 7);

        await User.deleteMany({
            verified: false,
            createdAt: { $lt: olderThan },
        });

        console.log("Automatic cleanup state: COMPLETED");

    } catch (error) {
        console.error('Error during automatic cleanup: ' + error);
    };
});

export default databaseCleanUp;