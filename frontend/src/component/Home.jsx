import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MyCalendar from "./Calender";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Home = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
 
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);

  const Token = params.get("accessToken");

  const [accessToken, setAccessToken] = useState(Token);

  useEffect(() => {
    const name = params.get("name");
    const email = params.get("email");
    const profilePic = params.get("profilePic");

    if (Token) {
      setAccessToken(Token);
    }

    // setAccessToken(Token);

    if (name && email && profilePic) {
      setUser({ name, email, profilePic });
    }
  }, []);


  

  if (!user) {
    return <div style={styles.loading}>Loading...</div>;
  }

  console.log(accessToken, "abvcdd");
  const handleLogout = () => {
    navigate("/");
  };
  return (
    <div>
      <nav style={styles.navbar}>
        <div style={styles.logoContainer}>
          <h1 style={styles.logo}>Calendar</h1>
        </div>
        <div style={styles.userContainer}>
          <img
            src={user.profilePic}
            alt={`${user.name}'s profile`}
            style={styles.userImage}
          />
          <p style={styles.userName}>{user.name}</p>
          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      <div style={styles.container}>
        <MyCalendar accessToken={accessToken?.length > 0 && accessToken} />
      </div>
    </div>
  );
};

const styles = {
  navbar: {
    backgroundColor: "#333",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    fontSize: "24px",
  },
  userContainer: {
    display: "flex",
    alignItems: "center",
  },
  userImage: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: "10px",
  },
  userName: {
    marginRight: "10px",
  },
  logoutButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
  },
  container: {
    padding: "20px",
  },
  loading: {
    textAlign: "center",
    fontSize: "20px",
    marginTop: "50px",
  },
};

export default Home;
