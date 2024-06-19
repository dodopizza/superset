export type OnBoardingStorageInfo = {
  theTimeOfTheLastShow?: Date;
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

export enum userFromEnum {
  Franchisee = 'Franchisee',
  ManagingCompany = 'Managing Company',
}

export type LoadTeamList = (
  userFrom: userFromEnum,
  query: string,
) => Promise<void>;
