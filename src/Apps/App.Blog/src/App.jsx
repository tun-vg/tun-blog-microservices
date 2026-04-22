import { ReactKeycloakProvider } from '@react-keycloak/web';
import './App.css';
import keycloak from './keycloak';
import AppRoutes from './navigation/routes/AppRoutes';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <>
      <ReactKeycloakProvider
          authClient={keycloak}
          initOptions={{ 
              onLoad: 'check-sso',
              silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
              pkceMethod: 'S256',
              redirectUri: window.location.origin,
              storeTokens: true
          }}
      >
          <UserProvider>
              <AppRoutes />
          </UserProvider>
      </ReactKeycloakProvider>
    </>
  );
}

export default App;
