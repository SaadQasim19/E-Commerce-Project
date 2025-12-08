import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
  useColorModeValue,
  IconButton,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { FiTrendingUp, FiDollarSign, FiAlignLeft } from "react-icons/fi";

const SearchBar = ({ searchQuery, setSearchQuery, sortOption, setSortOption, onClearFilters }) => {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const activeBg = useColorModeValue("blue.50", "blue.900");
  const searchBg = useColorModeValue("gray.50", "gray.700");

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
    <Box>
      <Box
        bg={bg}
        p={{ base: 4, md: 5 }}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Flex
          gap={3}
          direction={{ base: "column", md: "row" }}
          align="center"
        >
            {/* Search Input */}
            <InputGroup size="lg" flex={1}>
              <InputLeftElement h="full">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg={searchBg}
                borderRadius="lg"
                fontSize="md"
                h="56px"
                pl="10"
                pr={searchQuery ? "10" : "4"}
                borderWidth="1px"
                borderColor={borderColor}
                _hover={{
                  borderColor: useColorModeValue("gray.300", "gray.600"),
                }}
                _focus={{
                  borderColor: useColorModeValue("blue.500", "blue.400"),
                  boxShadow: "0 0 0 1px " + useColorModeValue("#3182CE", "#63B3ED"),
                }}
              />
              {searchQuery && (
                <InputRightElement h="full">
                  <IconButton
                    icon={<CloseIcon />}
                    size="xs"
                    variant="ghost"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  />
                </InputRightElement>
              )}
            </InputGroup>

            {/* Sort Dropdown - Clean Design */}
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                size="lg"
                h="56px"
                minW={{ base: "full", md: "200px" }}
                bg={searchBg}
                borderRadius="lg"
                fontWeight="500"
                fontSize="md"
                _hover={{ 
                  bg: hoverBg,
                  borderColor: useColorModeValue("gray.300", "gray.600"),
                }}
                transition="all 0.2s"
                borderWidth="1px"
                borderColor={borderColor}
              >
                {getCurrentSortLabel()}
              </MenuButton>
              <MenuList 
                borderRadius="lg" 
                shadow="lg"
                borderWidth="1px"
                borderColor={borderColor}
                minW="200px"
              >
                {sortOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    onClick={() => setSortOption(option.value)}
                    fontWeight={sortOption === option.value ? "600" : "normal"}
                    bg={sortOption === option.value ? activeBg : "transparent"}
                    _hover={{ bg: hoverBg }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            {/* Clear All Button */}
            {(searchQuery || sortOption !== "default") && (
              <Button
                size="lg"
                h="56px"
                variant="ghost"
                onClick={onClearFilters}
                aria-label="Clear filters"
              >
                Clear
              </Button>
            )}
        </Flex>
      </Box>
    </Box>
  );
};

export default SearchBar;
