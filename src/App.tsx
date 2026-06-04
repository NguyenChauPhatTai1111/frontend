import { Authenticated, GitHubBanner, Refine } from '@refinedev/core';
import { DevtoolsPanel, DevtoolsProvider } from '@refinedev/devtools';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import { GamePage } from './pages/game';
import { GameGuard } from './components/GameGuard';
import { ThemeLayoutV2 } from './components/theme/ThemedLayoutV2';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/components/ErrorTheme/createTheme';
import {
  ErrorComponent,
  RefineSnackbarProvider,
  useNotificationProvider,
} from '@refinedev/mui';

import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from '@refinedev/react-router';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router';
import { ColorModeContextProvider } from './contexts/color-mode';
import {
  BlogPostCreate,
  BlogPostEdit,
  BlogPostList,
  BlogPostShow,
} from './pages/blog-posts';
import {
  CategoryCreate,
  CategoryEdit,
  CategoryShow,
  UserList,
} from './pages/categories';
import { ChatBoxProduct } from './pages/chatproduct/ChatBoxProduct';
import { ForgotPassword } from './pages/forgotPassword';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { authProvider } from './providers/auth';
import { dataProvider } from './providers/data';
import { ProductList } from './pages/products/list';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GitHubBanner />
        <RefineKbarProvider>
          <ColorModeContextProvider>
            <CssBaseline />
            <GlobalStyles styles={{ html: { WebkitFontSmoothing: 'auto' } }} />
            <RefineSnackbarProvider>
              <DevtoolsProvider>
                <Refine
                  dataProvider={dataProvider}
                  notificationProvider={useNotificationProvider}
                  routerProvider={routerProvider}
                  authProvider={authProvider}
                  resources={[
                    {
                      name: 'users',
                      list: '/users',
                    },
                    {
                      name: 'chatBoxProduct',
                      list: '/chatBoxProduct',
                    },
                    {
                      name: 'products',
                      list: '/products',
                      create: '/products/create',
                      edit: '/products/edit/:id',
                    },
                    {
                      name: 'blog_posts',
                      list: '/blog-posts',
                      create: '/blog-posts/create',
                      edit: '/blog-posts/edit/:id',
                      show: '/blog-posts/show/:id',
                      meta: {
                        canDelete: true,
                      },
                    },
                    {
                      name: 'categories',
                      list: '/categories',
                      create: '/categories/create',
                      edit: '/categories/edit/:id',
                      show: '/categories/show/:id',
                      meta: {
                        canDelete: true,
                      },
                    },
                  ]}
                  options={{
                    syncWithLocation: true,
                    warnWhenUnsavedChanges: true,
                    projectId: 'RdZJDB-tFLIDc-rMQ7LT',
                  }}
                >
                  <Routes>
                    {/* Game riêng không có Layout */}
                    <Route
                      path="/game"
                      element={
                        <Authenticated
                          key="authenticated-game"
                          fallback={<CatchAllNavigate to="/login" />}
                        >
                          <GamePage />
                        </Authenticated>
                      }
                    />

                    {/* Các trang admin có menu */}
                    <Route
                      element={
                        <Authenticated
                          key="authenticated-inner"
                          fallback={<CatchAllNavigate to="/login" />}
                        >
                          <ThemeLayoutV2 />
                        </Authenticated>
                      }
                    >
                      <Route index element={<CatchAllNavigate to="/game" />} />

                      <Route path="/users">
                        <Route
                          index
                          element={
                            <GameGuard>
                              <UserList />
                            </GameGuard>
                          }
                        />
                      </Route>
                      <Route path="/chatBoxProduct">
                        <Route
                          index
                          element={
                            <GameGuard>
                              <ChatBoxProduct />
                            </GameGuard>
                          }
                        />
                      </Route>
                      <Route path="/products">
                        <Route
                          index
                          element={
                            <GameGuard>
                              <ProductList />
                            </GameGuard>
                          }
                        />
                      </Route>

                      <Route path="/blog-posts">
                        <Route index element={<BlogPostList />} />
                        <Route path="create" element={<BlogPostCreate />} />
                        <Route path="edit/:id" element={<BlogPostEdit />} />
                        <Route path="show/:id" element={<BlogPostShow />} />
                      </Route>

                      <Route path="/categories">
                        <Route index element={<UserList />} />
                        <Route path="create" element={<CategoryCreate />} />
                        <Route path="edit/:id" element={<CategoryEdit />} />
                        <Route path="show/:id" element={<CategoryShow />} />
                      </Route>

                      <Route path="*" element={<ErrorComponent />} />
                    </Route>

                    {/* Login */}
                    <Route
                      element={
                        <Authenticated
                          key="authenticated-outer"
                          fallback={<Outlet />}
                        >
                          <NavigateToResource resource="users" />
                        </Authenticated>
                      }
                    >
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                      />
                    </Route>
                  </Routes>
                  <RefineKbar />
                  <UnsavedChangesNotifier />
                  <DocumentTitleHandler />
                </Refine>
                <DevtoolsPanel />
              </DevtoolsProvider>
            </RefineSnackbarProvider>
          </ColorModeContextProvider>
        </RefineKbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
