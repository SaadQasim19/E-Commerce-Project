import React, { useState, useEffect } from "react";
import {
  Box, Image, Button, Heading, Text, Input, HStack, VStack, IconButton,
  useColorModeValue, useToast, Modal, ModalHeader, ModalBody,
  ModalOverlay, ModalContent, ModalCloseButton, ModalFooter, useDisclosure,
  Badge, Tooltip, Icon, ScaleFade
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FiShoppingCart, FiEye, FiHeart, FiTag } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProductStore from "../Store/product";
import useCartStore from "../Store/cart";
import StarRating from "./StarRating";

const MotionBox = motion(Box);

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [updateProduct, setUpdateProduct] = useState(product);
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, count: 0 });
  const textColor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.800");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Get both the functions and the products array
  const { deleteProducts, updateProducts, oldProduct } = ProductStore();
  
  // Get cart functions
  const { addToCart, isInCart } = useCartStore();

  // Fetch review stats for this product
  useEffect(() => {
    fetchReviewStats();
  }, [product._id]);

  const fetchReviewStats = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/reviews/product/${product._id}`
      );
      const data = await response.json();
      if (data.success) {
        setReviewStats({
          averageRating: parseFloat(data.averageRating),
          count: data.count,
        });
      }
    } catch (error) {
      console.error('Error fetching review stats:', error);
    }
  };

  // Sync local state with product prop changes
  useEffect(() => {
    setUpdateProduct(product);
  }, [product]);

  const handleDeleteProduct = async () => {
    try {
      // Show loading state
      const loadingToast = toast({
        title: "Deleting...",
        description: "Please wait",
        status: "loading",
        duration: null,
        isClosable: false,
      });

      const { success, message } = await deleteProducts(product._id);
      
      // Close loading toast
      toast.close(loadingToast);

      if (success) {
        toast({
          title: "Success",
          description: message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateProduct = async (id, updatedProduct) => {
    try {
      // Show loading state
      const loadingToast = toast({
        title: "Updating...",
        description: "Please wait",
        status: "loading",
        duration: null,
        isClosable: false,
      });

      const response = await updateProducts(id, updatedProduct);
      
      // Close loading toast
      toast.close(loadingToast);

      if (response.success) {
        toast({
          title: "Success",
          description: "Product updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        
        // Force update local state with the latest data
        const updatedProductFromStore = oldProduct.find(p => p._id === id);
        if (updatedProductFromStore) {
          setUpdateProduct(updatedProductFromStore);
        }
      } else {
        toast({
          title: "Error",
          description: response.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleModalOpen = () => {
    // Reset form data to current product data when opening modal
    setUpdateProduct({
      name: product.name,
      price: product.price,
      image: product.image
    });
    onOpen();
  };

  const handleAddToCart = () => {
    const result = addToCart(product);
    toast({
      title: result.success ? "Success" : "Error",
      description: result.message,
      status: result.success ? "success" : "error",
      duration: 2000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  const [isHovered, setIsHovered] = useState(false);
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const priceColor = useColorModeValue("blue.600", "cyan.300");
  const discountBg = useColorModeValue("red.500", "red.400");

  // Random badges for demo (you can make this dynamic based on product data)
  const isNew = Math.random() > 0.7;
  const discount = Math.random() > 0.6 ? Math.floor(Math.random() * 30 + 10) : null;

  return (
    <>
    <MotionBox
      position="relative"
      borderRadius="2xl"
      overflow="hidden"
      bg={cardBg}
      border="1px"
      borderColor={borderColor}
      transition="all 0.4s ease"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        y: -8,
        boxShadow: useColorModeValue(
          "0 20px 40px rgba(0, 0, 0, 0.1)",
          "0 20px 40px rgba(0, 0, 0, 0.4)"
        )
      }}
      _hover={{
        borderColor: "cyan.400",
      }}
    >
      {/* Image Container with Overlay */}
      <Box position="relative" overflow="hidden" h={56}>
        {/* Badges */}
        <Box position="absolute" top={3} left={3} zIndex={2}>
          <VStack align="flex-start" spacing={2}>
            {isNew && (
              <Badge
                colorScheme="green"
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="md"
                fontWeight="bold"
                boxShadow="md"
              >
                NEW
              </Badge>
            )}
            {discount && (
              <Badge
                bg={discountBg}
                color="white"
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="md"
                fontWeight="bold"
                boxShadow="md"
              >
                -{discount}%
              </Badge>
            )}
          </VStack>
        </Box>

        {/* Favorite Icon */}
        <Box position="absolute" top={3} right={3} zIndex={2}>
          <Tooltip label="Add to Wishlist" placement="left">
            <IconButton
              icon={<FiHeart />}
              size="sm"
              colorScheme="pink"
              variant="solid"
              borderRadius="full"
              opacity={isHovered ? 1 : 0}
              transform={isHovered ? "scale(1)" : "scale(0.8)"}
              transition="all 0.3s"
              aria-label="Add to wishlist"
            />
          </Tooltip>
        </Box>

        {/* Product Image with Zoom Effect */}
        <Image 
          src={product.image} 
          alt={product.name} 
          h="full"
          w="full" 
          objectFit="cover"
          cursor="pointer"
          onClick={() => navigate(`/product/${product._id}`)}
          transform={isHovered ? "scale(1.1)" : "scale(1)"}
          transition="transform 0.5s ease"
        />

        {/* Quick Actions Overlay */}
        <ScaleFade in={isHovered} initialScale={0.9}>
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            bg="blackAlpha.700"
            backdropFilter="blur(10px)"
            p={3}
            transform={isHovered ? "translateY(0)" : "translateY(100%)"}
            transition="transform 0.3s"
          >
            <HStack spacing={2} justify="center">
              <Tooltip label="Quick View">
                <IconButton
                  icon={<FiEye />}
                  size="sm"
                  colorScheme="whiteAlpha"
                  variant="solid"
                  onClick={() => navigate(`/product/${product._id}`)}
                  aria-label="Quick view"
                />
              </Tooltip>
              <Button
                leftIcon={<FiShoppingCart />}
                size="sm"
                colorScheme={isInCart(product._id) ? "green" : "cyan"}
                flex={1}
                onClick={handleAddToCart}
              >
                {isInCart(product._id) ? "In Cart" : "Add to Cart"}
              </Button>
            </HStack>
          </Box>
        </ScaleFade>
      </Box>

      {/* Content Section */}
      <Box p={5}>
        {/* Category Tag */}
        <HStack mb={2} spacing={2}>
          <Icon as={FiTag} color="gray.400" boxSize={3} />
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">
            Electronics
          </Text>
        </HStack>

        {/* Clickable Title */}
        <Heading 
          as="h3" 
          size="md" 
          mb={2}
          noOfLines={2}
          cursor="pointer"
          onClick={() => navigate(`/product/${product._id}`)}
          _hover={{ color: "cyan.500" }}
          transition="color 0.2s"
          fontWeight="bold"
          fontSize="lg"
          minH="48px"
        >
          {product.name}
        </Heading>
        
        {/* Star Rating */}
        {reviewStats.count > 0 ? (
          <HStack spacing={2} mb={3}>
            <StarRating rating={reviewStats.averageRating} size={14} />
            <Text fontSize="xs" color="gray.500" fontWeight="medium">
              ({reviewStats.count} reviews)
            </Text>
          </HStack>
        ) : (
          <HStack spacing={1} mb={3}>
            <StarRating rating={0} size={14} />
            <Text fontSize="xs" color="gray.400">
              No reviews
            </Text>
          </HStack>
        )}
        
        {/* Price Section */}
        <HStack justify="space-between" align="center" mb={4}>
          <VStack align="flex-start" spacing={0}>
            {discount && (
              <Text 
                fontSize="sm" 
                color="gray.400" 
                textDecoration="line-through"
              >
                ${(parseFloat(product.price) * (1 + discount / 100)).toFixed(2)}
              </Text>
            )}
            <Text 
              fontWeight="bold" 
              fontSize="2xl" 
              color={priceColor}
              lineHeight="1"
            >
              ${product.price}
            </Text>
          </VStack>
          
          {isInCart(product._id) && (
            <Badge colorScheme="green" px={2} py={1} borderRadius="md">
              In Cart
            </Badge>
          )}
        </HStack>

        {/* Admin Actions - Show only on hover */}
        <ScaleFade in={isHovered}>
          <HStack spacing={2} mt={3}>
            <Tooltip label="Edit Product">
              <IconButton 
                icon={<EditIcon />} 
                onClick={handleModalOpen} 
                size="sm"
                variant="ghost"
                colorScheme="blue" 
                flex={1}
                aria-label="Edit product"
              />
            </Tooltip>
            <Tooltip label="Delete Product">
              <IconButton 
                icon={<DeleteIcon />} 
                onClick={handleDeleteProduct} 
                size="sm"
                variant="ghost"
                colorScheme="red" 
                flex={1}
                aria-label="Delete product"
              />
            </Tooltip>
          </HStack>
        </ScaleFade>
      </Box>
    </MotionBox>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                type="text"
                name="name"
                placeholder="Product Name"
                value={updateProduct.name || ''}
                onChange={(e) =>
                  setUpdateProduct((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <Input
                type="text"
                name="price"
                placeholder="Product Price"
                value={updateProduct.price || ''}
                onChange={(e) =>
                  setUpdateProduct((prev) => ({ ...prev, price: e.target.value }))
                }
              />
              <Input
                type="text"
                name="image"
                placeholder="Product Image"
                value={updateProduct.image || ''}
                onChange={(e) =>
                  setUpdateProduct((prev) => ({ ...prev, image: e.target.value }))
                }
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleUpdateProduct(product._id, updateProduct)}
            >
              Update
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProductCard;