import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { AboutPage } from "../pages/AboutPage";
import { LoginPage } from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import LayoutMovu from "../components/Layout";
import ResetPage from "../pages/ResetPage";
import SiteMapPage from "../pages/SiteMapPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ProfilePage } from "../pages/ProfilePage";
import { EditProfilePage } from "../pages/EditProfilePage";
import ConfirResetPage from "../pages/ConfirResetPage";
import { FavoritosPage } from "../pages/FavoritosPage";
import { VideoPage } from "../pages/VideoPage";

const RoutesMovu = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Todas las rutas dentro del layout */}
        <Route element={<LayoutMovu />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/loginPage" element={<LoginPage />} />
          <Route path="/registerPage" element={<RegisterPage />} />
          <Route path="/resetPage" element={<ResetPage />} />
          <Route path="/confirResetPage" element={<ConfirResetPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/aboutPage" element={<AboutPage />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
          <Route path="/EditProfilePage" element={<EditProfilePage />} />
          <Route path="/SiteMapPage" element={<SiteMapPage />} />
          <Route path="/FavoritosPage" element={<FavoritosPage />} />
          <Route path="/video" element={<VideoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesMovu;
