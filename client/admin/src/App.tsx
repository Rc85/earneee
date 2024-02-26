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
                      path='/product/:productId'
                      element={
                        <AuthenticatedRoute>
                          <Pages.Product />
                        </AuthenticatedRoute>
                      }
                    >
                      <Route
                        path='/product/:productId'
                        element={
                          <AuthenticatedRoute>
                            <Pages.Product.Edit />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:productId/variants'
                        element={
                          <AuthenticatedRoute>
                            <Pages.Product.Variants />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:productId/variants/add'
                        element={
                          <AuthenticatedRoute>
                            <Pages.Product.AddVariant />
                          </AuthenticatedRoute>
                        }
                      />
                    </Route>

                    <Route
                      path='/product/:productId/variant/:variantId'
                      element={
                        <AuthenticatedRoute>
                          <Pages.ProductVariant />
                        </AuthenticatedRoute>
                      }
                    >
                      <Route
                        path='/product/:productId/variant/:variantId'
                        element={
                          <AuthenticatedRoute>
                            <Pages.ProductVariant.Edit />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:productId/variant/:variantId/media'
                        element={
                          <AuthenticatedRoute>
                            <Pages.ProductVariant.Media />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:productId/variant/:variantId/options'
                        element={
                          <AuthenticatedRoute>
                            <Pages.ProductVariant.Options />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:productId/variant/:variantId/specifications'
                        element={
                          <AuthenticatedRoute>
                            <Pages.ProductVariant.Specifications />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:productId/variant/:variantId/about'
                        element={
                          <AuthenticatedRoute>
                            <Pages.ProductVariant.About />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:productId/variant/:variantId/details'
                        element={
                          <AuthenticatedRoute>
                            <Pages.ProductVariant.Details />
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
