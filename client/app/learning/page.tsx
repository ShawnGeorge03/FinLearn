'use client';

import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Spinner,
  Tag,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';

import CourseCard from '@/components/CourseCard';

import { Course } from '@/types/learning';

export default function LearningPage() {
  const [courses, setCourses] = useState<Array<Course>>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [autoComplete, setAutoComplete] = useState<Array<any>>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const getAutoCompleteList = async () => {
      if (searchTerm.length)
        try {
          const response: Response = await fetch(
            `http://localhost:4000/searchAutoComplete?searchText=${searchTerm}`,
          );
          const searchAutoComplete: any = await response.json();
          setAutoComplete(searchAutoComplete);
        } catch (e: any) {
          console.error(e);
        }
      else setAutoComplete([]);
    };

    getAutoCompleteList();
  }, [searchTerm]);

  const handleSubmitSearch = async (e: any) => {
    e.preventDefault(); // prevents default behavior of submitting form and refreshing the page

    try {
      const validationRegex = /^[a-zA-Z0-9&]+$/;
      if (!searchTerm.length || !validationRegex.test(searchTerm)) getCourses();
      else {
        const response: Response = await fetch(
          `http://localhost:4000/search?searchText=${searchTerm}`,
        );
        const jsonData: any = await response.json();
        if (Object.keys(jsonData).length !== 0) setCourses(jsonData);
      }
      setSearchTerm('');
    } catch (e: any) {
      console.error(e.message);
    }
  };

  const getCourses = async () => {
    try {
      // update to better promise handling
      const response: Response = await fetch('http://localhost:4000/courses');
      const jsonData: Course[] = await response.json();

      setCourses(jsonData);
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  /* Without a dependency array the call to get all courses is only made once */
  useEffect(() => {
    getCourses();
  }, []);

  return (
    <>
      <Flex
        flexDirection={'column'}
        m={10}>
        <Text fontSize="5xl">Courses</Text>
        <Box margin={'50px'}>
          <Center>
            <InputGroup width={'50%'}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.900" />
              </InputLeftElement>
              <Input
                isReadOnly
                onClick={onOpen}
                placeholder="Explore learning..."
              />
            </InputGroup>
          </Center>
        </Box>
      </Flex>
      <Flex
        alignItems={'center'}
        direction={'row'}
        gap="2"
        justifyContent={'space-around'}
        margin={'5%'}>
        {courses == undefined ? (
          <Spinner
            color="blue.500"
            emptyColor="gray.200"
            size="xl"
            speed="0.65s"
            thickness="4px"
          />
        ) : (
          courses.map(({ name, slug, icon }, index) => {
            return (
              <CourseCard
                icon={icon}
                key={index}
                name={name}
                slug={slug}
              />
            );
          })
        )}
      </Flex>

      <Modal
        isCentered
        isOpen={isOpen}
        onClose={() => {
          setSearchTerm('');
          onClose();
        }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <form onSubmit={handleSubmitSearch}>
              <InputGroup width={'100%'}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.900" />
                </InputLeftElement>
                <Input
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Explore learning..."
                  value={searchTerm}
                />
              </InputGroup>
            </form>
          </ModalHeader>
          <ModalBody>
            {autoComplete.length > 0 && (
              <Flex
                alignItems={'center'}
                flexDirection={'column'}
                justifyContent={'space-around'}>
                {autoComplete.map((item, idx) => {
                  return (
                    <Link
                      href={item.href}
                      key={idx}
                      margin={'10px'}
                      width={'100%'}>
                      <Box
                        backgroundColor={'gray.200'}
                        borderRadius={10}
                        boxShadow={'0 2px 4px rgba(0, 0, 0, 0.2)'}
                        p={5}
                        width={'100%'}>
                        <HStack>
                          <Text fontWeight={'semibold'}>{item.name}</Text>
                          <Spacer />
                          <Tag
                            colorScheme={
                              item.source === 'course' ? 'blue' : 'teal'
                            }
                            variant="outline">
                            {item.source.toString().toUpperCase()}
                          </Tag>
                        </HStack>
                      </Box>
                    </Link>
                  );
                })}
              </Flex>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                setSearchTerm('');
                onClose();
              }}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
