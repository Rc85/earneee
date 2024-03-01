'use client';

import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Pagination,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { useState } from 'react';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import {
  retrieveCategories,
  retrieveMarketplaceProductSpecifications,
  retrieveMarketplaceProducts
} from '../../../../_shared/api';
import Link from 'next/link';
import { ProductSpecificationsInterface } from '../../../../../_shared/types';
import { PriceFilter } from '../../../components';
import { mdiCloseBoxMultiple, mdiImageOff, mdiViewGrid, mdiViewList } from '@mdi/js';
import Icon from '@mdi/react';
import { grey } from '@mui/material/colors';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../../../_shared/redux/store';

interface Props {
  categoryId: number | undefined;
  subcategoryId: number | undefined;
  groupId: number | undefined;
}

const Main = ({ categoryId, subcategoryId, groupId }: Props) => {
  const [page, setPage] = useState(0);
  const id = groupId || subcategoryId || categoryId;
  const { data } = retrieveCategories({
    parentId: id,
    hasProducts: true
  });
  const [orderBy, setOrderBy] = useState('newest');
  const [view, setView] = useState('grid');
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
    filters,
    orderBy
  });
  const { country } = useAppSelector((state) => state.App);
  const { isLoading } = p;
  const { variants, count = 0 } = p.data || {};
  const s = retrieveMarketplaceProductSpecifications({ categoryId: groupId, enabled: Boolean(groupId) });
  const { specifications = [] } = s.data || {};
  const specificationLabels = [...new Set(specifications.map((specification) => specification.name))];
  const router = useRouter();

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

  const handleSortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderBy(e.target.value);
    setPage(0);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ width: '25%', minWidth: '200px', maxWidth: '300px', flexShrink: 0 }}>
        {categories && categories.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 500, mb: 1 }}>Categories</Typography>

            {categories?.map((category) => {
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
                  <>
                    <Typography sx={{ fontWeight: 500 }}>{label}</Typography>

                    {specs.map((specification) => (
                      <FormControlLabel
                        key={specification.id}
                        label={specification.value}
                        value={specification.id}
                        control={<Checkbox color='info' />}
                        sx={{ display: 'block' }}
                        onChange={() => handleSpecificationChange(specification)}
                        checked={Boolean(filters.specifications[label]?.id === specification.id)}
                      />
                    ))}
                  </>
                );
              }
            })}
          </Box>
        )}
      </Box>

      <Box sx={{ flexGrow: 1, ml: 2 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
              <TextField
                label='Sort'
                select
                SelectProps={{ native: true }}
                fullWidth={false}
                sx={{ mb: '0 !important', mr: 2 }}
                onChange={handleSortChange}
                value={orderBy}
              >
                <option value='newest'>Newest</option>
                <option value='oldest'>Oldest</option>
                <option value='name_asc'>Name A-Z</option>
                <option value='name_desc'>Name Z-A</option>
                <option value='price_asc'>Lowest Price</option>
                <option value='price_desc'>Highest Price</option>
              </TextField>

              <ToggleButtonGroup size='small' exclusive value={view} onChange={(_, value) => setView(value)}>
                <ToggleButton value='grid'>
                  <Icon path={mdiViewGrid} size={1} />
                </ToggleButton>

                <ToggleButton value='list'>
                  <Icon path={mdiViewList} size={1} />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={Math.ceil(count / 30)}
                page={page + 1}
                sx={{ mb: 3 }}
                onChange={(_, page) => setPage(page - 1)}
              />
            </Box>

            {view === 'grid' ? (
              <Grid2 container spacing={1}>
                {variants?.map((variant) => {
                  const urls = variant.urls || [];
                  const countryCode = country || 'ca';
                  const url =
                    urls.find((url) => url.country.toLowerCase() === countryCode.toLowerCase()) || urls[0];

                  return (
                    <Grid2 key={variant.id} xs={12} sm={6} md={4} xl={3}>
                      <Paper
                        variant='outlined'
                        className='product-card'
                        onClick={() => router.push(`/product/${variant.product?.id}?variant=${variant.id}`)}
                        sx={{ width: 0, minWidth: '100%', cursor: 'pointer' }}
                      >
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
                            backgroundColor: variant.media?.[0]?.url ? 'transparent' : grey[300],
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          {!variant.media?.[0]?.url && <Icon path={mdiImageOff} size={5} color={grey[500]} />}
                        </Box>

                        <Box sx={{ p: 1 }}>
                          <Typography sx={{ fontWeight: 'bold' }}>{variant.product?.name}</Typography>

                          <Typography variant='body2' color='GrayText'>
                            {variant.name}
                          </Typography>
                        </Box>

                        {Boolean(variant.product?.excerpt) && (
                          <Box sx={{ p: 1 }}>
                            <Typography
                              sx={{
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                WebkitLineClamp: 3
                              }}
                            >
                              {variant.excerpt || variant.product?.excerpt}
                            </Typography>
                          </Box>
                        )}

                        {Boolean(url) && (
                          <>
                            <Divider />

                            <Box sx={{ p: 1 }}>
                              <Typography sx={{ textAlign: 'right' }}>
                                ${url.price.toFixed(2)} {url.currency.toUpperCase()}
                              </Typography>
                            </Box>
                          </>
                        )}
                      </Paper>
                    </Grid2>
                  );
                })}
              </Grid2>
            ) : (
              <List disablePadding>
                {variants?.map((variant) => {
                  const urls = variant.urls || [];
                  const countryCode = country || 'ca';
                  const url =
                    urls.find((url) => url.country.toLowerCase() === countryCode.toLowerCase()) || urls[0];

                  return (
                    <ListItem key={variant.id} disableGutters divider>
                      <ListItemButton
                        sx={{ alignItems: 'flex-start' }}
                        onClick={() => router.push(`/product/${variant.product?.id}?variant=${variant.id}`)}
                      >
                        <ListItemIcon sx={{ mr: 1 }}>
                          <Avatar
                            src={variant.media?.[0]?.url || '/broken.jpg'}
                            variant='rounded'
                            alt={variant.name}
                            sx={{ width: 100, height: 100, backgroundColor: grey[300] }}
                          >
                            <Icon path={mdiImageOff} size={1} color={grey[500]} />
                          </Avatar>
                        </ListItemIcon>

                        <ListItemText
                          primary={`${variant.product?.name} - ${variant.name}`}
                          secondary={variant.excerpt || variant.product?.excerpt}
                        />
                      </ListItemButton>

                      {Boolean(url) && (
                        <Typography variant='h6'>
                          ${url.price.toFixed(2)} {url.currency.toUpperCase()}
                        </Typography>
                      )}
                    </ListItem>
                  );
                })}
              </List>
            )}

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
    </Box>
  );
};

export default Main;
