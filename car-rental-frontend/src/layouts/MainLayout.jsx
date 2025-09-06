import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Page content will render here */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-4">
        © {new Date().getFullYear()} RentWheels. All rights reserved.
      </footer>
    </div>
  );
}

export default MainLayout;
