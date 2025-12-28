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
  Text,
  Image,
  IconButton,
  Divider,
  Box,
  useColorModeValue,
  Heading,
  Icon,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon, DeleteIcon } from "@chakra-ui/icons";
import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useCartStore from "../Store/cart";
import { getProductId } from "../utils/productIdHelper";

const CartDrawer = ({ isOpen, onClose }) => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    getTotalPrice,
    clearCart,
  } = useCartStore();

  const navigate = useNavigate();
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleCheckout = () => {
    onClose(); // Close the drawer
    navigate("/checkout"); // Navigate to checkout page
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          Shopping Cart ({cartItems.length} items)
        </DrawerHeader>

        <DrawerBody>
          {cartItems.length === 0 ? (
            <VStack spacing={4} py={10}>
              <Icon as={FiShoppingCart} boxSize={20} color="gray.400" />
              <Heading size="md" color="gray.500">
                Your cart is empty
              </Heading>
              <Text color="gray.400">Add some products to get started!</Text>
              <Button colorScheme="blue" onClick={onClose}>
                Continue Shopping
              </Button>
            </VStack>
          ) : (
            <VStack spacing={4} align="stretch">
              {cartItems.map((item) => (
                <Box
                  key={getProductId(item)}
                  p={4}
                  bg={bg}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor={borderColor}
                  position="relative"
                >
                  <HStack spacing={4} align="start">
                    {/* Product Image */}
                    <Image
                      src={item.image}
                      alt={item.name}
                      boxSize="80px"
                      objectFit="cover"
                      borderRadius="md"
                    />

                    {/* Product Details */}
                    <VStack align="start" spacing={1} flex={1}>
                      <Text fontWeight="bold" fontSize="md">
                        {item.name}
                      </Text>
                      <Text color="green.500" fontWeight="semibold">
                        ${item.price}
                      </Text>

                      {/* Quantity Controls */}
                      <HStack spacing={2} mt={2}>
                        <IconButton
                          size="xs"
                          icon={<MinusIcon />}
                          onClick={() => decreaseQuantity(getProductId(item))}
                          aria-label="Decrease quantity"
                          colorScheme="gray"
                        />
                        <Text fontWeight="medium" minW="30px" textAlign="center">
                          {item.quantity}
                        </Text>
                        <IconButton
                          size="xs"
                          icon={<AddIcon />}
                          onClick={() => increaseQuantity(getProductId(item))}
                          aria-label="Increase quantity"
                          colorScheme="gray"
                        />
                      </HStack>
                    </VStack>

                    {/* Item Total & Delete */}
                    <VStack align="end" spacing={2}>
                      <Text fontWeight="bold" fontSize="lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Text>
                      <IconButton
                        size="sm"
                        icon={<DeleteIcon />}
                        onClick={() => removeFromCart(getProductId(item))}
                        colorScheme="red"
                        variant="ghost"
                        aria-label="Remove item"
                      />
                    </VStack>
                  </HStack>
                </Box>
              ))}

              {/* Clear Cart Button */}
              {cartItems.length > 0 && (
                <Button
                  variant="outline"
                  colorScheme="red"
                  size="sm"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear the cart?")) {
                      clearCart();
                    }
                  }}
                >
                  Clear Cart
                </Button>
              )}
            </VStack>
          )}
        </DrawerBody>

        {cartItems.length > 0 && (
          <DrawerFooter borderTopWidth="1px">
            <VStack spacing={4} w="full">
              {/* Total */}
              <HStack justify="space-between" w="full">
                <Text fontSize="xl" fontWeight="bold">
                  Total:
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  ${getTotalPrice()}
                </Text>
              </HStack>

              {/* Action Buttons */}
              <HStack spacing={3} w="full">
                <Button variant="outline" onClick={onClose} flex={1}>
                  Continue Shopping
                </Button>
                <Button 
                  colorScheme="green" 
                  onClick={handleCheckout} 
                  flex={1}
                  size="lg"
                  fontWeight="bold"
                >
                  Proceed to Checkout
                </Button>
              </HStack>
            </VStack>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
