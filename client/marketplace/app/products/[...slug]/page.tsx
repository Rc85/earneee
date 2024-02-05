import Section from '../../../../_shared/components/Section/Section';
import { CategoriesInterface } from '../../../../_shared/types';
import Link from 'next/link';
import { Box, Breadcrumbs } from '@mui/material';
import { cookies } from 'next/headers';
import { createClient } from '../../../utils/supabase/server';
import { notFound } from 'next/navigation';
import Main from './main';

interface Props {
  params: { slug: string[] };
}

const CategoryContainer = async ({ params: { slug } }: Props) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const categoryId = slug[0] ? parseInt(slug[0]) : undefined;
  const subcategoryId = slug[1] ? parseInt(slug[1]) : undefined;
  const groupId = slug[2] ? parseInt(slug[2]) : undefined;

  let category: CategoriesInterface | undefined = undefined;
  let subcategory: CategoriesInterface | undefined = undefined;
  let group: CategoriesInterface | undefined = undefined;

  if (groupId) {
    const response = await supabase
      .from('categories')
      .select()
      .eq('id', groupId)
      .returns<CategoriesInterface[]>();

    group = response.data?.[0];
  }

  if (subcategoryId) {
    const response = await supabase
      .from('categories')
      .select()
      .eq('id', subcategoryId)
      .returns<CategoriesInterface[]>();

    subcategory = response.data?.[0];
  }

  if (categoryId) {
    const response = await supabase
      .from('categories')
      .select()
      .eq('id', categoryId)
      .returns<CategoriesInterface[]>();

    category = response.data?.[0];
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
