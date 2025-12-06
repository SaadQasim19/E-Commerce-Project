import {
  Box,
  Grid,
  Heading,
  VStack,
  HStack,
  Text,
  Divider,
  Badge,
  Image,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { FaShippingFast, FaCreditCard, FaMapMarkerAlt, FaPaypal, FaApple, FaGoogle } from 'react-icons/fa';
import { FiMail, FiPhone } from 'react-icons/fi';

const OrderSummary = ({ shippingInfo, paymentInfo, items, subtotal }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const shippingCost = 10.0; // Fixed shipping cost
  const taxRate = 0.1; // 10% tax
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;

  return (
    <Grid templateColumns={{ base: '1fr', lg: '1fr 400px' }} gap={6}>
      {/* Left Column - Order Details */}
      <VStack spacing={6} align="stretch">
        {/* Shipping Information */}
        <Box
          p={6}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          shadow="sm"
        >
          <HStack mb={4}>
            <Icon as={FaMapMarkerAlt} color="cyan.500" boxSize={5} />
            <Heading size="md">Shipping Address</Heading>
          </HStack>
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold">{shippingInfo.fullName}</Text>
            <Text>{shippingInfo.address}</Text>
            <Text>
              {shippingInfo.city}
              {shippingInfo.state && `, ${shippingInfo.state}`} {shippingInfo.postalCode}
            </Text>
            <Text>{shippingInfo.country}</Text>
            <Divider my={2} />
            <HStack fontSize="sm" color="gray.600">
              <Icon as={FiMail} />
              <Text>{shippingInfo.email}</Text>
            </HStack>
            <HStack fontSize="sm" color="gray.600">
              <Icon as={FiPhone} />
              <Text>{shippingInfo.phone}</Text>
            </HStack>
          </VStack>
        </Box>

        {/* Payment Method */}
        <Box
          p={6}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          shadow="sm"
        >
          <HStack mb={4}>
            <Icon as={FaCreditCard} color="cyan.500" boxSize={5} />
            <Heading size="md">Payment Method</Heading>
          </HStack>
          <VStack align="start" spacing={2}>
            <HStack>
              {paymentInfo.paymentMethod === 'card' && (
                <>
                  <Icon as={FaCreditCard} color="cyan.500" />
                  <Badge colorScheme="cyan" fontSize="md" px={3} py={1}>
                    Credit/Debit Card
                  </Badge>
                </>
              )}
              {paymentInfo.paymentMethod === 'paypal' && (
                <>
                  <Icon as={FaPaypal} color="blue.600" />
                  <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                    PayPal
                  </Badge>
                </>
              )}
              {paymentInfo.paymentMethod === 'google' && (
                <>
                  <Icon as={FaGoogle} color="red.500" />
                  <Badge colorScheme="red" fontSize="md" px={3} py={1}>
                    Google Pay
                  </Badge>
                </>
              )}
              {paymentInfo.paymentMethod === 'apple' && (
                <>
                  <Icon as={FaApple} color="gray.700" />
                  <Badge colorScheme="gray" fontSize="md" px={3} py={1}>
                    Apple Pay
                  </Badge>
                </>
              )}
            </HStack>
            {paymentInfo.paymentMethod === 'card' && paymentInfo.cardNumber && (
              <Text fontSize="sm" color="gray.600">
                **** **** **** {paymentInfo.cardNumber.replace(/\s/g, '').slice(-4)}
              </Text>
            )}
          </VStack>
        </Box>

        {/* Shipping Method */}
        <Box
          p={6}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          shadow="sm"
        >
          <HStack mb={4}>
            <Icon as={FaShippingFast} color="cyan.500" boxSize={5} />
            <Heading size="md">Delivery Method</Heading>
          </HStack>
          <HStack>
            <Badge colorScheme="green" fontSize="md" px={3} py={1}>
              Standard Shipping
            </Badge>
            <Text fontSize="sm" color="gray.600">
              (5-7 business days)
            </Text>
          </HStack>
        </Box>
      </VStack>

      {/* Right Column - Order Items & Total */}
      <VStack spacing={6} align="stretch">
        {/* Order Items */}
        <Box
          p={6}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          shadow="sm"
        >
          <Heading size="md" mb={4}>
            Order Items ({items.length})
          </Heading>

          <VStack spacing={3} maxH="400px" overflowY="auto" pr={2}>
            {items.map((item) => (
              <HStack key={item._id} w="100%" spacing={3}>
                <Image
                  src={item.image}
                  alt={item.name}
                  boxSize="60px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <VStack flex={1} align="start" spacing={0}>
                  <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                    {item.name}
                  </Text>
                  <HStack>
                    <Text fontSize="xs" color="gray.500">
                      ${item.price} × {item.quantity}
                    </Text>
                  </HStack>
                </VStack>
                <Text fontWeight="bold" fontSize="sm">
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>

        {/* Price Breakdown */}
        <Box
          p={6}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          shadow="sm"
        >
          <Heading size="md" mb={4}>
            Order Total
          </Heading>

          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <Text>Subtotal:</Text>
              <Text fontWeight="medium">${subtotal.toFixed(2)}</Text>
            </HStack>

            <HStack justify="space-between">
              <Text>Shipping:</Text>
              <Text fontWeight="medium" color="green.500">
                ${shippingCost.toFixed(2)}
              </Text>
            </HStack>

            <HStack justify="space-between">
              <Text>Tax (10%):</Text>
              <Text fontWeight="medium">${tax.toFixed(2)}</Text>
            </HStack>

            <Divider />

            <HStack justify="space-between" fontSize="xl">
              <Text fontWeight="bold">Total:</Text>
              <Text fontWeight="bold" color="green.500">
                ${total.toFixed(2)}
              </Text>
            </HStack>
          </VStack>
        </Box>

        <Box p={4} bg="green.50" borderRadius="md" _dark={{ bg: 'green.900' }}>
          <Text fontSize="sm" color="green.700" _dark={{ color: 'green.200' }}>
            ✅ By placing this order, you agree to our terms and conditions
          </Text>
        </Box>
      </VStack>
    </Grid>
  );
};

export default OrderSummary;
