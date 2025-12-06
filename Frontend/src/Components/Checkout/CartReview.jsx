import {
  Box,
  Grid,
  Heading,
  VStack,
  HStack,
  Image,
  Text,
  Badge,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import useCartStore from '../../Store/cart';

const CartReview = () => {
  const { cartItems: items, getTotalPrice } = useCartStore();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box>
      <Heading size="md" mb={6}>
        Review Your Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
      </Heading>

      <VStack spacing={4} align="stretch">
        {items.map((item) => (
          <Box
            key={item._id}
            p={4}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="sm"
          >
            <Grid templateColumns={{ base: '80px 1fr', md: '100px 1fr auto' }} gap={4}>
              <Image
                src={item.image}
                alt={item.name}
                borderRadius="md"
                objectFit="cover"
                w="100%"
                h={{ base: '80px', md: '100px' }}
              />

              <VStack align="start" justify="center" spacing={2}>
                <Heading size="sm">{item.name}</Heading>
                <HStack>
                  <Text fontSize="lg" fontWeight="bold" color="green.500">
                    ${item.price}
                  </Text>
                  <Text color="gray.500">×</Text>
                  <Badge colorScheme="cyan">{item.quantity}</Badge>
                </HStack>
              </VStack>

              <VStack justify="center" align="end">
                <Text fontSize="lg" fontWeight="bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </VStack>
            </Grid>
          </Box>
        ))}

        <Divider />

        <HStack justify="space-between" fontSize="xl" fontWeight="bold">
          <Text>Subtotal:</Text>
          <Text color="green.500">${getTotalPrice().toFixed(2)}</Text>
        </HStack>

        <Box p={4} bg="cyan.50" borderRadius="md" _dark={{ bg: 'cyan.900' }}>
          <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.300' }}>
            💡 Shipping and taxes will be calculated at the final step
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default CartReview;
