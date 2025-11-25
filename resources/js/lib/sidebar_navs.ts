import { Grid2X2, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type NavItems = {
    type: "item" | "splitter";
    title: string;
    url: string;
    icon?: ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
}[];

const sidebarNavs: NavItems = [
    {
        type: "item",
        title: "Dashboard",
        url: "/dashboard",
        icon: Grid2X2,
    },
];

export default sidebarNavs;
