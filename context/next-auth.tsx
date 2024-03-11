'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

/**
 * `NextAuthProvider` wraps its children with the `SessionProvider` component from NextAuth.js.
 * This component is used to provide session context to all child components, enabling them to access session data
 * using the `useSession` hook from NextAuth.js. It's an essential part of integrating NextAuth.js for authentication
 * in a Next.js application, as it allows child components to be aware of the authentication state.
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components that `NextAuthProvider` will wrap. These children can access the session data provided by `SessionProvider`.
 * @returns {React.ReactElement} A `SessionProvider` component wrapping the provided children, facilitating session management across the application.
 */
export default function NextAuthProvider({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return <SessionProvider>{children}</SessionProvider>;
}
