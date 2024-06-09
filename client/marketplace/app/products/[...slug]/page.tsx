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

  if (groupId) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/category?groupId=${groupId}`, {
      next: { revalidate: 3600 },
      credentials: 'include'
    });
    const data = await res.json();
    const categories = data.categories;

    group = categories[0];
  }

  if (subcategoryId) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/category?subcategoryId=${subcategoryId}`,
      { next: { revalidate: 3600 }, credentials: 'include' }
    );
    const data = await res.json();
    const categories = data.categories;

    subcategory = categories[0];
  }

  if (categoryId) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/category?categoryId=${categoryId}`, {
      next: { revalidate: 3600 },
      credentials: 'include'
    });
    const data = await res.json();
    const categories = data.categories;

    category = categories[0];
  }

  console.log(category, subcategory, group);

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
      ) : subcategory?.name ? (
        <Breadcrumbs>
          <Link href={`/products/${category?.id}`}>
            {category ? category.name.charAt(0).toUpperCase() + category.name.substring(1) : ''}
          </Link>
        </Breadcrumbs>
      ) : null}

      <Main name={name} categoryId={categoryId} subcategoryId={subcategoryId} groupId={groupId} />
    </Box>
  );
};

export default CategoryContainer;
