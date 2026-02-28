export type ReportSummary = {
    total_results: number;
    total_participants: number;
    avg_gus: number;
    avg_ji: number;
    avg_gang: number;
};

export type ResultPerDay = {
    date: string;
    total: number;
};

export type ScoreByQuestionnaire = {
    title: string;
    avg_gus: number;
    avg_ji: number;
    avg_gang: number;
    total_submissions: number;
};

export type ByOriginType = {
    type: string;
    label: string;
    total: number;
};

export type TopOrigin = {
    name: string;
    total: number;
};

export type ScoreRange = {
    range_label: string;
    total: number;
};

export type CategoryDominance = {
    label: string;
    total: number;
    percentage: number;
};

export type MonthlyTrend = {
    month: string;
    total: number;
    avg_total_score: number;
};

export type RecentResult = {
    id: number;
    participant: string;
    unique_code: string;
    origin: string;
    questionnaire: string;
    gus_point: number;
    ji_point: number;
    gang_point: number;
    total_point: number;
    completed_at: string;
};

export type ReportFilters = {
    date_range: string;
};

export type ReportIndexProps = {
    title?: string;
    description?: string;
    filters: ReportFilters;
    summary: ReportSummary;
    results_per_day: ResultPerDay[];
    score_by_questionnaire: ScoreByQuestionnaire[];
    by_origin_type: ByOriginType[];
    top_origins: TopOrigin[];
    score_ranges: ScoreRange[];
    category_dominance: CategoryDominance[];
    monthly_trend: MonthlyTrend[];
    recent_results: RecentResult[];
};

export type ReportPrintProps = {
    title?: string;
    description?: string;
    filters: ReportFilters;
    summary: ReportSummary;
    score_by_questionnaire: ScoreByQuestionnaire[];
    by_origin_type: ByOriginType[];
    category_dominance: CategoryDominance[];
    all_results: RecentResult[];
};
