import { AiFillGoogleCircle } from "react-icons/ai";
async function navigate(url) {
  window.location.href = url;

  const res = await fetch("http://localhost:3000/api/oauth2callback", {
    method: "GET",
    // body: JSON.stringify("hellow"),
  });

}

async function auth() {
  const response = await fetch("http://localhost:3000/api/login", {
    method: "POST",
  });
  const data = await response.json();

navigate(data.url);
}

const Auth = () => {
  return (
    <div>
      <h1>Google Calendar</h1>
      <button
        type="button"
        gradientDuoTone={"purpleToBlue"}
        outline
        onClick={auth}
      >
        <AiFillGoogleCircle /> Continue With Google
      </button>
    </div>
  );
};

export default Auth;
