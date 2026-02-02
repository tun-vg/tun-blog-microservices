import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import publicRoutes from './PublicRoutes';
import privateRoutes from './PrivateRoutes';
import { useKeycloak } from '@react-keycloak/web';

const PublicRoute = lazy(() => import('../../components/routes/PublicRoute'));
const PrivateRoute = lazy(() => import('../../components/routes/PrivateRoute'));
const NotFoundPage = lazy(() => import('../../pages/errors/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('../../pages/errors/UnauthorizedPage'));
const LoadingOverlay = lazy(() => import('../../components/loading/LoadingOverlay'));
const MainLayout = lazy(() => import('../../components/layouts/MainLayout'));

const checkAccess = (userRoles, routeRoles) => {
  if (!routeRoles || routeRoles.length === 0) {
    return true;
  }
  return routeRoles.some((role) => userRoles.includes(role));
};

const ProtectedRoute = ({ children, access, userRoles }) => {
  if (!access || access.length === 0) {
    return children;
  } else if (!checkAccess(userRoles, access)) {
    return <UnauthorizedPage />;
  }
  return children;
};

const RenderRoute = ({ route, userRoles }) => (
  <Suspense fallback={<LoadingOverlay />}>
    <ProtectedRoute access={route.access} userRoles={userRoles}>
        {route.element}
    </ProtectedRoute>
  </Suspense>
);

const AppRoutes = () => {
  const { keycloak } = useKeycloak();

  const userRoles = keycloak?.tokenParsed?.realm_access?.roles || [];

  const router = createBrowserRouter(
    [
      ...publicRoutes.map((route) => ({
        ...route,
        element: (
          <PublicRoute>
            <RenderRoute route={route} userRoles={userRoles} />
          </PublicRoute>
        ),
      })),
      ...privateRoutes.map((route) => ({
        ...route,
        children: route.children?.map((childRoute) => ({
          ...childRoute,
          element: (
            <PrivateRoute>
              <ProtectedRoute
                access={childRoute.access}
                userRoles={userRoles}
              >
                <Suspense fallback={<LoadingOverlay />}>
                  {childRoute.element}
                </Suspense>
              </ProtectedRoute>
            </PrivateRoute>
          )
        }))
      })),
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
    {
      future: {
        v7_normalizeFormMethod: true,
        v7_fetcherPersist: true,
      },
    }
  );

  return <RouterProvider router={router} />;
};

export default AppRoutes;
