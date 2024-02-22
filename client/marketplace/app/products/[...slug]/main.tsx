'use client';

import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Pagination,
  Paper,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material';
import { useState } from 'react';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import {
  retrieveCategories,
  retrieveMarketplaceProducts,
  retrieveProductSpecifications
} from '../../../../_shared/api';
import Link from 'next/link';
import { ProductSpecificationsInterface } from '../../../../../_shared/types';
import { PriceFilter } from '../../../components';
import { mdiCloseBoxMultiple } from '@mdi/js';
import Icon from '@mdi/react';

interface Props {
  categoryId: number | undefined;
  subcategoryId: number | undefined;
  groupId: number | undefined;
}

const Main = ({ categoryId, subcategoryId, groupId }: Props) => {
  const [page, setPage] = useState(0);
  const id = groupId || subcategoryId || categoryId;
  const { data } = retrieveCategories({
    parentId: id
  });
  const { categories } = data || {};
  const [filters, setFilters] = useState<{
    minPrice: string | undefined;
    maxPrice: string | undefined;
    specifications: {
      [key: string]: ProductSpecificationsInterface;
    };
  }>({
    minPrice: undefined,
    maxPrice: undefined,
    specifications: {}
  });
  const p = retrieveMarketplaceProducts({
    categoryId: id,
    offset: page * 20,
    filters
  });
  const { isLoading } = p;
  const { variants, count = 0 } = p.data || {};
  const categoryTypes = categories?.filter((category) => category.type) || [];
  const categoryTypeLabels = [...new Set(categoryTypes.map((category) => category.type))];
  const s = retrieveProductSpecifications({ categoryId: groupId, enabled: Boolean(groupId) });
  const { specifications = [] } = s.data || {};
  const specificationLabels = [...new Set(specifications.map((specification) => specification.name))];

  const handleSpecificationChange = (specification: ProductSpecificationsInterface) => {
    const specifications = { ...filters.specifications };

    if (specifications[specification.name]?.id === specification.id) {
      delete specifications[specification.name];
    } else {
      specifications[specification.name] = specification;
    }

    setFilters({ ...filters, specifications });

    setPage(0);
  };

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

        {categoryTypeLabels.map((label) => (
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

        {Boolean(filters.minPrice) && (
          <Chip
            label={`Min Price: $${filters.minPrice}`}
            onDelete={() => setFilters({ ...filters, minPrice: undefined })}
            sx={{ mb: 2, mr: 1 }}
          />
        )}

        {Boolean(filters.maxPrice) && (
          <Chip
            label={`Max Price: $${filters.maxPrice}`}
            onDelete={() => setFilters({ ...filters, maxPrice: undefined })}
            sx={{ mb: 2, mr: 1 }}
          />
        )}

        {/* filters.specifications.map((specification) => (
          <Chip
            key={specification.id}
            label={specification.value}
            onDelete={() => handleSpecificationChange(specification)}
            sx={{ mb: 2, mr: 1 }}
          />
        )) */}

        {Object.keys(filters.specifications).length > 0 && (
          <>
            {Object.keys(filters.specifications).map((key) => (
              <Chip
                key={key}
                label={`${filters.specifications[key].name}: ${filters.specifications[key].value}`}
                onDelete={() => handleSpecificationChange(filters.specifications[key])}
                sx={{ mb: 2, mr: 1 }}
              />
            ))}

            <Button
              variant='contained'
              color='error'
              fullWidth
              startIcon={<Icon path={mdiCloseBoxMultiple} size={1} />}
              onClick={() => setFilters({ ...filters, specifications: {} })}
              sx={{ mb: 2 }}
            >
              Clear All
            </Button>
          </>
        )}

        <PriceFilter apply={(minPrice, maxPrice) => setFilters({ ...filters, minPrice, maxPrice })} />

        {specificationLabels.length > 0 && (
          <Box sx={{ overflowY: 'auto', maxHeight: '750px' }}>
            {specificationLabels.map((label) => {
              const filteredSpecifications = specifications.filter(
                (specification) => specification.name === label
              );
              const specs = [];

              for (const specification of filteredSpecifications) {
                const index = specs.findIndex((spec) => spec.id === specification.id);

                if (index < 0) {
                  specs.push(specification);
                }
              }

              if (specs.length > 0) {
                return (
                  <RadioGroup key={label} sx={{ mb: 3 }} value={filters.specifications[label]?.id || ''}>
                    <Typography sx={{ fontWeight: 500 }}>{label}</Typography>

                    {specs.map((specification) => (
                      <FormControlLabel
                        key={specification.id}
                        label={specification.value}
                        value={specification.id}
                        control={<Radio color='info' />}
                        sx={{ display: 'block' }}
                        onChange={() => handleSpecificationChange(specification)}
                      />
                    ))}
                  </RadioGroup>
                );
              }
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Main;
