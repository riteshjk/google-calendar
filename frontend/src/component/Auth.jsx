import { AiFillGoogleCircle } from "react-icons/ai";

async function navigate(url) {
  window.location.href = url;
}

async function auth() {
  const response = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
  });
  const data = await response.json();

  navigate(data.url);
  return data;
}

const Auth = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Google Calendar</h1>
      <button
        style={styles.button}
        type="button"
        onClick={auth}
      >
        <AiFillGoogleCircle style={styles.icon} /> Continue With Google
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
  
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#4285F4',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin:"auto"
  },
  icon: {
    marginRight: '10px',
  },
};

export default Auth;
