import logo from './logo.svg';
import './App.css';
import { Route, Routes } from "react-router-dom";
import AddSocialIcon from "../src/components/AddSocialIcon.jsx"
import LoginPage from "../src/pages/LoginPage.jsx"
import SignupPage from "../src/pages/SignupPage.jsx"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route index path="/" element={<LoginPage />} />
        <Route index path="/Signup" element={<SignupPage />} />
        <Route path="/createPlugin" element={<AddSocialIcon />} />

      </Routes>
   {/* <AddSocialIcon /> */}
    </div>
  );
}

export default App;
