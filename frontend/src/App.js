import logo from "./logo.svg";
import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./components/pages/Home/Home";
import { Settings } from "./components/pages/Setting/Settings";

import { Notifications } from "./components/pages/Notifications/Notifications";
import { OutletView } from "./components/common/Outlet/Outlet.View";
import { ResponsivesCRUD } from "./components/pages/ResponsivesCRUD/ResponsivesCRUD";
import { ResponsiveCard } from "./components/pages/ResponsiveCard/ResponsiveCard";
import { UsersDash } from "./components/pages/UsersDash/UsersDash";
import { UsersContainer } from "./components/pages/UsersDash/Users/UsersContainer";
import { AuthorizationContainer } from "./components/pages/UsersDash/Authorization/AuthorizationContainer";
import { Login } from "./components/pages/Login/Login";
import { ProtectedRouteContainer } from "./components/common/ProtectedRoute/ProtectedRouteContainer";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<ProtectedRouteContainer child={<OutletView />} />}
        >
          <Route path="/" element={<Home />} />
          <Route path="/Files" element={<ResponsivesCRUD />} />
          <Route path="/FilesForm" element={<ResponsiveCard isInsertMode />} />
          <Route
            path="/FilesForm/:fileID"
            element={<ResponsiveCard isReadMode />}
          />
          <Route
            path="/FilesForm/:fileID/update"
            element={<ResponsiveCard isUpdateMode />}
          />
          <Route path="/Notifications" element={<Notifications />} />
          <Route path="/Users" element={<UsersDash />}>
            <Route path="" element={<UsersContainer />} />
            <Route path="Authorization" element={<AuthorizationContainer />} />
          </Route>
          <Route path="/Settings" element={<Settings />} />
        </Route>
        <Route path="/Login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
