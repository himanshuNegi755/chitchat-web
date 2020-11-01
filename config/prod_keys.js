
module.exports = {
    google: {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    },
    session: {
        cookieKey: process.env.COOKIE_KEY
    },
    mongoURI: process.env.MONGO_URI
};