import { google } from "googleapis";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
dotenv.config();

export const userLogin = async (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.header("Referer-Policy", "no-referrer-when-downgrade");

    const oAuth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.REDIRECT_URI
    );
    const SCOPES = ['https://www.googleapis.com/auth/calendar'];

    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        prompt: "consent"
    });

    res.json({ url: authorizeUrl });
}

const getUserData = async (access_token) => {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    const data = await response.json();
    console.log(data);
}

export const getUser = async (req, res) => {
    const code = req.query.code
    console.log(code, "code received");

    try {
        const oAuth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.REDIRECT_URI
        );
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        console.log("tokens acquired");
        
        const user = oAuth2Client.credentials;
        console.log("credentials", user);
        
        await getUserData(user.access_token);

        res.send("Login successful");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error during authentication");
    }
}

export const createGoogleCalendarEvent = async (tokens, event) => {
    const { access_token, refresh_token } = tokens;

    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials({ access_token, refresh_token });

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    try {
        const response = await calendar.events.insert({
            calendarId: 'primary', // Use the user's primary calendar
            resource: event,
        });

        return response.data;
    } catch (error) {
        console.error('Error creating Google Calendar event:', error);
        throw error;
    }
};