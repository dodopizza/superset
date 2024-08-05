import { Role } from '../types';

export const getRoleFromString = ({ name }: { name: string }): Role => {
  switch (name) {
    case Role.AnalyseData: {
      return Role.AnalyseData;
    }
    case Role.CreateData: {
      return Role.CreateData;
    }
    case Role.UseData: {
      return Role.UseData;
    }
    case Role.InputData: {
      return Role.InputData;
    }
    default:
      return Role.Unknown;
  }
};
