import { ProductsInterface } from '../../../../../_shared/types';
import { Section } from '../../../../_shared/components';
import RichForm from './RichForm';

interface Props {
  title: string;
  field: keyof ProductsInterface;
}

const RichFormPage = ({ title, field }: Props) => {
  return (
    <Section title={title} titleVariant='h3'>
      <RichForm field={field} />
    </Section>
  );
};

export default RichFormPage;
