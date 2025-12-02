import { PageTitleProps } from "@/Partials/PageTitle";
import { PaginationData } from "./global";

export type ParticipantOrigin = {
    id: number;
    name: string;
    type: string;
    participant_count?: number;
};

export type AdminOriginIndexProps = PageTitleProps & {
    origins: PaginationData<ParticipantOrigin>;
    search?: string;
};
