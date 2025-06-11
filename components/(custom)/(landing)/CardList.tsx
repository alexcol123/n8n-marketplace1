import { WorkflowCardTypes } from "@/utils/types";
import CardWorkFLow from "./CardWorkflow";

const CardsList = ({
  workflows,
  canDelete = false,
}: {
  workflows: WorkflowCardTypes[];
  canDelete?: boolean;
}) => {
  return (
    <section className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 p-4 md:p-1">
      {workflows.map((workflows) => (
        <CardWorkFLow key={workflows.id} workflows={workflows}  canDelete={canDelete}/>
      ))}
    </section>
  );
};
export default CardsList;
