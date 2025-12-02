import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { AdminDashboardProps } from "@/types/dashboard";

const AdminDashboard = ({ title, description }: AdminDashboardProps) => {
    return (
        <AppLayout>
            <PageTitle title={title} description={description} />
        </AppLayout>
    );
};

export default AdminDashboard;
