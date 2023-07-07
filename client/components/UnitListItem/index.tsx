import { Heading, Link, Progress, Text } from '@chakra-ui/react';

type UnitListItemProps = {
  name: string;
  href: string;
  doneValue: number;
  totalValue: number;
};

const UnitListItem = ({
  name,
  href,
  doneValue,
  totalValue,
}: UnitListItemProps) => {
  return (
    <Heading
      size="lg"
      w="100%">
      <Link href={href}> {name}</Link>
      <Progress
        className={'progressBar'}
        hasStripe
        mt={3}
        size="md"
        value={(doneValue / totalValue) * 100}
      />
      <Text
        fontSize="lg"
        mt={3}>
        {doneValue}/{totalValue} points
      </Text>
    </Heading>
  );
};

export default UnitListItem;
