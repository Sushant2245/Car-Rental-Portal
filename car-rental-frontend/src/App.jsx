import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CarDetails from "./pages/CarDetails";
import CarListing from "./pages/CarListing";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <Routes>
      {/* Main layout with nested pages */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />   {/* default route = / */}
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="car-listing" element={<CarListing />} />
        <Route path="car-details/:id" element={<CarDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
