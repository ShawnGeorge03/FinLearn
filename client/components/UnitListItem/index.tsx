import { Heading } from '@chakra-ui/react';

type UnitListItemProps = {
  name: string;
};

const UnitListItem = ({ name }: UnitListItemProps) => {
  return (
    <Heading
      size="lg"
      textTransform="capitalize">
      {name}
    </Heading>
  );
};

export default UnitListItem;
