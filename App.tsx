import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { AuthProvider } from './src/context/AuthProvider';
import Root from './src/Root';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Root />
      </AuthProvider>
    </QueryClientProvider>
  );
}
