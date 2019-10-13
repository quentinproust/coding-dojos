import { useContext } from 'react';
import ServiceLocatorContext, { Services } from './ServiceLocatorContext';

export function useAllServices() : Services {
  return useContext(ServiceLocatorContext);
}

export default function useServices<T>(selector: (services: Services) => T) : T {
  const context = useContext(ServiceLocatorContext);
  return selector(context);
}
