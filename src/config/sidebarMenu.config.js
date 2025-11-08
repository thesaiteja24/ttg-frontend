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
  GraduationCap,
} from "lucide-react";

// Menu configuration for different roles
export const sidebarMenuConfig = {
  admin: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    {
      label: "Year Semester Management",
      icon: GraduationCap,
      path: "/year-semester",
    },
    { label: "Faculty Management", icon: Users2Icon, path: "/faculty" },
    { label: "Course Management", icon: Book, path: "/course" },
    { label: "Assignment", icon: Link, path: "/assignment" },
    { label: "Time Table", icon: ClipboardList, path: "/timetable" },
  ],
  student: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "View Timetable", icon: ClipboardList, path: "/timetable" },
    { label: "Buses", icon: Bus, path: "/buses" },
    { label: "Courses", icon: BookOpen, path: "/courses" },
  ],
};
