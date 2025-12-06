import {
  Box,
  Container,
  SimpleGrid,
  Text,
  Link,
  VStack,
  HStack,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaGithub,
} from 'react-icons/fa';
import { FiShoppingBag } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      bg={bgColor}
      borderTop="1px"
      borderColor={borderColor}
      mt={20}
    >
      <Container maxW="container.xl" py={8}>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
          {/* Brand */}
          <VStack align="start" spacing={3}>
            <HStack spacing={2}>
              <FiShoppingBag size={24} color="#4299E1" />
              <Text
                fontSize="xl"
                fontWeight="bold"
                bgGradient="linear(to-r, cyan.400, blue.500)"
                bgClip="text"
              >
                ShopHub
              </Text>
            </HStack>
            <Text fontSize="sm" color={textColor}>
              Quality products at unbeatable prices.
            </Text>
            <HStack spacing={2} pt={2}>
              <IconButton
                as="a"
                href="#"
                aria-label="Facebook"
                icon={<FaFacebook />}
                size="sm"
                variant="ghost"
                colorScheme="blue"
              />
              <IconButton
                as="a"
                href="#"
                aria-label="Twitter"
                icon={<FaTwitter />}
                size="sm"
                variant="ghost"
                colorScheme="twitter"
              />
              <IconButton
                as="a"
                href="#"
                aria-label="https://www.instagram.com/sado0zii_19"
                icon={<FaInstagram />}
                size="sm"
                variant="ghost"
                colorScheme="pink"
              />
              <IconButton
                as="a"
                href="https://github.com/SaadQasim19"
                aria-label="GitHub"
                icon={<FaGithub />}
                size="sm"
                variant="ghost"
                colorScheme="gray"
              />
            </HStack>
          </VStack>

          {/* Quick Links */}
          <VStack align="start" spacing={2}>
            <Text fontSize="sm" fontWeight="bold" mb={1}>
              Shop
            </Text>
            <Link as={RouterLink} to="/" fontSize="sm" color={textColor} _hover={{ color: 'cyan.500' }}>
              Home
            </Link>
            <Link as={RouterLink} to="/create" fontSize="sm" color={textColor} _hover={{ color: 'cyan.500' }}>
              Add Product
            </Link>
            <Link as={RouterLink} to="/checkout" fontSize="sm" color={textColor} _hover={{ color: 'cyan.500' }}>
              Checkout
            </Link>
            <Link as={RouterLink} to="/admin" fontSize="sm" color={textColor} _hover={{ color: 'cyan.500' }}>
              Admin
            </Link>
          </VStack>

          {/* Support */}
          <VStack align="start" spacing={2}>
            <Text fontSize="sm" fontWeight="bold" mb={1}>
              Support
            </Text>
            <Link as={RouterLink} to="/contact" fontSize="sm" color={textColor} _hover={{ color: 'cyan.500' }}>
              Contact
            </Link>
            <Link as={RouterLink} to="/track-order" fontSize="sm" color={textColor} _hover={{ color: 'cyan.500' }}>
              Track Order
            </Link>
            <Link as={RouterLink} to="/shipping-info" fontSize="sm" color={textColor} _hover={{ color: 'cyan.500' }}>
              Shipping
            </Link>
            <Link as={RouterLink} to="/faqs" fontSize="sm" color={textColor} _hover={{ color: 'cyan.500' }}>
              FAQs
            </Link>
          </VStack>

          {/* Company */}
          <VStack align="start" spacing={2}>
            <Text fontSize="sm" fontWeight="bold" mb={1}>
              Company
            </Text>
            <Link as={RouterLink} to="/about" fontSize="sm" color={textColor} _hover={{ color: 'cyan.500' }}>
              About
            </Link>
            <Link as={RouterLink} to="/careers" fontSize="sm" color={textColor} _hover={{ color: 'cyan.500' }}>
              Careers
            </Link>
            <Link as={RouterLink} to="/blog" fontSize="sm" color={textColor} _hover={{ color: 'cyan.500' }}>
              Blog
            </Link>
            <Link as={RouterLink} to="/privacy-policy" fontSize="sm" color={textColor} _hover={{ color: 'cyan.500' }}>
              Privacy
            </Link>
          </VStack>
        </SimpleGrid>

        {/* Bottom */}
        <Box mt={8} pt={6} borderTop="1px" borderColor={borderColor}>
          <HStack justify="space-between" flexWrap="wrap" spacing={4}>
            <Text fontSize="sm" color={textColor}>
              © {new Date().getFullYear()} ShopHub. All rights reserved.
            </Text>
            <Text fontSize="sm" color={textColor}>
              Developer: Sado0zii
            </Text>
          </HStack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
