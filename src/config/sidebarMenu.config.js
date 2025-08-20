import {
  LayoutDashboard,
  Plus,
  Users,
  BookOpen,
  ClipboardList,
  Bus,
  Book,
  Link,
  Users2Icon,
} from "lucide-react";

// Menu configuration for different roles
export const sidebarMenuConfig = {
  admin: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Faculty Management", icon: Users2Icon, path: "/faculty" },
    { label: "Course Management", icon: Book, path: "/course" },
    { label: "Assignment", icon: Link, path: "/courses" },
  ],
  student: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "View Timetable", icon: ClipboardList, path: "/timetable" },
    { label: "Buses", icon: Bus, path: "/buses" },
    { label: "Courses", icon: BookOpen, path: "/courses" },
  ],
};
