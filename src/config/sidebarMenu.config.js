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
    { label: "Faculty Management", icon: Users2Icon, path: "/faculty/create" },
    { label: "Course Management", icon: Book, path: "/faculty" },
    { label: "Assignment", icon: Link, path: "/courses/create" },
  ],
  student: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "View Timetable", icon: ClipboardList, path: "/timetable" },
    { label: "Buses", icon: Bus, path: "/buses" },
    { label: "Courses", icon: BookOpen, path: "/courses" },
  ],
};
