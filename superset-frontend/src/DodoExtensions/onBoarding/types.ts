export type OnBoardingStorageInfo = {
  theTimeOfTheLastShow?: Date;
  initialByUser?: boolean;
};

export enum Role {
  AnalyseData = 'Analyze data',
  CreateData = 'Create data',
  UseData = 'Use data',
  InputData = 'Input data',
  Unknown = 'Unknown',
}

export type Team = {
  label: string;
  value: string;
  roles: Array<Role>;
};

export type User = {
  label: string;
  value: number;
};

export enum UserFromEnum {
  Franchisee = 'Franchisee',
  ManagingCompany = 'Managing Company',
  Unknown = 'Unknown',
}
