import { WorkflowCardTypes } from "@/utils/types";
import CardWorkFLow from "./CardWorkflow";

const CardsList = ({
  workflows,
  canDelete = false,
  canEditSteps = false,
}: {
  workflows: WorkflowCardTypes[];
  canDelete?: boolean;
  canEditSteps?: boolean;
}) => {
  return (
    <section className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 p-4 md:p-1">
      {workflows.map((workflows) => (
        <CardWorkFLow
          key={workflows.id}
          workflows={workflows}
          canDelete={canDelete}
          canEditSteps={canEditSteps}
        />
      ))}
    </section>
  );
};
export default CardsList;
