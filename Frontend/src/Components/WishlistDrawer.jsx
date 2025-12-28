import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  VStack,
  HStack,
  Image,
  Text,
  IconButton,
  Box,
  useColorModeValue,
  Divider,
  Badge,
  useToast,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { FiTrash2, FiShoppingCart } from "react-icons/fi";
import useWishlistStore from "../Store/wishlist";
import useCartStore from "../Store/cart";
import { getProductId } from "../utils/productIdHelper";

const WishlistDrawer = ({ isOpen, onClose }) => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleRemove = (productId) => {
    removeFromWishlist(productId);
    toast({
      title: "Removed",
      description: "Item removed from wishlist",
      status: "info",
      duration: 2000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  const handleAddToCart = (product) => {
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

  const handleClearAll = () => {
    clearWishlist();
    toast({
      title: "Cleared",
      description: "All items removed from wishlist",
      status: "info",
      duration: 2000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          <Flex align="center" justify="space-between">
            <Heading size="md">My Wishlist</Heading>
            <Badge colorScheme="red" fontSize="md" px={2} py={1} borderRadius="full">
              {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
            </Badge>
          </Flex>
        </DrawerHeader>

        <DrawerBody>
          {wishlistItems.length === 0 ? (
            <VStack spacing={4} py={10} textAlign="center">
              <Text fontSize="xl" color="gray.500">
                Your wishlist is empty
              </Text>
              <Text fontSize="sm" color="gray.400">
                Add items you love to your wishlist!
              </Text>
            </VStack>
          ) : (
            <VStack spacing={4} align="stretch">
              {wishlistItems.map((item) => (
                <Box
                  key={getProductId(item)}
                  p={4}
                  bg={bgColor}
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="lg"
                  _hover={{ shadow: "md" }}
                  transition="all 0.2s"
                >
                  <HStack spacing={4} align="start">
                    <Image
                      src={item.image}
                      alt={item.name}
                      boxSize="80px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                    <VStack align="start" flex="1" spacing={2}>
                      <Text fontWeight="bold" fontSize="sm" noOfLines={2}>
                        {item.name}
                      </Text>
                      <HStack spacing={2}>
                        <Text fontWeight="bold" color="blue.500">
                          ${item.price}
                        </Text>
                        {item.discount && (
                          <Badge colorScheme="red">{item.discount}% OFF</Badge>
                        )}
                      </HStack>
                      {item.brand && (
                        <Text fontSize="xs" color="gray.500">
                          Brand: {item.brand}
                        </Text>
                      )}
                      <HStack spacing={2} mt={2}>
                        <Button
                          leftIcon={<FiShoppingCart />}
                          size="xs"
                          colorScheme="blue"
                          onClick={() => handleAddToCart(item)}
                        >
                          Add to Cart
                        </Button>
                        <IconButton
                          icon={<FiTrash2 />}
                          size="xs"
                          colorScheme="red"
                          variant="ghost"
                          aria-label="Remove from wishlist"
                          onClick={() => handleRemove(getProductId(item))}
                        />
                      </HStack>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </DrawerBody>

        {wishlistItems.length > 0 && (
          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" colorScheme="red" onClick={handleClearAll} w="full">
              Clear All
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default WishlistDrawer;
