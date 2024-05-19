import React from "react";
import { useSession, useSupabaseClient,useSessionContext } from "@supabase/auth-helpers-react";
import axios from "axios"

const GoogleCalenderIntegration = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const {isLoading} = useSessionContext();

  if (isLoading) {
    return <></>;
  }

  const googleSignIn = async () => {
    
    const {  error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar",
      },
    });
   
    if(error){
        console.log(error)
    }
    
  };

  const handleCalendarRequest = async () => {
    // Check if user is logged in and has access token
    if (!session?.access_token) {
      console.error("Please sign in first to access Google Calendar");
      return;
    }

    const accessToken = session.access_token;
   

    try {
      // Replace with your backend API endpoint URL
      await axios.post(`/api/create-token`, {accessToken})
      .then((res)=>{
        console.log(res)
      })
      // Handle the response from the backend (calendar data)
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }
  };





  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
    }
  }

  
  return (
    <div>
      <div style={{ width: "400px", margin: "30px auto" }}>
        {session ? (
          <>
            {" "}
            <h1>Logged in as {session.user.email}</h1>{" "}
            <button onClick={handleCalendarRequest}>Access Calendar</button>
            <button onClick={handleSignOut}>Sign out</button>
          </>
        ) : (
          <>
            <button onClick={() => googleSignIn()}>Login with Google</button>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCalenderIntegration;