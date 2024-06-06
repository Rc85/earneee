import { Section } from '../../../../_shared/components';
import RichForm from './RichForm';

const About = () => {
  return (
    <Section title='About' titleVariant='h3'>
      <RichForm field='about' />
    </Section>
  );
};

export default About;
