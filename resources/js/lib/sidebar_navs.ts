import {
    BookUser,
    Earth,
    Grid2X2,
    LucideProps,
    Users,
    ListTodo,
    ClipboardCheck,
    FileText,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type NavItems = {
    type: "item" | "splitter";
    title: string;
    url: string;
    icon?: ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
}[];

const adminNavs: NavItems = [
    {
        type: "item",
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: Grid2X2,
    },
    {
        type: "splitter",
        title: "Data Master",
        url: "#",
    },
    {
        type: "item",
        title: "Data User",
        url: "/admin/users",
        icon: Users,
    },
    {
        type: "item",
        title: "Data Asal",
        url: "/admin/origins",
        icon: Earth,
    },
    {
        type: "item",
        title: "Data Partisipan",
        url: "/admin/participants",
        icon: BookUser,
    },
    {
        type: "item",
        title: "Data Kuisioner",
        url: "/admin/questionnaire",
        icon: ListTodo,
    },
    {
        type: "splitter",
        title: "Proses Kuisioner",
        url: "#",
    },
    {
        type: "item",
        title: "Hasil Kuisioner",
        url: "/admin/results",
        icon: ClipboardCheck,
    },
    {
        type: "item",
        title: "Laporan",
        url: "/admin/reports",
        icon: FileText,
    },
];

const mgbkNavs: NavItems = [
    {
        type: "item",
        title: "Dashboard",
        url: "/mgbk/dashboard",
        icon: Grid2X2,
    },
    {
        type: "splitter",
        title: "Data Master",
        url: "#",
    },
    {
        type: "item",
        title: "Data Guru",
        url: "/mgbk/users",
        icon: Users,
    },
    {
        type: "item",
        title: "Data Asal",
        url: "/mgbk/origins",
        icon: Earth,
    },
    {
        type: "item",
        title: "Data Partisipan",
        url: "/mgbk/participants",
        icon: BookUser,
    },
    {
        type: "splitter",
        title: "Proses Kuisioner",
        url: "#",
    },
    {
        type: "item",
        title: "Hasil Kuisioner",
        url: "/mgbk/results",
        icon: ClipboardCheck,
    },
    {
        type: "item",
        title: "Laporan",
        url: "/mgbk/reports",
        icon: FileText,
    },
];

const counselingTeacherNavs: NavItems = [
    {
        type: "item",
        title: "Dashboard",
        url: "/teacher/dashboard",
        icon: Grid2X2,
    },
    {
        type: "splitter",
        title: "Data Master",
        url: "#",
    },
    {
        type: "item",
        title: "Data Partisipan",
        url: "/teacher/participants",
        icon: BookUser,
    },
    {
        type: "splitter",
        title: "Proses Kuisioner",
        url: "#",
    },
    {
        type: "item",
        title: "Hasil Kuisioner",
        url: "/teacher/results",
        icon: ClipboardCheck,
    },
    {
        type: "item",
        title: "Laporan",
        url: "/teacher/reports",
        icon: FileText,
    },
];

export const sidebarNavs = {
    adminNavs,
    mgbkNavs,
    counselingTeacherNavs,
};
