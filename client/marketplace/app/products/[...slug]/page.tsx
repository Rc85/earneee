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
  let breadcrumbs: CategoriesInterface[] = [];

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

  const id = groupId || subcategoryId || categoryId;

  if (id) {
    const breadcrumbsData = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/category?categoryId=${id}&withAncestors=true`,
      {
        next: { revalidate: 3600 },
        credentials: 'include'
      }
    );
    const data = await breadcrumbsData.json();

    breadcrumbs = data.categories;
  }

  const name = group?.name || subcategory?.name || category?.name;

  return !category && !subcategory && !group ? (
    notFound()
  ) : (
    <Box sx={{ flexGrow: 1 }}>
      <Breadcrumbs>
        {breadcrumbs.map((category) =>
          category.ancestors?.map((ancestor) => (
            <Link key={ancestor.id} href={`/products/${ancestor.id}`}>
              {ancestor.name}
            </Link>
          ))
        )}
      </Breadcrumbs>

      <Main name={name} categoryId={categoryId} subcategoryId={subcategoryId} groupId={groupId} />
    </Box>
  );
};

export default CategoryContainer;
