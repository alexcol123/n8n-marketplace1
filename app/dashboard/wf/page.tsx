import CardsList from "@/components/(custom)/(landing)/CardList";
import EmptyList from "@/components/(custom)/EmptyList";
import { fetchMyWorkflows } from "@/utils/actions";

const MyWorkflowsPage = async () => {
  const workflows = await fetchMyWorkflows();

  const noWorkflows = workflows.length === 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">
        {noWorkflows ? "My Workflows Collection" : "My Workflows Collection"}
      </h1>
      <p className="text-muted-foreground">
        Manage and track your shared automation workflows
      </p>

      {noWorkflows ? (
        <EmptyList
          heading={"You haven't created any workflows yet"}
          message={
            "Share your automation expertise with the community and prepare for future monetization opportunities"
          }
          btnText={"Create New Workflow"}
          btnLink={"/dashboard/wf/create"}
        />
      ) : (
        <CardsList workflows={workflows}  canDelete={true}/>
      )}
    </div>
  );
};
export default MyWorkflowsPage;
