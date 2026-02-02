import { ReactKeycloakProvider } from '@react-keycloak/web';
import './App.css';
import keycloak from './keycloak';
import AppRoutes from './navigation/routes/AppRoutes';

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
          <AppRoutes />
      </ReactKeycloakProvider>
    </>
  );
}

export default App;
