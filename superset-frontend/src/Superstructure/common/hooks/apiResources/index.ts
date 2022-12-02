// DODO-changed
export {
    useApiResourceFullBody,
    useApiV1Resource,
    useTransformedResource,
} from 'src/common/hooks/apiResources';
  
  // A central catalog of API Resource hooks.
  // Add new API hooks here, organized under
  // different files for different resource types.
export * from 'src/common/hooks/apiResources/charts';
export * from 'src/Superstructure/common/hooks/apiResources/dashboards';
