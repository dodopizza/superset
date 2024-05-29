export type OnBoardingStorageInfo = {
  theTimeOfTheLastShow?: Date;
};

export type Team = {
  label: string;
  value: string;
};

export enum Role {
  AnalyseData = 'Analyse Data',
  CreateData = 'Create Data',
  UseData = 'Use Data',
  InputData = 'Input Data',
}
