import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { sidebarNavs } from "@/lib/sidebar_navs";
import { Link } from "@inertiajs/react";
import { ArrowBigRightDash } from "lucide-react";

const matchRoleToNavs = (role: string) => {
    switch (role) {
        case "1":
            return sidebarNavs.adminNavs;
        case "2":
            return sidebarNavs.mgbkNavs;
        case "3":
            return sidebarNavs.counselingTeacherNavs;
        default:
            return sidebarNavs.mgbkNavs;
    }
};

export default function AppSidebar({ role }: { role: string }) {
    const pathname = window.location.pathname;
    const items = matchRoleToNavs(role);
    return (
        <Sidebar>
            <SidebarContent className="bg-amber-200 min-h-full relative h-full flex flex-col">
                <SidebarHeader className="mt-3 ms-3 gap-0">
                    <span className="text-black/80 font-bold">
                        My Konseling
                    </span>
                    <span className="text-black/60 text-sm font-normal">
                        Sistem manajemen informasi kuisioner konseling
                    </span>
                </SidebarHeader>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item, index: number) => {
                                if (item.type === "splitter") {
                                    return (
                                        <SidebarMenuItem
                                            className="border-b border-slate-700 mt-2"
                                            key={item.title}
                                        >
                                            <SidebarMenuButton
                                                disabled
                                                className="text-black uppercase text-xs"
                                            >
                                                <ArrowBigRightDash />
                                                {item.title}
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                } else {
                                    const Icon = item.icon;
                                    return (
                                        <SidebarMenuItem
                                            className="text-black/80 transition-all mb-0.5"
                                            key={item.title}
                                        >
                                            <SidebarMenuButton
                                                isActive={
                                                    pathname == item.url ||
                                                    pathname.includes(item.url)
                                                }
                                                className="transition-all"
                                                asChild
                                            >
                                                <Link
                                                    href={
                                                        item.url == pathname
                                                            ? "#"
                                                            : item.url
                                                    }
                                                    className="flex items-center gap-2"
                                                >
                                                    {Icon && <Icon />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                }
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
