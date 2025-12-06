import { 
  Container, VStack, Text, SimpleGrid, Box, Heading, 
  Button, HStack, Badge, Flex, Icon, useColorModeValue,
  Skeleton, Stack
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiTrendingUp, FiStar, FiZap, FiShoppingBag, FiFilter, 
  FiPackage, FiInbox, FiShoppingCart 
} from "react-icons/fi";
import { 
  MdOutlineSearchOff, MdOutlineInventory2, 
  MdOutlineProductionQuantityLimits 
} from "react-icons/md";
import { RiEmotionSadLine, RiShoppingBag3Line } from "react-icons/ri";
import ProductStore from "../Store/product";
import ProductCard from "../Components/ProductCard";
import SearchBar from "../Components/SearchBar";

const MotionBox = motion(Box);
const MotionText = motion(Text);

export default function HomePage() {
  const fetchProducts = ProductStore((state) => state.fetchProducts);
  const oldProduct = ProductStore((state) => state.oldProduct);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    fetchProducts().finally(() => setIsLoading(false));
  }, [fetchProducts]);

  // Filter and sort products based on search query and sort option
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...oldProduct];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-desc":
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      default:
        // Keep original order
        break;
    }

    return filtered;
  }, [oldProduct, searchQuery, sortOption]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSortOption("default");
  };

  console.log("Products:", oldProduct);

  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, purple.50, pink.50)",
    "linear(to-br, gray.900, blue.900, purple.900)"
  );
  const heroBg = useColorModeValue("white", "gray.800");
  const statsColor = useColorModeValue("gray.600", "gray.400");

  return (
    <>
      {/* Hero Section */}
      <Box
        bgGradient={bgGradient}
        position="relative"
        overflow="hidden"
        py={{ base: 16, md: 24 }}
        mb={12}
      >
        <Container maxW="container.xl">
          <VStack spacing={6} textAlign="center">
            <MotionText
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              fontSize={{ base: "4xl", md: "6xl" }}
              fontWeight="extrabold"
              bgGradient="linear(to-r, cyan.400, blue.500, purple.500)"
              bgClip="text"
              lineHeight="1.2"
            >
              Discover Amazing Products
            </MotionText>

            <MotionText
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              fontSize={{ base: "lg", md: "xl" }}
              color={statsColor}
              maxW="2xl"
            >
              Shop the latest trends with unbeatable prices and quality. 
              Your satisfaction is our priority! 🛍️
            </MotionText>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <HStack spacing={4} flexWrap="wrap" justify="center">
                <Button
                  size="lg"
                  bgGradient="linear(to-r, cyan.400, blue.500)"
                  color="white"
                  _hover={{
                    bgGradient: "linear(to-r, cyan.500, blue.600)",
                    transform: "translateY(-2px)",
                    boxShadow: "xl",
                  }}
                  transition="all 0.3s"
                  leftIcon={<FiShoppingBag />}
                  onClick={() => document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' })}
                >
                  Shop Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  borderColor="blue.400"
                  color="blue.400"
                  _hover={{
                    bg: "blue.50",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.3s"
                >
                  Learn More
                </Button>
              </HStack>
            </MotionBox>

            {/* Stats */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <HStack
                spacing={8}
                flexWrap="wrap"
                justify="center"
                mt={8}
                bg={heroBg}
                px={8}
                py={4}
                borderRadius="xl"
                boxShadow="xl"
              >
                <VStack spacing={0}>
                  <HStack>
                    <Icon as={FiShoppingBag} color="cyan.400" boxSize={5} />
                    <Heading size="md" bgGradient="linear(to-r, cyan.400, blue.500)" bgClip="text">
                      {oldProduct.length}+
                    </Heading>
                  </HStack>
                  <Text fontSize="sm" color={statsColor}>Products</Text>
                </VStack>
                
                <VStack spacing={0}>
                  <HStack>
                    <Icon as={FiStar} color="yellow.400" boxSize={5} />
                    <Heading size="md" bgGradient="linear(to-r, yellow.400, orange.500)" bgClip="text">
                      4.9/5
                    </Heading>
                  </HStack>
                  <Text fontSize="sm" color={statsColor}>Rating</Text>
                </VStack>
                
                <VStack spacing={0}>
                  <HStack>
                    <Icon as={FiTrendingUp} color="green.400" boxSize={5} />
                    <Heading size="md" bgGradient="linear(to-r, green.400, teal.500)" bgClip="text">
                      50K+
                    </Heading>
                  </HStack>
                  <Text fontSize="sm" color={statsColor}>Happy Customers</Text>
                </VStack>
                
                <VStack spacing={0}>
                  <HStack>
                    <Icon as={FiZap} color="purple.400" boxSize={5} />
                    <Heading size="md" bgGradient="linear(to-r, purple.400, pink.500)" bgClip="text">
                      Fast
                    </Heading>
                  </HStack>
                  <Text fontSize="sm" color={statsColor}>Delivery</Text>
                </VStack>
              </HStack>
            </MotionBox>
          </VStack>
        </Container>
      </Box>

      {/* Products Section */}
      <Container maxW="container.xl" py={8} id="products-section">
        <VStack spacing={8}>
          {/* Search and Filter Bar */}
          <Box w="full">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortOption={sortOption}
              setSortOption={setSortOption}
              onClearFilters={handleClearFilters}
            />
          </Box>

          {/* Results Count & Category Badges */}
          <Flex w="full" justify="space-between" align="center" flexWrap="wrap" gap={4}>
            {oldProduct.length > 0 && (
              <Text fontSize="md" fontWeight="medium" color={statsColor}>
                Showing <Badge colorScheme="cyan">{filteredAndSortedProducts.length}</Badge> of{" "}
                <Badge colorScheme="blue">{oldProduct.length}</Badge> products
              </Text>
            )}
            
            <HStack spacing={2} flexWrap="wrap">
              <Badge colorScheme="purple" px={3} py={1} borderRadius="full" cursor="pointer">
                All Categories
              </Badge>
              <Badge colorScheme="cyan" px={3} py={1} borderRadius="full" cursor="pointer" variant="outline">
                New Arrivals
              </Badge>
              <Badge colorScheme="green" px={3} py={1} borderRadius="full" cursor="pointer" variant="outline">
                Best Sellers
              </Badge>
              <Badge colorScheme="orange" px={3} py={1} borderRadius="full" cursor="pointer" variant="outline">
                On Sale
              </Badge>
            </HStack>
          </Flex>

          {/* Product Grid with Loading Skeletons */}
          {isLoading ? (
            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
              spacing={8}
              w="full"
            >
              {[...Array(8)].map((_, i) => (
                <Box key={i} borderRadius="xl" overflow="hidden" bg={heroBg} p={4}>
                  <Skeleton height="250px" borderRadius="lg" mb={4} />
                  <Stack spacing={3}>
                    <Skeleton height="20px" />
                    <Skeleton height="20px" width="60%" />
                    <Skeleton height="30px" width="40%" />
                  </Stack>
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
              spacing={8}
              w="full"
            >
              {filteredAndSortedProducts.map((product, index) => (
                <MotionBox
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </MotionBox>
              ))}
            </SimpleGrid>
          )}

          {/* Enhanced Empty State */}
          {!isLoading && filteredAndSortedProducts.length === 0 && (
            <MotionBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              w="full"
            >
              <Box
                bg={heroBg}
                p={{ base: 12, md: 16 }}
                borderRadius="3xl"
                boxShadow="2xl"
                border="2px dashed"
                borderColor={useColorModeValue("gray.300", "gray.600")}
                textAlign="center"
              >
                <VStack spacing={6}>
                  {/* Animated Icon */}
                  {/* Animated Empty State Icon */}
                  <MotionBox
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Box position="relative">
                      {/* Main Icon Container */}
                      <Box
                        bg={useColorModeValue("gray.100", "gray.700")}
                        borderRadius="full"
                        p={8}
                        boxShadow="xl"
                      >
                        <Icon 
                          as={MdOutlineInventory2} 
                          boxSize={24} 
                          color={useColorModeValue("gray.400", "gray.500")}
                        />
                      </Box>
                      
                      {/* Floating Search Icon */}
                      <MotionBox
                        position="absolute"
                        top="-2"
                        right="-2"
                        bg={useColorModeValue("blue.500", "blue.400")}
                        borderRadius="full"
                        p={3}
                        boxShadow="lg"
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Icon 
                          as={MdOutlineSearchOff} 
                          boxSize={6} 
                          color="white"
                        />
                      </MotionBox>
                      
                      {/* Sad Face Icon */}
                      <MotionBox
                        position="absolute"
                        bottom="-2"
                        left="-2"
                        bg={useColorModeValue("orange.400", "orange.500")}
                        borderRadius="full"
                        p={2}
                        boxShadow="lg"
                        animate={{
                          rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Icon 
                          as={RiEmotionSadLine} 
                          boxSize={5} 
                          color="white"
                        />
                      </MotionBox>
                    </Box>
                  </MotionBox>

                  {/* Title */}
                  <Heading 
                    size="xl" 
                    bgGradient="linear(to-r, gray.400, gray.600)" 
                    bgClip="text"
                  >
                    No Products Found
                  </Heading>

                  {/* Description */}
                  <VStack spacing={2}>
                    <Text fontSize="lg" color={statsColor} maxW="md">
                      We couldn't find any products matching your search criteria.
                    </Text>
                    <Text fontSize="md" color={statsColor}>
                      Try adjusting your search or filters to find what you're looking for.
                    </Text>
                  </VStack>

                  {/* Suggestions Box */}
                  <Box
                    bg={useColorModeValue("blue.50", "blue.900")}
                    p={6}
                    borderRadius="2xl"
                    maxW="xl"
                    w="full"
                    border="2px"
                    borderColor={useColorModeValue("blue.200", "blue.700")}
                  >
                    <HStack mb={4}>
                      <Icon 
                        as={FiInbox} 
                        boxSize={5} 
                        color={useColorModeValue("blue.600", "blue.300")}
                      />
                      <Text 
                        fontWeight="bold" 
                        color={useColorModeValue("blue.700", "blue.200")}
                        fontSize="lg"
                      >
                        Helpful Tips:
                      </Text>
                    </HStack>
                    <VStack align="start" spacing={3} fontSize="sm">
                      <HStack>
                        <Icon as={SearchIcon} color="blue.400" boxSize={4} />
                        <Text color={statsColor}>Check your spelling or try different keywords</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiFilter} color="blue.400" boxSize={4} />
                        <Text color={statsColor}>Remove some filters to broaden your search</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiZap} color="blue.400" boxSize={4} />
                        <Text>Browse all products to discover something new</Text>
                      </HStack>
                    </VStack>
                  </Box>

                  {/* Action Buttons */}
                  <HStack spacing={4} pt={4} flexWrap="wrap" justify="center">
                    <Button
                      size="lg"
                      bgGradient="linear(to-r, cyan.400, blue.500)"
                      color="white"
                      onClick={handleClearFilters}
                      leftIcon={<Icon as={FiZap} />}
                      _hover={{
                        bgGradient: "linear(to-r, cyan.500, blue.600)",
                        transform: "translateY(-2px)",
                        boxShadow: "xl",
                      }}
                      transition="all 0.3s"
                      boxShadow="lg"
                    >
                      Clear All Filters
                    </Button>
                    <Button
                      as={Link}
                      to="/create"
                      size="lg"
                      variant="outline"
                      colorScheme="cyan"
                      leftIcon={<Icon as={FiPackage} />}
                      _hover={{
                        bg: useColorModeValue("cyan.50", "cyan.900"),
                        transform: "translateY(-2px)",
                        boxShadow: "lg",
                      }}
                      transition="all 0.3s"
                      borderWidth="2px"
                    >
                      Add New Product
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            </MotionBox>
          )}
        </VStack>
      </Container>
    </>
  );
}
