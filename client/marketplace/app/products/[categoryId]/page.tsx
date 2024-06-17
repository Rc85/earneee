import { CategoriesInterface } from '../../../../../_shared/types';
import Link from 'next/link';
import { Box, Breadcrumbs } from '@mui/material';
import { notFound } from 'next/navigation';
import Main from './main';

interface Props {
  params: { categoryId: string };
}

const CategoryContainer = async ({ params: { categoryId } }: Props) => {
  let category: CategoriesInterface | undefined = undefined;
  let breadcrumbs: CategoriesInterface[] = [];

  if (categoryId) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/category?categoryId=${categoryId}`, {
      next: { revalidate: 3600 },
      credentials: 'include'
    });
    const data = await res.json();
    const categories = data.categories;

    category = categories[0];
  }

  if (categoryId) {
    const breadcrumbsData = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/category?categoryId=${categoryId}&withAncestors=true`,
      {
        next: { revalidate: 3600 },
        credentials: 'include'
      }
    );
    const data = await breadcrumbsData.json();

    breadcrumbs = data.categories;
  }

  const name = category?.name;

  return !category ? (
    notFound()
  ) : (
    <Box sx={{ flexGrow: 1 }}>
      <Breadcrumbs>
        {breadcrumbs.map((category) =>
          category.ancestors &&
          category.ancestors.length === 1 &&
          category.ancestors[0].name === breadcrumbs[0].name
            ? null
            : category.ancestors?.map((ancestor) => (
                <Link key={ancestor.id} href={`/products/${ancestor.id}`}>
                  {ancestor.name}
                </Link>
              ))
        )}
      </Breadcrumbs>

      <Main name={name} categoryId={categoryId} />
    </Box>
  );
};

export default CategoryContainer;
