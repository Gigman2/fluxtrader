import { QueryClient, QueryKey } from "@tanstack/react-query";

class PartialQueryClient extends QueryClient {
  private cache: Map<QueryKey, any>;

  constructor() {
    super();
    this.cache = new Map();
  }

  invalidatePartial(key: string): void {
    const keys = Array.from(this.cache.keys());
    const matchingKeys = keys.filter((k) => k.includes(key));

    matchingKeys.forEach((k) => {
      this.invalidateQueries({ queryKey: k });
    });
  }
}

export default PartialQueryClient;
