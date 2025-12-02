import { Earth, Grid2X2, LucideProps, Users } from "lucide-react";
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
];

const mgbkNavs: NavItems = [
    {
        type: "item",
        title: "Dashboard",
        url: "/mgbk/dashboard",
        icon: Grid2X2,
    },
];

const counselingTeacherNavs: NavItems = [
    {
        type: "item",
        title: "Dashboard",
        url: "/teacher/dashboard",
        icon: Grid2X2,
    },
];

export const sidebarNavs = {
    adminNavs,
    mgbkNavs,
    counselingTeacherNavs,
};
