import { google } from "googleapis";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.js";
dotenv.config();

const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
  
  export const userLogin = async (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.header("Referer-Policy", "no-referrer-when-downgrade");
  
    const SCOPES = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ];
  
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "consent"
    });
  
    res.json({ url: authorizeUrl });
  }
  
  const getUserData = async (access_token) => {
    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
      if (!response.ok) {
        throw new Error(`Error fetching user data: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in getUserData:', error);
      throw error;
    }
  }
  
  export const getUser = async (req, res) => {
    const code = req.query.code;
    console.log(code, "code received");
  
    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
    //   console.log(tokens.access_token,"tokens acquired");
        
      const userData = await getUserData(tokens.access_token);
      console.log("User data retrieved", userData);
  
      let user = await User.findOne({ email: userData.email });
  
      if (!user) {
        user = new User({
          name: userData.name,
          email: userData.email,
          profilePic: userData.picture,
        });
        await user.save();
        console.log("New user created", user);
      } else {
        console.log("User already exists", user);
      }

      res.cookie('accessToken', tokens.access_token, { httpOnly: true, secure: true });
      res.cookie('refreshToken', tokens.refresh_token, { httpOnly: true, secure: true });
  
      const queryString = `?name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&profilePic=${encodeURIComponent(user.profilePic)}&accessToken=${encodeURIComponent(tokens.access_token)}&refreshToken=${encodeURIComponent(tokens.refresh_token)}`;
    
      res.redirect(`http://localhost:3001/home${queryString}`);
    
    } catch (err) {
      console.log(err.response ? err.response.data : err.message);
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