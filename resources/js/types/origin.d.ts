import { PageTitleProps } from "@/Partials/PageTitle";
import { PaginationData } from "./global";

export type Origin = {
    id: number;
    name: string;
    type: string;
    mgbk_id?: number;
    city?: string;
    mgbk?: User; // as mgbk user
    participant_count?: number;
};

export type AdminOriginIndexProps = PageTitleProps & {
    origins: PaginationData<Origin>;
    search?: string;
    available_mgbk: SelectOption[];
};
