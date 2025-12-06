import {
  Box,
  Container,
  Stack,
  Text,
  HStack,
  Link,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';

const AdminFooter = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      bg={bgColor}
      borderTop="1px"
      borderColor={borderColor}
      py={4}
      mt="auto"
    >
      <Container maxW="full" px={6}>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify="space-between"
          align="center"
        >
          <Text fontSize="sm" color={textColor}>
            © {new Date().getFullYear()} ShopHub Admin Panel. All rights reserved.
          </Text>

          <HStack spacing={6} fontSize="sm">
            <Link color={textColor} _hover={{ color: 'cyan.500' }}>
              Documentation
            </Link>
            <Link color={textColor} _hover={{ color: 'cyan.500' }}>
              Support
            </Link>
            <Link color={textColor} _hover={{ color: 'cyan.500' }}>
              Privacy Policy
            </Link>
            <Link color={textColor} _hover={{ color: 'cyan.500' }}>
              Terms
            </Link>
          </HStack>

          <Text fontSize="sm" color={textColor}>
            Version 1.0.0
          </Text>
        </Stack>
      </Container>
    </Box>
  );
};

export default AdminFooter;
