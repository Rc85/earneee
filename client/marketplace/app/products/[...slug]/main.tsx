'use client';

import {
  Box,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Link,
  Pagination,
  Paper,
  Typography
} from '@mui/material';
import { useState } from 'react';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { retrieveCategories, retrieveMarketplaceProducts } from '../../../../_shared/api';

interface Props {
  categoryId: number | undefined;
  subcategoryId: number | undefined;
  groupId: number | undefined;
}

const Main = ({ categoryId, subcategoryId, groupId }: Props) => {
  const [page, setPage] = useState(0);
  const id = groupId || subcategoryId || categoryId;
  const { data: { data: { categories } } = { data: {} } } = retrieveCategories({
    parentId: id
  });
  const { isLoading, data: { data: { variants = [], count = 0 } } = { data: {} } } =
    retrieveMarketplaceProducts({
      categoryId: id,
      offset: page * 20
    });
  //const [appliedFilters, setAppliedFilters] = useState({});
  const categoryTypes = categories?.filter((category) => category.type) || [];
  const categoryTypeLabels = [...new Set(categoryTypes.map((category) => category.type))];

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, mr: 2 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={Math.ceil(count / 30)}
                page={page + 1}
                sx={{ mb: 3 }}
                onChange={(_, page) => setPage(page - 1)}
              />
            </Box>

            <Grid2 container spacing={1}>
              {variants?.map((variant) => (
                <Grid2 key={variant.id} xs={12} sm={6} md={4} xl={3}>
                  <Paper variant='outlined' className='product-card'>
                    <Box component='a' href={`/product/${variant.product?.id}?variant=${variant.id}`}>
                      <Box
                        sx={{
                          width: '100%',
                          height: '200px',
                          borderTopRightRadius: '3px',
                          borderTopLeftRadius: '3px',
                          backgroundImage: variant.media?.[0]?.url
                            ? `url('${variant.media[0].url}')`
                            : undefined,
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: 'contain',
                          backgroundPosition: 'center'
                        }}
                      />

                      <Box sx={{ p: 1 }}>
                        <Typography sx={{ fontWeight: 'bold' }}>{variant.product?.name}</Typography>

                        <Typography variant='body2' color='GrayText'>
                          {variant.name}
                        </Typography>
                      </Box>

                      <Divider />

                      <Box sx={{ p: 1 }}>
                        <Typography sx={{ textAlign: 'right' }}>
                          {' '}
                          {Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'CAD',
                            currencyDisplay: 'narrowSymbol'
                          }).format(variant.price)}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid2>
              ))}
            </Grid2>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={Math.ceil(count / 30)}
                page={page + 1}
                sx={{ mt: 3 }}
                onChange={(_, page) => setPage(page - 1)}
              />
            </Box>
          </>
        )}
      </Box>

      <Box sx={{ width: '25%', minWidth: '200px', maxWidth: '300px', flexShrink: 0 }}>
        {(categories || [])?.filter((category) => !category.type).length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 500, mb: 1 }}>Categories</Typography>

            {categories
              ?.filter((category) => !category.type)
              .map((category) => {
                const url = subcategoryId
                  ? `/products/${categoryId}/${subcategoryId}/${category.id}`
                  : `/products/${categoryId}/${category.id}`;

                return (
                  <Box key={category.id}>
                    <Link href={url}>{category.name}</Link>
                  </Box>
                );
              })}
          </Box>
        )}

        {categoryTypeLabels.length > 0 &&
          categoryTypeLabels.map((label) => (
            <Box key={label} sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 500 }}>{label}</Typography>

              {categoryTypes
                .filter((category) => category.type === label)
                .map((category) => (
                  <FormControlLabel
                    key={category.id}
                    label={category.name}
                    control={<Checkbox color='info' />}
                    sx={{ display: 'block' }}
                  />
                ))}
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default Main;
