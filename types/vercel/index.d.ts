export interface VercelDataResponse {
  data: VercelData[];
}

export interface VercelData {
  key: string;
  total: number;
  devices: number;
}

export type VercelDataCategories =
  | 'path'
  | 'referrer'
  | 'country'
  | 'os_name'
  | 'client_name';
