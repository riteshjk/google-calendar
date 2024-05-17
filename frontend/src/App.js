
import './App.css';
import GoogleCalenderIntegration from './component/GoogleCalenderIntegration';
import MyCalendar from './component/Calender';
import CreateEvent from './component/CreateEvent';


function App() {
  return (
    <div className="App">
      <h1>Calender</h1>

      {/* <GoogleCalenderIntegration/> */}
      <CreateEvent/>
      <MyCalendar/>
    </div>
  );
}

export default App;
