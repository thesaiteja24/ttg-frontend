import React, { useState, useEffect, use } from "react";
import { LogOut, PanelRight, User2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { sidebarMenuConfig } from "../config/sidebarMenu.config";
import { useAuthStore } from "../store/auth.slice";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);

  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);

  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("");

  // Get menu items based on role
  const menuItems = sidebarMenuConfig[user?.role?.toLowerCase()] || [];

  // Set active tab based on route
  useEffect(() => {
    const found = menuItems.find((item) =>
      location.pathname.startsWith(item.path)
    );
    if (found) {
      setActiveTab(found.label);
    }
  }, [location.pathname, menuItems]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside
      className={`h-full bg-black border-r-white border-r-2 border-white flex flex-col justify-between transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } fixed md:relative z-50 md:z-auto top-0 left-0 md:h-full`}
    >
      {/* Top Section */}
      <div>
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
        >
          <div className="text-xl font-bold"></div>
          <PanelRight className="text-white" />
        </div>

        <nav className="flex flex-col gap-2 px-2">
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setActiveTab(item.label);
                navigate(item.path);
              }}
              className={`flex items-center gap-3 ${collapsed ? "px-2 py-2 justify-center" : "px-4 py-3"} rounded-md cursor-pointer transition-colors duration-200
                ${
                  activeTab === item.label
                    ? "border-2 border-white rounded-xl"
                    : "hover:border hover:border-white hover:rounded-xl"
                }`}
            >
              <div className="text-lg text-white">
                <item.icon className="text-white" />
              </div>
              {!collapsed && (
                <span
                  className={`text-base font-medium tracking-wide ${
                    activeTab === item.label ? "text-white" : "text-gray-300"
                  }`}
                >
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <nav className="flex flex-col gap-2 px-2">
        {/* Profile */}
        <div className="p-4 ">
          <div
            className={`flex items-center w-full text-left cursor-pointer ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <User2 className="text-white" />
            {!collapsed && (
              <span className="ml-3 text-white text-base font-medium tracking-wide">
                Profile
              </span>
            )}
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-300">
          <div
            className={`flex items-center w-full text-left cursor-pointer hover:text-red-600 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleLogout}
          >
            <LogOut className="text-white" />
            {!collapsed && (
              <span className="ml-3 text-white text-base font-medium tracking-wide">
                Logout
              </span>
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
