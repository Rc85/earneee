import Section from '../../../../_shared/components/Section/Section';
import { CategoriesInterface } from '../../../../../_shared/types';
import Link from 'next/link';
import { Box, Breadcrumbs } from '@mui/material';
import { notFound } from 'next/navigation';
import Main from './main';

interface Props {
  params: { slug: string[] };
}

const CategoryContainer = async ({ params: { slug } }: Props) => {
  const categoryId = slug[0] ? parseInt(slug[0]) : undefined;
  const subcategoryId = slug[1] ? parseInt(slug[1]) : undefined;
  const groupId = slug[2] ? parseInt(slug[2]) : undefined;

  let category: CategoriesInterface | undefined = undefined;
  let subcategory: CategoriesInterface | undefined = undefined;
  let group: CategoriesInterface | undefined = undefined;
  let url = '';

  if (categoryId) {
    url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/category/retrieve?categoryId=${categoryId}`;
  } else if (subcategoryId) {
    url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/category/retrieve?subcategoryId=${subcategoryId}`;
  } else if (groupId) {
    url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/category/retrieve?groupId=${groupId}`;
  }

  const res = await fetch(url, { next: { revalidate: 300 }, credentials: 'include' });
  const data = await res.json();
  const categories = data.categories;

  if (categoryId) {
    category = categories[0];
  } else if (subcategoryId) {
    subcategory = categories[0];
  } else if (groupId) {
    group = categories[0];
  }

  const name = group?.name || subcategory?.name || category?.name;

  return !category && !subcategory && !group ? (
    notFound()
  ) : (
    <Box sx={{ flexGrow: 1 }}>
      {group ? (
        <Breadcrumbs>
          <Link href={`/products/${category?.id}`}>
            {category ? category.name.charAt(0).toUpperCase() + category.name.substring(1) : ''}
          </Link>

          <Link href={`/products/${category?.id}/${subcategory?.id}`}>
            {subcategory ? subcategory.name.charAt(0).toUpperCase() + subcategory?.name.substring(1) : ''}
          </Link>
        </Breadcrumbs>
      ) : (
        subcategory?.name && (
          <Breadcrumbs>
            <Link href={`/products/${category?.id}`}>
              {category ? category.name.charAt(0).toUpperCase() + category.name.substring(1) : ''}
            </Link>
          </Breadcrumbs>
        )
      )}

      <Section title={name?.toUpperCase()} titleVariant='h3' maxWidth='xl' disableGutters>
        <Main categoryId={categoryId} subcategoryId={subcategoryId} groupId={groupId} />
      </Section>
    </Box>
  );
};

export default CategoryContainer;
