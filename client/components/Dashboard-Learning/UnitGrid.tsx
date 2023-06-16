'use client';

import { SimpleGrid } from '@chakra-ui/react';
import { Unit } from '@/types/components/Dashboard-Learning/types';
import UnitCard from './UnitCard';

type UnitGridParams = {
  units: Unit[];
  courseSlug: String;
};
const UnitGrid = ({ units, courseSlug }: UnitGridParams) => {
  return (
    <SimpleGrid
      spacing={4}
      columns={{ sm: 1, md: 2, lg: 3 }}
      m={3}
      boxShadow="m">
      {units.map((unit) => (
        <UnitCard
          key={unit.slug}
          unit={unit}
          courseSlug={courseSlug}
        />
      ))}
    </SimpleGrid>
  );
};

export default UnitGrid;
