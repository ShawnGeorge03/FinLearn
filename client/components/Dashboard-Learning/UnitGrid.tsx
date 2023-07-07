'use client';

import { Unit } from '@/types/components/Dashboard-Learning/types';
import { UnitWithProgress } from '@/types/learning';
import { SimpleGrid } from '@chakra-ui/react';
import UnitCard from './UnitCard';

type UnitGridParams = {
  units: Unit[];
  courseSlug: string;
  userUnits: UnitWithProgress[];
};
const UnitGrid = ({ units, courseSlug, userUnits }: UnitGridParams) => {
  const findUnitProgress = (
    completedUnits: UnitWithProgress[],
    unitSlug: string,
  ): number => {
    for (const unitWithProgress of completedUnits)
      if (unitWithProgress.unit.slug === unitSlug)
        return unitWithProgress.progress;

    return 0;
  };
  return (
    <SimpleGrid
      boxShadow="m"
      columns={{ sm: 1, md: 2, lg: 3 }}
      m={3}
      spacing={4}>
      {units.map((unit) => (
        <UnitCard
          completed={findUnitProgress(userUnits, unit.slug)}
          courseSlug={courseSlug}
          key={unit.slug}
          total={unit.contents.length}
          unit={unit}
        />
      ))}
    </SimpleGrid>
  );
};

export default UnitGrid;
