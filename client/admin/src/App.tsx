import { ThemeProvider } from '@emotion/react';
import { AuthenticatedRoute, TopBar } from './components';
import { theme } from '../../_shared/constants';
import { Box, CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { store } from '../../_shared/redux/store';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import {
  Account,
  Affiliates,
  Categories,
  CreateAccount,
  Main,
  Offers,
  Product,
  ProductBrands,
  ProductVariant,
  Products,
  ResetPassword
} from './pages';
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
                          <Main />
                        </AuthenticatedRoute>
                      }
                    />

                    <Route
                      path='/categories/:parentId?'
                      element={
                        <AuthenticatedRoute>
                          <Categories />
                        </AuthenticatedRoute>
                      }
                    />

                    <Route path='/register' element={<CreateAccount />} />

                    <Route path='/reset-password' element={<ResetPassword />} />

                    <Route
                      path='/account'
                      element={
                        <AuthenticatedRoute>
                          <Account />
                        </AuthenticatedRoute>
                      }
                    />

                    <Route path='/products' element={<Outlet />}>
                      <Route
                        path='/products'
                        element={
                          <AuthenticatedRoute>
                            <Products />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/products/create'
                        element={
                          <AuthenticatedRoute>
                            <Products.Create />
                          </AuthenticatedRoute>
                        }
                      />
                    </Route>

                    <Route
                      path='/product/:productId'
                      element={
                        <AuthenticatedRoute>
                          <Product />
                        </AuthenticatedRoute>
                      }
                    >
                      <Route
                        path='/product/:productId'
                        element={
                          <AuthenticatedRoute>
                            <Product.Edit />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:productId/variants'
                        element={
                          <AuthenticatedRoute>
                            <Product.Variants />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:productId/variants/add'
                        element={
                          <AuthenticatedRoute>
                            <Product.AddVariant />
                          </AuthenticatedRoute>
                        }
                      />
                    </Route>

                    <Route
                      path='/product/:productId/variant/:variantId'
                      element={
                        <AuthenticatedRoute>
                          <ProductVariant />
                        </AuthenticatedRoute>
                      }
                    >
                      <Route
                        path='/product/:productId/variant/:variantId'
                        element={
                          <AuthenticatedRoute>
                            <ProductVariant.Edit />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:productId/variant/:variantId/media'
                        element={
                          <AuthenticatedRoute>
                            <ProductVariant.Media />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:productId/variant/:variantId/options'
                        element={
                          <AuthenticatedRoute>
                            <ProductVariant.Options />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/product/:productId/variant/:variantId/specifications'
                        element={
                          <AuthenticatedRoute>
                            <ProductVariant.Specifications />
                          </AuthenticatedRoute>
                        }
                      />
                    </Route>

                    <Route path='/affiliates' element={<Outlet />}>
                      <Route
                        path='/affiliates'
                        element={
                          <AuthenticatedRoute>
                            <Affiliates />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/affiliates/add'
                        element={
                          <AuthenticatedRoute>
                            <Affiliates.Add />
                          </AuthenticatedRoute>
                        }
                      />
                    </Route>

                    <Route path='/offers' element={<Outlet />}>
                      <Route
                        path='/offers'
                        element={
                          <AuthenticatedRoute>
                            <Offers />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/offers/create'
                        element={
                          <AuthenticatedRoute>
                            <Offers.Create />
                          </AuthenticatedRoute>
                        }
                      />
                    </Route>

                    <Route path='/brand' element={<Outlet />}>
                      <Route
                        path='/brand'
                        element={
                          <AuthenticatedRoute>
                            <ProductBrands />
                          </AuthenticatedRoute>
                        }
                      />

                      <Route
                        path='/brand/create'
                        element={
                          <AuthenticatedRoute>
                            <ProductBrands.Create />
                          </AuthenticatedRoute>
                        }
                      />
                    </Route>
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
