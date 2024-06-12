import { ThemeProvider } from '@emotion/react';
import { AuthenticatedRoute, TopBar } from './components';
import { theme } from '../../_shared/constants';
import { Box, CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { store } from '../../_shared/redux/store';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import * as Pages from './pages';
import axios from 'axios';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false
      }
    }
  });

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <CssBaseline>
              <BrowserRouter>
                <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                  <TopBar maxWidth={false} />

                  <Routes>
                    <Route
                      path='/'
                      element={
                        <AuthenticatedRoute>
                          <Pages.Main />
                        </AuthenticatedRoute>
                      }
                    />

                    <Route
                      path='/categories/:parentId?'
                      element={
                        <AuthenticatedRoute>
                          <Pages.Categories />
                        </AuthenticatedRoute>
                      }
                    />

                    <Route path='/register' element={<Pages.CreateAccount />} />

                    <Route path='/reset-password' element={<Pages.ResetPassword />} />

                    <Route
                      path='/account'
                      element={
                        <AuthenticatedRoute>
                          <Pages.Account />
                        </AuthenticatedRoute>
                      }
                    />

                    <Route path='/products' element={<Outlet />}>
                      <Route
                        path='/products'
                        element={
                          <AuthenticatedRoute>
                            <Pages.Products />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/products/create'
                        element={
                          <AuthenticatedRoute>
                            <Pages.Products.Create />
                          </AuthenticatedRoute>
                        }
                      />
                    </Route>

                    <Route
                      path='/product/:id'
                      element={
                        <AuthenticatedRoute>
                          <Pages.Product />
                        </AuthenticatedRoute>
                      }
                    >
                      <Route
                        path='/product/:id'
                        element={
                          <AuthenticatedRoute>
                            <Pages.Product.Edit />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:id/media'
                        element={
                          <AuthenticatedRoute>
                            <Pages.Product.Media />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:id/specifications'
                        element={
                          <AuthenticatedRoute>
                            <Pages.Product.Specifications />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:id/options'
                        element={
                          <AuthenticatedRoute>
                            <Pages.Product.Options />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:id/about'
                        element={
                          <AuthenticatedRoute>
                            <Pages.Product.About title='About' field='about' />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:id/details'
                        element={
                          <AuthenticatedRoute>
                            <Pages.Product.Details title='Main Details' field='details' />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:id/review'
                        element={
                          <AuthenticatedRoute>
                            <Pages.Product.Review title='Review' field='review' />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:id/variants'
                        element={
                          <AuthenticatedRoute>
                            <Pages.Product.Variants />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:id/variants/add'
                        element={
                          <AuthenticatedRoute>
                            <Pages.Product.AddVariant />
                          </AuthenticatedRoute>
                        }
                      />
                    </Route>

                    <Route
                      path='/product/:id/variant/:productId'
                      element={
                        <AuthenticatedRoute>
                          <Pages.Product />
                        </AuthenticatedRoute>
                      }
                    >
                      <Route
                        path='/product/:id/variant/:productId'
                        element={
                          <AuthenticatedRoute>
                            <Pages.Product.Edit />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:id/variant/:productId/media'
                        element={
                          <AuthenticatedRoute>
                            <Pages.Product.Media />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:id/variant/:productId/options'
                        element={
                          <AuthenticatedRoute>
                            <Pages.Product.Options />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:id/variant/:productId/specifications'
                        element={
                          <AuthenticatedRoute>
                            <Pages.Product.Specifications />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:id/variant/:productId/about'
                        element={
                          <AuthenticatedRoute>
                            <Pages.Product.About title='About' field='about' />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:id/variant/:productId/details'
                        element={
                          <AuthenticatedRoute>
                            <Pages.Product.Details title='Main Details' field='details' />
                          </AuthenticatedRoute>
                        }
                      />
                    </Route>

                    <Route path='/affiliates' element={<Outlet />}>
                      <Route
                        path='/affiliates'
                        element={
                          <AuthenticatedRoute>
                            <Pages.Affiliates />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/affiliates/add'
                        element={
                          <AuthenticatedRoute>
                            <Pages.Affiliates.Add />
                          </AuthenticatedRoute>
                        }
                      />
                    </Route>

                    <Route path='/offers' element={<Outlet />}>
                      <Route
                        path='/offers'
                        element={
                          <AuthenticatedRoute>
                            <Pages.Offers />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/offers/create'
                        element={
                          <AuthenticatedRoute>
                            <Pages.Offers.Create />
                          </AuthenticatedRoute>
                        }
                      />
                    </Route>

                    <Route path='/brand' element={<Outlet />}>
                      <Route
                        path='/brand'
                        element={
                          <AuthenticatedRoute>
                            <Pages.ProductBrands />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/brand/create'
                        element={
                          <AuthenticatedRoute>
                            <Pages.ProductBrands.Create />
                          </AuthenticatedRoute>
                        }
                      />
                    </Route>

                    <Route
                      path='/statuses'
                      element={
                        <AuthenticatedRoute>
                          <Pages.Statuses />
                        </AuthenticatedRoute>
                      }
                    />

                    <Route
                      path='/users'
                      element={
                        <AuthenticatedRoute>
                          <Pages.Users />
                        </AuthenticatedRoute>
                      }
                    />
                  </Routes>
                </Box>
              </BrowserRouter>
            </CssBaseline>
          </SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
