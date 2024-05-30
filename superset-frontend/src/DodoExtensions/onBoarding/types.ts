export type OnBoardingStorageInfo = {
  theTimeOfTheLastShow?: Date;
};

export enum Role {
  AnalyseData = 'Analyse Data',
  CreateData = 'Create Data',
  UseData = 'Use Data',
  InputData = 'Input Data',
}

export type Team = {
  label: string;
  value: string;
  roles: Array<Role>;
};
