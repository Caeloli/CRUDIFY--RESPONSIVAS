import logo from "./logo.svg";
import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./components/pages/Home/Home";
import { Settings } from "./components/pages/Setting/Settings";
import { UsersDash } from "./components/pages/Users/UsersDash";
import { Notifications } from "./components/pages/Notifications/Notifications";
import { OutletView } from "./components/common/Outlet/Outlet.View";
import { ResponsivesCRUD } from "./components/pages/ResponsivesCRUD/ResponsivesCRUD";
import { ResponsiveCard } from "./components/pages/ResponsiveCard/ResponsiveCard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OutletView/>}>
          <Route path="/" element={<Home />} />
          <Route path="/Files" element={<ResponsivesCRUD />} />
          <Route path="/FilesForm" element={<ResponsiveCard  isInsertMode />} />
          <Route path="/FilesForm/:fileID" element={<ResponsiveCard isReadMode/>} />
          <Route path="/FilesForm/:fileID/update" element={<ResponsiveCard isUpdateMode />} />
          <Route path="/Notifications" element={<Notifications />} />
          <Route path="/Users" element={<UsersDash />} >
            <Route path="" element={} />
            <Route path="/Authorization" element={} />
          </Route>
          <Route path="/Settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
