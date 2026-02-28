export type AdminDashboardProps = {
    title?: string;
    description?: string;
    summary: DashboardSummary;
    results_per_day: DashboardResultPerDay[];
    monthly_trend: DashboardMonthlyTrend[];
    score_by_questionnaire: DashboardScoreByQuestionnaire[];
    by_origin_type: DashboardByOriginType[];
    top_origins: DashboardTopOrigin[];
    category_dominance: DashboardCategoryDominance[];
    score_ranges: DashboardScoreRange[];
    recent_results: DashboardRecentResult[];
    questionnaire_count: number;
    origin_count: number;
};

export type DashboardSummary = {
    total_results: number;
    total_participants: number;
    avg_gus: number;
    avg_ji: number;
    avg_gang: number;
    this_month_results: number;
    this_month_participants: number;
};

export type DashboardResultPerDay = {
    date: string;
    total: number;
};

export type DashboardMonthlyTrend = {
    month: string;
    total: number;
    avg_total_score: number;
};

export type DashboardScoreByQuestionnaire = {
    title: string;
    avg_gus: number;
    avg_ji: number;
    avg_gang: number;
    total_submissions: number;
};

export type DashboardByOriginType = {
    type: string;
    label: string;
    total: number;
};

export type DashboardTopOrigin = {
    name: string;
    total: number;
};

export type DashboardCategoryDominance = {
    label: string;
    total: number;
    percentage: number;
};

export type DashboardScoreRange = {
    range_label: string;
    total: number;
};

export type DashboardRecentResult = {
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
