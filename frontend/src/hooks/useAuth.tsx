import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
// encapsulates the authentication context to provide a convenient way for components to access authentication-related functions and state.


// This hook provides access to the authentication context, allowing components to use authentication-related functions and state.
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // If the context is undefined, it means the hook is being used outside of an AuthProvider
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { useAuth };