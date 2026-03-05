import { PageTitleProps } from "@/Partials/PageTitle";
import { PaginationData } from "./global";

export type User = {
    id: number;
    username: string;
    name: string;
    level: 1 | 2 | 3; // 1: Admin, 2: MGBK, 3: Counseling Teacher
    is_active: booelan;
    created_at?: string;
    updated_at?: string;
    origin_id?: number;
    origin?: Origin;
    mgbk_id?: number;
    mgbk?: User;
    mgbk_origins?: Origin[];
};

export type AdminUserIndexProps = PageTitleProps & {
    users: PaginationData<User>;
    search?: string;
    level?: number;
};
