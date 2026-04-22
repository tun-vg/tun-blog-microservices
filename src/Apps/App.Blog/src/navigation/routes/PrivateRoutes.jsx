/* eslint-disable react-refresh/only-export-components */
import { Children, lazy, Suspense } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import MainLayout from '../../components/layouts/MainLayout';

const DashboardPage = lazy(
  () => import('../../pages/admins/dashboards/DashboardPage')
);

const TagManagementPage = lazy(
  () => import('../../pages/admins/tags/TagManagementPage')
);

const UserProfileEditPage = lazy(
  () => import('../../pages/profiles/UserProfileEditPage')
);

const CreatePostPage = lazy(
  () => import('../../pages/clients/CreatePostPage')
);

const PostManagementPage = lazy(
  () => import('../../pages/admins/posts/PostManagementPage')
);

const CategoryManagementPage = lazy(
  () => import('../../pages/admins/categories/CategoryManagementPage')
)

const privateRoutes = [
  {
    path: 'app',
    element:
      <Suspense fallback={<div>Loading...</div>}>
        <AdminLayout />
      </Suspense>,
    children: [
      {
        index: true,
        element: <DashboardPage />,
        access: ['ADMIN']
      },
      {
        path: 'tag-management',
        element: <TagManagementPage />,
        // access: ['ADMIN']
      },
      {
        path: 'post-management',
        element: <PostManagementPage />,
        access: ['ADMIN']
      },
      {
        path: 'category-management',
        element: <CategoryManagementPage />,
        // access: ['ADMIN']
      }
    ]
  },
  {
    path: 'user-profile',
    element:
      <Suspense fallback={<div>Loading...</div>}>
        <MainLayout />
      </Suspense>,
    children: [
      {
        path: 'settings',
        element: <UserProfileEditPage />,
        // access: ['ADMIN', 'USER'],
      }
    ]
  },
  {
    path: 'post',
    element:
      <Suspense fallback={<div>Loading...</div>}>
        <MainLayout />
      </Suspense>,
    children: [
      {
        path: 'create',
        element: <CreatePostPage />,
        access: ['ADMIN', 'USER'],
      },
    ]
  },
];

export default privateRoutes;
