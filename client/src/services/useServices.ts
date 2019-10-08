import { useContext } from 'react';
import ServiceLocatorContext, { Services } from './ServiceLocatorContext';

export function useAllServices() : Services {
  return useContext(ServiceLocatorContext);
}

export default function useServices(selector: (services: Services) => any) {
  const context = useContext(ServiceLocatorContext);
  return selector(context);
}
