// utils/constants.tsx
// Define types for template categories

import {
  FaRobot,
  FaServer,
  FaBullhorn,
  FaInfinity,
  FaUsers,
} from "react-icons/fa";
import {
  IoShieldSharp,
  IoBuildSharp,
  IoLayersSharp,
  IoColorPaletteSharp,
  IoCubeSharp,
} from "react-icons/io5";
import { BsGraphUp, BsThreeDots, BsLifePreserver } from "react-icons/bs";
import { GiMoneyStack } from "react-icons/gi";
import type { IconType } from "react-icons"; // Import IconType for better typing
import {
  ArrowBigLeft,
  CloudDownload,
  LayoutDashboard,
  List,
  PlusCircle,
  User,
  Trophy,
  AlertCircle,
  AlarmClockCheckIcon,
  BookOpen,
  Briefcase,
  ExternalLink,
  Monitor,
  Settings,
  MessageSquare,
  Network,
} from "lucide-react";

export type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

export const navigation: NavItem[] = [
  { name: "Back to Workflows", href: "/", icon: ArrowBigLeft },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Workflows", href: "/admin/wf", icon: List },
  { name: "My Profile", href: "/dashboard/profile", icon: User },
  { name: "Portfolio", href: "/dashboard/portfolio", icon: Briefcase },
  { name: "My Downloads", href: "/dashboard/mydownloads", icon: CloudDownload },
  {
    name: "My Tutorial Completions",
    href: "/dashboard/myCompletions",
    icon: Trophy,
  },
];

export const adminNavigation: NavItem[] = [
  {
    name: "Admin Dashboard",
    href: "/admin/",
    icon: AlarmClockCheckIcon,
  },
  {
    name: "Issues Management",
    href: "/admin/issues",
    icon: AlertCircle,
  },
  {
    name: "API Setup Guides",
    href: "/admin/node-guides",
    icon: BookOpen,
  },
  {
    name: "Portfolio Manager",
    href: "/admin/portfolio-manager",
    icon: Settings,
  },
  {
    name: "Create Workflow",
    href: "/admin/wf/create",
    icon: PlusCircle,
  },
];

interface CategoryType {
  label: string;
  icon: IconType; // Use IconType for React icon components
}

export const technologyCategories: CategoryType[] = [
  {
    label: "ai",
    icon: FaRobot, // Or another AI related icon like BsFillLightbulbFill
  },
  {
    label: "secops",
    icon: IoShieldSharp, // Or FaShieldAlt
  },
  {
    label: "sales",
    icon: BsGraphUp, // Or FaChartLine
  },
  {
    label: "it_ops",
    icon: FaServer, // Or BsGearFill
  },
  {
    label: "marketing",
    icon: FaBullhorn, // Or IoMegaphoneSharp
  },
  {
    label: "engineering",
    icon: IoBuildSharp, // Or FaTools
  },
  {
    label: "devops",
    icon: FaInfinity, // Common DevOps symbol
  },
  {
    label: "building_blocks",
    icon: IoLayersSharp, // Or Gi3DBlocks
  },
  {
    label: "design",
    icon: IoColorPaletteSharp, // Or FaPaintBrush
  },
  {
    label: "finance",
    icon: GiMoneyStack, // Or BsBank
  },
  {
    label: "hr",
    icon: FaUsers, // Or IoPeopleSharp
  },
  {
    label: "other",
    icon: BsThreeDots, // Generic icon for 'other'
  },
  {
    label: "product",
    icon: IoCubeSharp, // Or FaBoxOpen
  },
  {
    label: "support",
    icon: BsLifePreserver, // Or IoChatbubblesSharp
  },
];
