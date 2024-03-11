'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

/**
 * `QueryProvider` wraps its children with the `QueryClientProvider` from React Query.
 * This enables using React Query's features throughout the component tree inside it.
 * It initializes a new query client instance and provides it to all child components,
 * allowing them to use hooks like `useQuery` and `useMutation`.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - Child components to render inside the provider.
 * @returns {React.ReactElement} The `QueryClientProvider` component wrapping the children.
 */
export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
