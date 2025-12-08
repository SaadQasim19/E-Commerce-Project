import {
  Container,
  useColorModeValue,
  VStack,
  Heading,
  Box,
  Input,
  Button,
  useToast,
  FormControl,
  FormLabel,
  FormHelperText,
  InputGroup,
  InputLeftAddon,
  Textarea,
  Select,
  HStack,
  Image,
  Text,
  Icon,
  Stack,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiImage, FiDollarSign, FiPackage, FiTag, FiUpload } from "react-icons/fi";
import ProductStore from "../Store/product";

const MotionBox = motion(Box);

export default function CreatePage() {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    description: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createProduct = ProductStore((state) => state.createProduct); 
  const toast = useToast(); 

  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, purple.50)",
    "linear(to-br, gray.900, blue.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleImageChange = (e) => {
    const url = e.target.value;
    setNewProduct({ ...newProduct, image: url });
    setImagePreview(url);
  };

  const handleNewProduct = async () => {
    // Validation
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    console.log("New Product Created", newProduct);
    const result = await createProduct(newProduct); 
    console.log(`Result:`, result); 

    if (result.success) {
      toast({
        title: "Product Created Successfully!",
        description: result.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Reset form
      setNewProduct({ name: "", price: "", image: "", category: "", description: "" });
      setImagePreview("");
    } else {
      toast({
        title: "Error",
        description: result.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Box bgGradient={bgGradient} minH="100vh" py={12}>
      <Container maxW="container.lg">
        <VStack spacing={8}>
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            textAlign="center"
          >
            <Heading 
              as="h1" 
              size="2xl" 
              mb={2}
              bgGradient="linear(to-r, cyan.400, blue.500, purple.500)"
              bgClip="text"
            >
              Create New Product
            </Heading>
            <Text color="gray.500">
              Add your product details below
            </Text>
          </MotionBox>

          {/* Form Container */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            w="full"
          >
            <Stack direction={{ base: "column", lg: "row" }} spacing={8}>
              {/* Left Column - Form */}
              <Box
                flex={1}
                bg={cardBg}
                p={8}
                borderRadius="2xl"
                boxShadow="2xl"
                border="1px"
                borderColor={borderColor}
              >
                <VStack spacing={6}>
                  {/* Product Name */}
                  <FormControl isRequired>
                    <FormLabel fontWeight="bold">
                      <HStack>
                        <Icon as={FiPackage} color="cyan.400" />
                        <Text>Product Name</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      placeholder="e.g., Wireless Headphones"
                      name="name"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      size="lg"
                      focusBorderColor="cyan.400"
                    />
                    <FormHelperText>Enter a descriptive product name</FormHelperText>
                  </FormControl>

                  {/* Category */}
                  <FormControl>
                    <FormLabel fontWeight="bold">
                      <HStack>
                        <Icon as={FiTag} color="purple.400" />
                        <Text>Category</Text>
                      </HStack>
                    </FormLabel>
                    <Select
                      placeholder="Select category"
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, category: e.target.value })
                      }
                      size="lg"
                      focusBorderColor="purple.400"
                    >
                      <option value="electronics">Electronics</option>
                      <option value="clothing">Clothing</option>
                      <option value="books">Books</option>
                      <option value="home">Home & Garden</option>
                      <option value="sports">Sports</option>
                      <option value="toys">Toys</option>
                    </Select>
                  </FormControl>

                  {/* Price */}
                  <FormControl isRequired>
                    <FormLabel fontWeight="bold">
                      <HStack>
                        <Icon as={FiDollarSign} color="green.400" />
                        <Text>Price</Text>
                      </HStack>
                    </FormLabel>
                    <InputGroup size="lg">
                      <InputLeftAddon>$</InputLeftAddon>
                      <Input
                        placeholder="0.00"
                        type="number"
                        name="price"
                        value={newProduct.price}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, price: e.target.value })
                        }
                        focusBorderColor="green.400"
                      />
                    </InputGroup>
                  </FormControl>

                  {/* Image URL */}
                  <FormControl isRequired>
                    <FormLabel fontWeight="bold">
                      <HStack>
                        <Icon as={FiImage} color="blue.400" />
                        <Text>Image URL</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      name="image"
                      value={newProduct.image}
                      onChange={handleImageChange}
                      size="lg"
                      focusBorderColor="blue.400"
                    />
                    <FormHelperText>Paste a valid image URL</FormHelperText>
                  </FormControl>

                  {/* Description */}
                  <FormControl>
                    <FormLabel fontWeight="bold">Description</FormLabel>
                    <Textarea
                      placeholder="Enter product description..."
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, description: e.target.value })
                      }
                      rows={4}
                      focusBorderColor="cyan.400"
                    />
                  </FormControl>

                  <Divider />

                  {/* Submit Button */}
                  <Button
                    leftIcon={<FiUpload />}
                    bgGradient="linear(to-r, cyan.400, blue.500)"
                    color="white"
                    size="lg"
                    w="full"
                    onClick={handleNewProduct}
                    isLoading={isSubmitting}
                    loadingText="Creating..."
                    _hover={{
                      bgGradient: "linear(to-r, cyan.500, blue.600)",
                      transform: "translateY(-2px)",
                      boxShadow: "xl",
                    }}
                    transition="all 0.3s"
                  >
                    Create Product
                  </Button>
                </VStack>
              </Box>

              {/* Right Column - Preview */}
              <Box
                flex={1}
                bg={cardBg}
                p={8}
                borderRadius="2xl"
                boxShadow="2xl"
                border="1px"
                borderColor={borderColor}
              >
                <VStack spacing={4} align="stretch">
                  <Heading size="md" mb={2}>
                    Preview
                  </Heading>
                  
                  {imagePreview ? (
                    <Box
                      borderRadius="xl"
                      overflow="hidden"
                      border="2px"
                      borderColor="cyan.400"
                      boxShadow="lg"
                    >
                      <Image
                        src={imagePreview}
                        alt="Product Preview"
                        w="full"
                        h="300px"
                        objectFit="cover"
                        fallbackSrc="https://via.placeholder.com/400x300?text=Invalid+Image+URL"
                      />
                    </Box>
                  ) : (
                    <Box
                      borderRadius="xl"
                      border="2px solid"
                      borderColor="gray.300"
                      h="300px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexDirection="column"
                      gap={2}
                      bg={useColorModeValue("gray.50", "gray.700")}
                    >
                      <Icon as={FiImage} boxSize={12} color="gray.400" />
                      <Text color="gray.500">Image preview will appear here</Text>
                    </Box>
                  )}

                  {/* Product Details Preview */}
                  <VStack align="stretch" spacing={3} mt={4}>
                    {newProduct.category && (
                      <HStack>
                        <Badge colorScheme="purple" px={3} py={1} borderRadius="md">
                          {newProduct.category}
                        </Badge>
                      </HStack>
                    )}
                    
                    <Heading size="md" noOfLines={2}>
                      {newProduct.name || "Product Name"}
                    </Heading>
                    
                    {newProduct.description && (
                      <Text color="gray.500" fontSize="sm" noOfLines={3}>
                        {newProduct.description}
                      </Text>
                    )}
                    
                    <Text fontSize="2xl" fontWeight="bold" color="cyan.500">
                      ${newProduct.price || "0.00"}
                    </Text>
                  </VStack>
                </VStack>
              </Box>
            </Stack>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
}
