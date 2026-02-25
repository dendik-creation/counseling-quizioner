import { PageTitleProps } from "@/Partials/PageTitle";
import { Origin } from "./origin";
import { PaginationData, SelectOption } from "./global";

export type Participant = {
    id: number;
    unique_code: string;
    name: string;
    class?: string;
    work?: string;
    origin_id: number;
    origin: Origin;
};

export type AdminParticipantIndexProps = PageTitleProps & {
    participants: PaginationData<Participant>;
    search?: string;
    origin?: string;
    origins: SelectOption[];
};
