
import { WorkflowCardTypes } from "@/utils/types";
import CardsList from "./CardList";
import EmptyList from "../EmptyList";
import {  fetchWorkflows } from "@/utils/actions";



const CardsContainer = async ({
  search,
}: {
  search?: string;
} = {}) => {


  const workflows: WorkflowCardTypes[] = await fetchWorkflows({
    search,
  });


  if (workflows.length === 0) return <EmptyList />;

  return <div className="my-5">
     <CardsList workflows={workflows} />
  </div>;
};
export default CardsContainer;
