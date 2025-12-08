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
  const { oldProduct, fetchCombinedProducts, fetchExternalCategories, searchExternalProducts } = ProductStore();
  const [isLoading, setIsLoading] = useState(true);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [category, setCategory] = useState("shirts"); // default to shirts
  const [categories, setCategories] = useState([]);
  const [includeExternal, setIncludeExternal] = useState(true);
  const [searchResults, setSearchResults] = useState(null); // override list when searching
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [filterType, setFilterType] = useState("all"); // all, new, bestseller, sale

  // Handle filter type changes
  const handleFilterChange = async (type) => {
    setFilterType(type);
    setIsLoading(true);
    
    try {
      if (type === "all") {
        // Show current category
        await fetchCombinedProducts(category || '', includeExternal, 100);
      } else {
        // For special filters (new, bestseller, sale), fetch ALL products
        await fetchCombinedProducts('', includeExternal, 200);
      }
      setLastUpdatedAt(new Date());
    } catch (err) {
      console.error('Filter change error', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load categories and initial products (default to shirts)
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setIsLoading(true);
      try {
        // Fetch categories from external APIs and set default (normalize)
        const catResp = await fetchExternalCategories('all');
        if (mounted && catResp.success) {
          const raw = catResp.categories || [];
          const normalized = raw.map(item => {
            if (typeof item === 'string') return item;
            if (item && item.slug) return item.slug;
            if (item && item.name) return item.name.toLowerCase();
            return String(item);
          });
          setCategories(normalized);
          // prefer 'mens-shirts' or 'shirts' or 'tops' or 'clothes'
          let chosen = null;
          if (normalized.includes('mens-shirts')) chosen = 'mens-shirts';
          else if (normalized.includes('shirts')) chosen = 'shirts';
          else if (normalized.includes('tops')) chosen = 'tops';
          else if (normalized.includes('clothes')) chosen = 'clothes';
          else if (normalized.length > 0) chosen = normalized[0];
          if (chosen) setCategory(chosen);
          // fetch using chosen category
          await fetchCombinedProducts(chosen || 'shirts', includeExternal, 100);
          setLastUpdatedAt(new Date());
          // we already fetched, skip the later fetch
          return;
        }

        // Fetch combined products for initial category
        await fetchCombinedProducts(category || 'shirts', includeExternal, 100);
        setLastUpdatedAt(new Date());
      } catch (err) {
        console.error('Init load error', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    init();

    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCombinedProducts]);

  // Poll for realtime updates (every 30s)
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        await fetchCombinedProducts(category || '', includeExternal, 100);
        setLastUpdatedAt(new Date());
      } catch (e) {
        console.error('Polling fetch error', e);
      }
    }, 30000);

    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCombinedProducts, category, includeExternal]);

  // Filter and sort products based on search query and sort option
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...oldProduct];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filter type
    switch (filterType) {
      case "new":
        // New arrivals - products created in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filtered = filtered.filter((product) => {
          const createdAt = product.createdAt ? new Date(product.createdAt) : new Date();
          return createdAt >= thirtyDaysAgo;
        });
        // Sort by newest first
        filtered.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB - dateA;
        });
        break;
      case "bestseller":
        // Best sellers - sort by rating or popularity (using rating if available)
        filtered.sort((a, b) => {
          const ratingA = a.rating?.rate || a.rating || 0;
          const ratingB = b.rating?.rate || b.rating || 0;
          return ratingB - ratingA;
        });
        break;
      case "sale":
        // On sale - products with discount
        filtered = filtered.filter((product) => 
          product.discount && product.discount > 0
        );
        // Sort by discount percentage (highest first)
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default:
        // "all" - no special filter
        break;
    }

    // Apply sorting (if not overridden by filter type)
    if (filterType === "all") {
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
    }

    return filtered;
  }, [oldProduct, searchQuery, sortOption, filterType]);

  // When user types a search (length >=3) query external APIs for results
  useEffect(() => {
    let mounted = true;
    const doSearch = async () => {
      if (!searchQuery || searchQuery.trim().length < 3) {
        setSearchResults(null);
        return;
      }

      try {
        const resp = await searchExternalProducts(searchQuery, 60);
        if (mounted && resp.success) {
          // merge manual filtered matches too
          const manualMatches = oldProduct.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
          // Use external results first, then manual unique
          const combined = [...resp.products];
          manualMatches.forEach(m => {
            if (!combined.find(c => c._id === m._id || (c.externalId && c.externalId === m.externalId))) {
              combined.push(m);
            }
          });
          setSearchResults(combined);
        }
      } catch (err) {
        console.error('Search error', err);
      }
    };

    const t = setTimeout(doSearch, 300); // debounce
    return () => { mounted = false; clearTimeout(t); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Decide which list to render: searchResults override or filteredAndSortedProducts
  const productsToRender = searchResults !== null ? searchResults : filteredAndSortedProducts;

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

            {/* Category selector & real-time toggle */}
            <HStack mt={4} spacing={3} align="center">
              <Box>
                <Text fontSize="sm" color={statsColor} mb={1} fontWeight="600">Category</Text>
                <select
                  value={category}
                  onChange={async (e) => {
                    const val = e.target.value;
                    setCategory(val);
                    setFilterType("all"); // Reset to "all" when category changes
                    setIsLoading(true);
                    await fetchCombinedProducts(val, includeExternal, 100);
                    setLastUpdatedAt(new Date());
                    setIsLoading(false);
                  }}
                  style={{
                    height: 44,
                    borderRadius: 12,
                    padding: '6px 12px',
                    border: '1px solid #E2E8F0',
                    background: useColorModeValue('#fff','#1A202C')
                  }}
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Box>

              <Box>
                <Text fontSize="sm" color={statsColor} mb={1} fontWeight="600">Include API</Text>
                <Button size="sm" onClick={async () => {
                  setIncludeExternal(!includeExternal);
                  setIsLoading(true);
                  await fetchCombinedProducts(category || '', !includeExternal, 100);
                  setLastUpdatedAt(new Date());
                  setIsLoading(false);
                }}>
                  {includeExternal ? 'API: On' : 'API: Off'}
                </Button>
              </Box>

              <Box ml="auto">
                <Text fontSize="sm" color={statsColor} mb={1} fontWeight="600">Updated</Text>
                <Text fontSize="xs" color="gray.500">{lastUpdatedAt ? new Date(lastUpdatedAt).toLocaleTimeString() : '—'}</Text>
              </Box>
            </HStack>
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
              <Badge 
                colorScheme="purple" 
                px={3} 
                py={1} 
                borderRadius="full" 
                cursor="pointer"
                variant={filterType === "all" ? "solid" : "outline"}
                onClick={() => handleFilterChange("all")}
                _hover={{ transform: "scale(1.05)", shadow: "md" }}
                transition="all 0.2s"
              >
                All Categories
              </Badge>
              <Badge 
                colorScheme="cyan" 
                px={3} 
                py={1} 
                borderRadius="full" 
                cursor="pointer" 
                variant={filterType === "new" ? "solid" : "outline"}
                onClick={() => handleFilterChange("new")}
                _hover={{ transform: "scale(1.05)", shadow: "md" }}
                transition="all 0.2s"
              >
                New Arrivals
              </Badge>
              <Badge 
                colorScheme="green" 
                px={3} 
                py={1} 
                borderRadius="full" 
                cursor="pointer" 
                variant={filterType === "bestseller" ? "solid" : "outline"}
                onClick={() => handleFilterChange("bestseller")}
                _hover={{ transform: "scale(1.05)", shadow: "md" }}
                transition="all 0.2s"
              >
                Best Sellers
              </Badge>
              <Badge 
                colorScheme="orange" 
                px={3} 
                py={1} 
                borderRadius="full" 
                cursor="pointer" 
                variant={filterType === "sale" ? "solid" : "outline"}
                onClick={() => handleFilterChange("sale")}
                _hover={{ transform: "scale(1.05)", shadow: "md" }}
                transition="all 0.2s"
              >
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
              {productsToRender.map((product, index) => (
                <MotionBox
                  key={product._id || product.externalId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </MotionBox>
              ))}
            </SimpleGrid>
          )}

          {/* Empty State - Clean & Professional */}
          {!isLoading && filteredAndSortedProducts.length === 0 && (
            <Box
              w="full"
              py={20}
              textAlign="center"
            >
              <VStack spacing={6}>
                {/* Title */}
                <Heading size="lg" color={useColorModeValue("gray.700", "gray.300")}>
                  No Products Found
                </Heading>

                {/* Description */}
                <Text fontSize="md" color={statsColor} maxW="md">
                  We couldn't find any products matching your search criteria. 
                  Try adjusting your filters or browse all products.
                </Text>

                {/* Action Buttons */}
                <HStack spacing={4} pt={4}>
                  <Button
                    size="md"
                    colorScheme="blue"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </Button>
                  <Button
                    as={Link}
                    to="/create"
                    size="md"
                    variant="outline"
                    colorScheme="blue"
                    leftIcon={<Icon as={FiPackage} />}
                  >
                    Add New Product
                  </Button>
                </HStack>
              </VStack>
            </Box>
          )}
        </VStack>
      </Container>
    </>
  );
}
