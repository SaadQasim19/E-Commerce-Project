import {
  Box,
  Button,
  Heading,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  IconButton,
  useColorModeValue,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  FormControl,
  FormLabel,
  Flex,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Checkbox,
  Tooltip,
  Select,
  Skeleton,
} from "@chakra-ui/react";
import { SearchIcon, AddIcon, EditIcon, DeleteIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdMoreVert,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdInventory,
  MdAttachMoney,
  MdTrendingUp,
  MdFilterList,
} from "react-icons/md";
import { FiDownload, FiUpload, FiPackage, FiDollarSign, FiTrendingUp } from "react-icons/fi";
import { motion } from "framer-motion";
import ProductStore from "../../Store/product";

const MotionBox = motion.create(Box);
const MotionTr = motion.create(Tr);

export default function AdminProducts() {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  const { oldProduct, fetchProducts, deleteProducts, updateProducts, createProduct } = ProductStore();
  const bg = useColorModeValue("white", "gray.800");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = oldProduct.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      const result = await deleteProducts(id);
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        status: result.success ? "success" : "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setEditMode(true);
    onOpen();
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setFormData({ name: "", price: "", image: "" });
    setEditMode(false);
    onOpen();
  };

  const handleSubmit = async () => {
    if (editMode && selectedProduct) {
      // Update existing product
      const result = await updateProducts(selectedProduct._id, formData);
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        status: result.success ? "success" : "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Create new product
      const result = await createProduct(formData);
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        status: result.success ? "success" : "error",
        duration: 3000,
        isClosable: true,
      });
    }
    onClose();
    setFormData({ name: "", price: "", image: "" });
  };

  // Calculate stats
  const totalProducts = oldProduct.length;
  const totalValue = oldProduct.reduce((sum, p) => sum + parseFloat(p.price), 0);
  const avgPrice = totalProducts > 0 ? (totalValue / totalProducts).toFixed(2) : 0;

  return (
    <Box>
      {/* Stats Overview */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Box
            bg={bg}
            p={6}
            borderRadius="2xl"
            boxShadow="xl"
            borderWidth="1px"
            borderColor={useColorModeValue("gray.100", "gray.700")}
          >
            <HStack justify="space-between">
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="gray.500" fontWeight="600">
                  TOTAL PRODUCTS
                </Text>
                <Text fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, cyan.400, blue.500)" bgClip="text">
                  {totalProducts}
                </Text>
                <HStack color="green.500">
                  <Icon as={FiTrendingUp} />
                  <Text fontSize="sm" fontWeight="bold">
                    +12% from last month
                  </Text>
                </HStack>
              </VStack>
              <Box
                bgGradient="linear(to-br, cyan.400, blue.500)"
                p={4}
                borderRadius="xl"
              >
                <Icon as={FiPackage} boxSize={8} color="white" />
              </Box>
            </HStack>
          </Box>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Box
            bg={bg}
            p={6}
            borderRadius="2xl"
            boxShadow="xl"
            borderWidth="1px"
            borderColor={useColorModeValue("gray.100", "gray.700")}
          >
            <HStack justify="space-between">
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="gray.500" fontWeight="600">
                  TOTAL VALUE
                </Text>
                <Text fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, green.400, teal.500)" bgClip="text">
                  ${totalValue.toFixed(2)}
                </Text>
                <HStack color="green.500">
                  <Icon as={FiTrendingUp} />
                  <Text fontSize="sm" fontWeight="bold">
                    +8% from last month
                  </Text>
                </HStack>
              </VStack>
              <Box
                bgGradient="linear(to-br, green.400, teal.500)"
                p={4}
                borderRadius="xl"
              >
                <Icon as={FiDollarSign} boxSize={8} color="white" />
              </Box>
            </HStack>
          </Box>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Box
            bg={bg}
            p={6}
            borderRadius="2xl"
            boxShadow="xl"
            borderWidth="1px"
            borderColor={useColorModeValue("gray.100", "gray.700")}
          >
            <HStack justify="space-between">
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="gray.500" fontWeight="600">
                  AVERAGE PRICE
                </Text>
                <Text fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, purple.400, pink.500)" bgClip="text">
                  ${avgPrice}
                </Text>
                <HStack color="purple.500">
                  <Icon as={FiTrendingUp} />
                  <Text fontSize="sm" fontWeight="bold">
                    Competitive pricing
                  </Text>
                </HStack>
              </VStack>
              <Box
                bgGradient="linear(to-br, purple.400, pink.500)"
                p={4}
                borderRadius="xl"
              >
                <Icon as={MdAttachMoney} boxSize={8} color="white" />
              </Box>
            </HStack>
          </Box>
        </MotionBox>
      </SimpleGrid>

      {/* Header with Actions */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        mb={6}
      >
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
          <Box>
            <Heading size="lg" mb={1}>
              Products Inventory
            </Heading>
            <Text color="gray.500">
              Manage and organize your product catalog
            </Text>
          </Box>
          <HStack spacing={3}>
            <Button
              leftIcon={<FiDownload />}
              variant="outline"
              colorScheme="cyan"
            >
              Export
            </Button>
            <Button
              leftIcon={<AddIcon />}
              bgGradient="linear(to-r, cyan.400, blue.500)"
              color="white"
              _hover={{
                bgGradient: "linear(to-r, cyan.500, blue.600)",
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              onClick={handleAddNew}
            >
              Add Product
            </Button>
          </HStack>
        </Flex>
      </MotionBox>

      {/* Search and Filters */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        bg={bg}
        p={6}
        borderRadius="2xl"
        boxShadow="xl"
        mb={6}
        borderWidth="1px"
        borderColor={useColorModeValue("gray.100", "gray.700")}
      >
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
          <InputGroup maxW="500px" flex={1}>
            <InputLeftElement>
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search products by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="lg"
              borderRadius="xl"
              _focus={{
                boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.3)",
              }}
            />
          </InputGroup>
          <HStack spacing={3}>
            <Select size="lg" maxW="200px" borderRadius="xl">
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
            </Select>
            <Badge
              colorScheme="cyan"
              fontSize="md"
              p={3}
              borderRadius="xl"
              bgGradient="linear(to-r, cyan.50, blue.50)"
              color="cyan.600"
            >
              {filteredProducts.length} Products
            </Badge>
          </HStack>
        </Flex>
      </MotionBox>

      {/* Products Table */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        bg={bg}
        borderRadius="2xl"
        boxShadow="xl"
        borderWidth="1px"
        borderColor={useColorModeValue("gray.100", "gray.700")}
        overflow="hidden"
      >
        <Box overflowX="auto">
          <Table variant="simple" size="md">
            <Thead bg={useColorModeValue("gray.50", "gray.700")}>
              <Tr>
                <Th py={4}>
                  <Checkbox colorScheme="cyan" />
                </Th>
                <Th py={4}>Product</Th>
                <Th py={4}>Price</Th>
                <Th py={4}>Status</Th>
                <Th py={4}>Stock</Th>
                <Th py={4} textAlign="center">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredProducts.length === 0 ? (
                <Tr>
                  <Td colSpan={6} py={20}>
                    <VStack spacing={4}>
                      <Icon as={FiPackage} boxSize={16} color="gray.300" />
                      <Text fontSize="lg" color="gray.500" fontWeight="medium">
                        No products found
                      </Text>
                      <Button
                        leftIcon={<AddIcon />}
                        colorScheme="cyan"
                        onClick={handleAddNew}
                      >
                        Add Your First Product
                      </Button>
                    </VStack>
                  </Td>
                </Tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <MotionTr
                    key={product._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    _hover={{
                      bg: useColorModeValue("cyan.50", "gray.700"),
                      transform: "scale(1.01)",
                    }}
                    cursor="pointer"
                  >
                    <Td>
                      <Checkbox colorScheme="cyan" />
                    </Td>
                    <Td py={4}>
                      <HStack spacing={4}>
                        <Avatar
                          src={product.image}
                          name={product.name}
                          size="lg"
                          borderRadius="xl"
                          border="2px"
                          borderColor={useColorModeValue("gray.100", "gray.600")}
                        />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="bold" fontSize="md">
                            {product.name}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            ID: {product._id.slice(-8).toUpperCase()}
                          </Text>
                        </VStack>
                      </HStack>
                    </Td>
                    <Td>
                      <Text fontWeight="bold" fontSize="lg" color="green.500">
                        ${product.price}
                      </Text>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme="green"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="xs"
                      >
                        Active
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Badge
                          colorScheme={Math.random() > 0.5 ? "green" : "orange"}
                          px={3}
                          py={1}
                          borderRadius="full"
                        >
                          {Math.floor(Math.random() * 100 + 10)} units
                        </Badge>
                      </HStack>
                    </Td>
                    <Td>
                      <HStack justify="center" spacing={2}>
                        <Tooltip label="View Product" placement="top">
                          <IconButton
                            icon={<MdVisibility />}
                            size="sm"
                            colorScheme="cyan"
                            variant="ghost"
                            onClick={() => navigate(`/products/${product._id}`)}
                            aria-label="View product"
                          />
                        </Tooltip>
                        <Tooltip label="Edit Product" placement="top">
                          <IconButton
                            icon={<MdEdit />}
                            size="sm"
                            colorScheme="blue"
                            variant="ghost"
                            onClick={() => handleEdit(product)}
                            aria-label="Edit product"
                          />
                        </Tooltip>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<MdMoreVert />}
                            size="sm"
                            variant="ghost"
                            aria-label="More actions"
                          />
                          <MenuList>
                            <MenuItem icon={<MdEdit />}>Duplicate</MenuItem>
                            <MenuItem icon={<FiDownload />}>Export</MenuItem>
                            <MenuItem icon={<MdDelete />} color="red.500" onClick={() => handleDelete(product._id, product.name)}>
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </HStack>
                    </Td>
                  </MotionTr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>
      </MotionBox>

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editMode ? "Edit Product" : "Add New Product"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Product Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter product name"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Price</FormLabel>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="Enter price"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Image URL</FormLabel>
                <Input
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="Enter image URL"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              {editMode ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
