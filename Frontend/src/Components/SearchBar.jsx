import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  HStack,
  Button,
  useColorModeValue,
  Text,
  VStack,
  IconButton,
  Flex,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Icon,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { 
  FiFilter, FiX, FiTrendingUp, FiDollarSign, 
  FiAlignLeft, FiCheckCircle 
} from "react-icons/fi";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);

const SearchBar = ({ searchQuery, setSearchQuery, sortOption, setSortOption, onClearFilters }) => {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const activeBg = useColorModeValue("cyan.50", "cyan.900");
  const searchBg = useColorModeValue("gray.50", "gray.700");
  const isMobile = useBreakpointValue({ base: true, md: false });

  const sortOptions = [
    { value: "default", label: "Default Order", icon: FiAlignLeft },
    { value: "name-asc", label: "Name: A to Z", icon: FiTrendingUp },
    { value: "name-desc", label: "Name: Z to A", icon: FiTrendingUp },
    { value: "price-asc", label: "Price: Low to High", icon: FiDollarSign },
    { value: "price-desc", label: "Price: High to Low", icon: FiDollarSign },
  ];

  const getCurrentSortLabel = () => {
    return sortOptions.find(opt => opt.value === sortOption)?.label || "Default Order";
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        bg={bg}
        p={{ base: 4, md: 6 }}
        borderRadius="2xl"
        borderWidth="1px"
        borderColor={borderColor}
        shadow="xl"
        position="relative"
        overflow="hidden"
      >
        {/* Gradient Background Accent */}
        <Box
          position="absolute"
          top={-10}
          right={-10}
          w="200px"
          h="200px"
          bgGradient="linear(to-br, cyan.400, blue.500)"
          opacity={0.05}
          borderRadius="full"
          filter="blur(60px)"
        />

        <VStack spacing={5} align="stretch" position="relative">
          {/* Search Input with Modern Design */}
          <MotionFlex
            gap={3}
            direction={{ base: "column", md: "row" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Enhanced Search Input */}
            <InputGroup size="lg" flex={1}>
              <InputLeftElement h="full" pl={2}>
                <Icon as={SearchIcon} color="cyan.500" boxSize={5} />
              </InputLeftElement>
              <Input
                placeholder="Search products by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg={searchBg}
                border="2px solid transparent"
                borderRadius="xl"
                fontSize="md"
                fontWeight="medium"
                h="56px"
                pl="12"
                pr={searchQuery ? "12" : "4"}
                _hover={{
                  bg: useColorModeValue("white", "gray.700"),
                  borderColor: "cyan.300",
                }}
                _focus={{
                  bg: useColorModeValue("white", "gray.700"),
                  borderColor: "cyan.500",
                  boxShadow: "0 0 0 3px rgba(6, 182, 212, 0.1)",
                }}
                _placeholder={{
                  color: useColorModeValue("gray.400", "gray.500"),
                }}
                transition="all 0.3s"
              />
              {searchQuery && (
                <InputRightElement h="full" pr={2}>
                  <IconButton
                    icon={<FiX />}
                    size="sm"
                    borderRadius="full"
                    variant="ghost"
                    colorScheme="gray"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    _hover={{ bg: "red.100", color: "red.500" }}
                  />
                </InputRightElement>
              )}
            </InputGroup>

            {/* Modern Sort Menu */}
            <Menu>
              <Tooltip label="Sort products" placement="top">
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  leftIcon={<Icon as={FiFilter} />}
                  size="lg"
                  h="56px"
                  minW={{ base: "full", md: "250px" }}
                  bg={sortOption !== "default" ? activeBg : searchBg}
                  borderRadius="xl"
                  fontWeight="600"
                  _hover={{ 
                    bg: useColorModeValue("cyan.50", "cyan.900"),
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  _active={{
                    transform: "translateY(0)",
                  }}
                  transition="all 0.2s"
                  border="2px solid transparent"
                  _focus={{
                    borderColor: "cyan.500",
                  }}
                >
                  <Flex align="center" justify="space-between" w="full">
                    <Text isTruncated>{getCurrentSortLabel()}</Text>
                    {sortOption !== "default" && (
                      <Badge ml={2} colorScheme="cyan" borderRadius="full">
                        Active
                      </Badge>
                    )}
                  </Flex>
                </MenuButton>
              </Tooltip>
              <MenuList 
                borderRadius="xl" 
                shadow="2xl"
                p={2}
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Text 
                  fontSize="xs" 
                  fontWeight="bold" 
                  color="gray.500" 
                  px={3} 
                  py={2}
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Sort By
                </Text>
                {sortOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    onClick={() => setSortOption(option.value)}
                    icon={<Icon as={option.icon} boxSize={4} />}
                    borderRadius="lg"
                    bg={sortOption === option.value ? activeBg : "transparent"}
                    fontWeight={sortOption === option.value ? "bold" : "medium"}
                    color={sortOption === option.value ? "cyan.600" : "inherit"}
                    _hover={{ bg: hoverBg }}
                    mb={1}
                  >
                    <Flex justify="space-between" align="center" w="full">
                      <Text>{option.label}</Text>
                      {sortOption === option.value && (
                        <Icon as={FiCheckCircle} color="cyan.500" boxSize={4} />
                      )}
                    </Flex>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            {/* Clear All Filters Button */}
            {(searchQuery || sortOption !== "default") && (
              <Tooltip label="Clear all filters" placement="top">
                <IconButton
                  icon={<FiX />}
                  size="lg"
                  h="56px"
                  colorScheme="red"
                  variant="outline"
                  borderRadius="xl"
                  onClick={onClearFilters}
                  aria-label="Clear all filters"
                  _hover={{
                    bg: "red.50",
                    transform: "rotate(90deg)",
                  }}
                  transition="all 0.3s"
                />
              </Tooltip>
            )}
          </MotionFlex>

          {/* Active Filters Display */}
          {(searchQuery || sortOption !== "default") && (
            <MotionBox
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Flex 
                gap={3} 
                flexWrap="wrap" 
                align="center"
                p={4}
                bg={useColorModeValue("blue.50", "blue.900")}
                borderRadius="xl"
                border="1px dashed"
                borderColor={useColorModeValue("blue.200", "blue.700")}
              >
                <HStack>
                  <Icon as={FiFilter} color="blue.500" boxSize={4} />
                  <Text 
                    fontSize="sm" 
                    fontWeight="bold" 
                    color={useColorModeValue("blue.700", "blue.200")}
                  >
                    Active Filters:
                  </Text>
                </HStack>
                
                {searchQuery && (
                  <Badge
                    colorScheme="cyan"
                    px={4}
                    py={2}
                    borderRadius="full"
                    fontSize="sm"
                    fontWeight="600"
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <SearchIcon boxSize={3} />
                    Search: "{searchQuery}"
                  </Badge>
                )}
                
                {sortOption !== "default" && (
                  <Badge
                    colorScheme="purple"
                    px={4}
                    py={2}
                    borderRadius="full"
                    fontSize="sm"
                    fontWeight="600"
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Icon as={FiTrendingUp} boxSize={3} />
                    Sort: {getCurrentSortLabel()}
                  </Badge>
                )}
              </Flex>
            </MotionBox>
          )}
        </VStack>
      </Box>
    </MotionBox>
  );
};

export default SearchBar;
