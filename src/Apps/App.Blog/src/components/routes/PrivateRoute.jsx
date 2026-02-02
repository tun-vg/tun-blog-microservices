import { useKeycloak } from '@react-keycloak/web';

const PrivateRoute = ({ children }) => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) return <div>Loading Keycloak...</div>;

  return keycloak?.authenticated ? (
    children
  ) : (
    keycloak.login()
  );
};

export default PrivateRoute;