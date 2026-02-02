import { useState } from "react";
import {
  FaHome,
  FaBars,
  FaRegUserCircle,
  FaBell,
} from "react-icons/fa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdownMenu";
import { Button } from "@/components/ui/button";
import { Outlet, useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { GoRepoTemplate } from "react-icons/go";
import { CgNotes } from "react-icons/cg";

const menus = [
  { name: "Dashboard", icon: <FaHome />, path: "#" },
  { name: "Users", icon: <FaRegUserCircle />, path: "/app/users" },
  { name: "Post", icon: <GoRepoTemplate />, path: "/app/post-management" },
  { name: "Tag", icon: <CgNotes />, path: "/app/tag-management" },
  { name: "Category", icon: <CgNotes />, path: "/app/category-management"}
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const handleRedirectHomePage = () => {
    navigate('/');
  }

  const handleNavigatePage = (path) => {
    navigate(path);
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r duration-300 flex flex-col justify-between`}
      >
        <div>
          <div className="flex items-center justify-between p-4">
            <span className="text-xl font-bold text-blue-600">
              {sidebarOpen ? "Admin" : "A"}
            </span>
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
              <FaBars />
            </button>
          </div>
          <nav className="mt-4 space-y-2">
            {menus.map((item, idx) => (
              <button
                key={idx}
                className="flex items-center gap-3 px-4 py-2 w-full hover:bg-blue-100 text-gray-700"
                onClick={() => handleNavigatePage(item.path)}
              >
                <span className="text-lg">{item.icon}</span>
                {sidebarOpen && <span>{item.name}</span>}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="flex items-center justify-between bg-white p-4 shadow">
          <span className="text-xl font-bold text-blue-600">Blog</span>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-none h-4 text-[22px]">
                  <FaBell />
                </Button>
              </DropdownMenuTrigger>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">Hello, {keycloak.tokenParsed?.preferred_username}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleRedirectHomePage}>Trang chủ</DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert("Logging out...")}>Đăng xuất</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 p-6 bg-gray-50">
            <Outlet />
        </main>

        {/* Footer */}
        <footer className="p-4 text-center text-sm text-gray-500">
          © 2025 My Website. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
