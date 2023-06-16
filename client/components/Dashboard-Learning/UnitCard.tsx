import {
  Card,
  CardHeader,
  Text,
  Heading,
  CardBody,
  Button,
  Progress,
  Icon,
  Box,
} from '@chakra-ui/react';
import Link from 'next/link';
import { Unit } from '@/types/components/Dashboard-Learning/types';
import { AiOutlineVideoCamera } from '@react-icons/all-files/ai/AiOutlineVideoCamera';
import { AiOutlineFileText } from '@react-icons/all-files/ai/AiOutlineFileText';
import styles from '../../styles/components/Dashboard.UnitCard.module.scss';

type UnitCradProps = {
  unit: Unit;
  courseSlug: String;
};
const UnitCard = ({ unit, courseSlug }: UnitCradProps) => {
  return (
    <Card bgColor="brand.white">
      <CardHeader>
        <Heading size="md"> {unit.name}</Heading>
      </CardHeader>
      <Progress
        value={1}
        ml={5}
        w="80%"
        hasStripe
        color="brand.gray"
      />
      <CardBody className={styles.cardContainer}>
        <Text>0/{unit.contents.length} completed</Text>
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
            w={'100%'}
            mt={3}
            fontSize={['xs', null, null, 'md']}>
            Begin Learning
          </Button>
        </Link>
      </CardBody>
    </Card>
  );
};
export default UnitCard;
