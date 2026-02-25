import { PageTitleProps } from "@/Partials/PageTitle";
import { PaginationData } from "./global";

export type Origin = {
    id: number;
    name: string;
    type: string;
    participant_count?: number;
};

export type AdminOriginIndexProps = PageTitleProps & {
    origins: PaginationData<Origin>;
    search?: string;
};
