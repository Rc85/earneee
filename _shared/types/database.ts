export interface DatabaseCreateOptions {
  multiple?: boolean;
  conflict?: {
    columns: string;
    do: string;
    where?: string;
  };
  client?: any;
}

export interface DatabaseQueryOptions {
  where?: string;
  params?: any[];
  client?: any;
}

export interface DatabaseRetrieveOptions {
  where?: string;
  orderBy?: string;
  groupBy?: string;
  offset?: string;
  limit?: string;
  params?: any[];
  client?: any;
}
