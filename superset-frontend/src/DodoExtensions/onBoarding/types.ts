export enum Role {
  AnalyseData = 'Analyze data',
  CreateData = 'Create data',
  UseData = 'Use data',
  InputData = 'Input data',
}

export type Team = {
  label: string;
  value: string;
  roles: Array<Role>;
};

export enum userFromEnum {
  Franchisee = 'Franchisee',
  ManagingCompany = 'Managing Company',
}
