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
import PeopleIcon from '@mui/icons-material/People';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ProductIcon from '@mui/icons-material/ProductionQuantityLimits';
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
import { ProductDetail } from './pages/products/ProductDetail';
import { MusicGenreList } from './pages/Music/list';
import { MusicGenreDetail } from './pages/Music/MusicGenreDetail';
import { MyMusic } from './pages/Music/MyMusic';
import { MoviesList } from './pages/movie/list';
import MovieIcon from '@mui/icons-material/Movie';
import { MovieDetail } from './pages/movie/MovieDetail';
import QuizGamePage from './pages/quizGame';
import QuizHistory from './pages/quizGame/QuizHistory';
import QuizIcon from '@mui/icons-material/Quiz';
import HistoryIcon from '@mui/icons-material/History';
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
                      meta: {
                        icon: <PeopleIcon />,
                      },
                    },
                    {
                      name: 'music-genres',
                      list: '/music-genres',
                      meta: {
                        icon: <MusicNoteIcon />,
                      },
                    },
                    {
                      name: 'youtube-jobs',
                      list: '/youtube-jobs',
                      create: '/youtube-jobs/create',
                      edit: '/youtube-jobs/edit/:id',
                    },
                    {
                      name: 'my-music',
                      list: '/my-music',
                      meta: {
                        icon: <FavoriteIcon />,
                        label: 'My Music',
                      },
                    },
                    {
                      name: 'chatBoxProduct',
                      list: '/chatBoxProduct',
                      meta: {
                        icon: <ChatIcon />,
                      },
                    },
                    {
                      name: 'products',
                      list: '/products',
                      create: '/products/create',
                      edit: '/products/edit/:id',
                      show: '/products/show/:id',
                      meta: {
                        icon: <ProductIcon />,
                      },
                    },
                    {
                      name: 'blog_posts',
                      list: '/blog-posts',
                      create: '/blog-posts/create',
                      edit: '/blog-posts/edit/:id',
                      show: '/blog-posts/show/:id',
                      meta: {
                        icon: <ProductIcon />,
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
                    {
                      name: 'movies',
                      list: '/movies',
                      show: '/movies/:slug',
                      meta: {
                        icon: <MovieIcon />,
                        canDelete: true,
                      },
                    },
                    {
                      name: 'quiz-game',
                      list: '/quiz-game',
                      meta: {
                        label: 'Quiz',
                        icon: <QuizIcon />,
                      },
                    },
                    {
                      name: 'quiz-game',
                      list: '/quiz-game',
                      meta: {
                        label: 'Quiz Game',
                        parent: 'quiz-game',
                        icon: <QuizIcon />,
                      },
                    },
                    {
                      name: 'quiz-history',
                      list: '/quiz-game/history',
                      meta: {
                        label: 'Quiz History',
                        parent: 'quiz-game',
                        icon: <HistoryIcon />,
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

                        <Route
                          path="show/:id"
                          element={
                            <GameGuard>
                              <ProductDetail />
                            </GameGuard>
                          }
                        />
                      </Route>

                      <Route path="/quiz-game">
                        <Route
                          index
                          element={
                            <GameGuard>
                              <QuizGamePage />
                            </GameGuard>
                          }
                        />

                        <Route
                          path="history"
                          element={
                            <GameGuard>
                              <QuizHistory />
                            </GameGuard>
                          }
                        />
                      </Route>

                      <Route path="/music-genres">
                        <Route index element={<MusicGenreList />} />

                        <Route path=":id" element={<MusicGenreDetail />} />
                      </Route>
                      <Route path="/my-music">
                        <Route index element={<MyMusic />} />
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

                      <Route path="/movies">
                        <Route index element={<MoviesList />} />
                        <Route path="/movies/:slug" element={<MovieDetail />} />
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
