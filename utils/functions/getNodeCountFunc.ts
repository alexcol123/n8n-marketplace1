export    const getNodeCountFunc = (data:unknown) => {
    try {
    
      return data &&
        typeof data === "object" &&
        "nodes" in data &&
        Array.isArray(data.nodes)
        ? data.nodes.length
        : 0;
    } catch {
      return 0;
    }
  };
export default getNodeCountFunc;