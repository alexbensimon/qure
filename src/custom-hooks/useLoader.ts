import { useEffect, useState, useCallback } from 'react';

export const useLoader = (
  asyncFunction: () => Promise<void>,
  deps: Array<any> = [],
) => {
  const [isLoading, setIsLoading] = useState(true);

  const memoizedFunction = useCallback(asyncFunction, deps);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await memoizedFunction();
      setIsLoading(false);
    })();
  }, [memoizedFunction]);

  return isLoading;
};
