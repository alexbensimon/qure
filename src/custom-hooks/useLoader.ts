import { useEffect, useState, useCallback } from 'react';

export const useLoader = (asyncFunction: () => Promise<void>) => {
  const [isLoading, setIsLoading] = useState(true);

  const func = useCallback(asyncFunction, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await func();
      setIsLoading(false);
    })();
  }, [func]);

  return isLoading;
};
