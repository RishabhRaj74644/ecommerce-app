import { useSelector } from 'react-redux'

const useAuth = () => {
  const { user, accessToken, loading, error } = useSelector(
    (state) => state.auth
  )

  return {
    user,
    accessToken,
    loading,
    error,
    isAuthenticated: !!accessToken,
    isAdmin: user?.role === 'admin',
  }
}

export default useAuth