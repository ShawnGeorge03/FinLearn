import { Heading, Link, Progress, Text } from '@chakra-ui/react';

type UnitListItemProps = {
  name: string;
  href: string;
  value: number;
  max: number;
};

const UnitListItem = ({ name, href, value, max }: UnitListItemProps) => {
  return (
    <Heading
      size="lg"
      w="100%">
      <Link href={href}> {name}</Link>
      <Progress
        className={'progressBar'}
        hasStripe
        max={max}
        min={0}
        mt={3}
        size="md"
        value={value}
      />
      <Text
        fontSize="lg"
        mt={3}>
        {value}/{max} points
      </Text>
    </Heading>
  );
};

export default UnitListItem;
