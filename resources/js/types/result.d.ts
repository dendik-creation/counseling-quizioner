import { Origin } from "./origin";
import { Participant } from "./participant";
import { Answer } from "./question";
import { Questionnaire } from "./questionnaire";

export type Result = {
    id: number;
    participant_id: number;
    questionnaire_id: number;
    participant_origin_id: number;
    participant_unique_code: string;
    participant_class?: string;
    participant_work?: string;
    gus_point: number;
    ji_point: number;
    gang_point: number;
    completed_at: string;
    try_step: number;
    // relation
    participant: Participant;
    questionnaire: Questionnaire;
    origin: Origin;
    answers: Answer[];
};

export type ResultWithHumanizeParticipantGroup = {
    participant_id: number;
    questionnaire_id: number;
    // relation
    participant: Participant;
    questionnaire: Questionnaire;
    results: Result[];
};
