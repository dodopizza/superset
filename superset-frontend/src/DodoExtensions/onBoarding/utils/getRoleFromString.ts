import { Role } from '../types';

export const getRoleFromString = ({ name }: { name: string }): Role => {
  switch (name) {
    case Role.CheckData: {
      return Role.CheckData;
    }
    case Role.CreateData: {
      return Role.CreateData;
    }
    case Role.VizualizeData: {
      return Role.VizualizeData;
    }
    default:
      return Role.Unknown;
  }
};
