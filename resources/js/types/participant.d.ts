import { PageTitleProps } from "@/Partials/PageTitle";
import { ParticipantOrigin } from "./origin";
import { PaginationData, SelectOption } from "./global";

export type Participant = {
    id: number;
    unique_code: string;
    name: string;
    class?: string;
    work?: string;
    origin_id: number;
    origin: ParticipantOrigin;
};

export type AdminParticipantIndexProps = PageTitleProps & {
    participants: PaginationData<Participant>;
    search?: string;
    origin?: string;
    origins: SelectOption[];
};
