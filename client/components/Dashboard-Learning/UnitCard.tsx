import { Unit } from '@/types/components/Dashboard-Learning/types';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Icon,
  Progress,
  Text,
} from '@chakra-ui/react';
import { AiOutlineFileText } from '@react-icons/all-files/ai/AiOutlineFileText';
import { AiOutlineVideoCamera } from '@react-icons/all-files/ai/AiOutlineVideoCamera';
import Link from 'next/link';
import styles from '../../styles/components/Dashboard.UnitCard.module.scss';

type UnitCradProps = {
  unit: Unit;
  courseSlug: string;
  total: number;
  completed: number;
};
const UnitCard = ({ unit, courseSlug, total, completed }: UnitCradProps) => {
  return (
    <Card bgColor="brand.white">
      <CardHeader>
        <Heading size="md"> {unit.name}</Heading>
      </CardHeader>
      <Progress
        ml={5}
        value={completed === 0 ? 1 : (completed * 100) / total}
        w="80%"
      />
      <CardBody className={styles.cardContainer}>
        <Text>
          {completed.toString()}/{total.toString()} completed
        </Text>
        <Box
          display={'inline-flex'}
          mt={5}>
          <Icon
            as={
              unit.contents[0].contentType == 'video'
                ? AiOutlineVideoCamera
                : AiOutlineFileText
            }
            boxSize={6}
          />
          <Text ml={2}> {unit.contents[0].name}</Text>
        </Box>
        <Link href={`/learning/${courseSlug}`}>
          <Button
            fontSize={['xs', null, null, 'md']}
            mt={3}
            w={'100%'}>
            Begin Learning
          </Button>
        </Link>
      </CardBody>
    </Card>
  );
};
export default UnitCard;
