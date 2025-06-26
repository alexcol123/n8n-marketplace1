const getWorkflowComplexityColorFunc = (complexity: string) => {
  switch (complexity) {
    case "Advanced":
      return "text-red-600 bg-red-50 border-red-200";
    case "Intermediate":
      return "text-orange-600 bg-orange-50 border-orange-200";
    default:
      return "text-green-600 bg-green-50 border-green-200";
  }
};

export default getWorkflowComplexityColorFunc;