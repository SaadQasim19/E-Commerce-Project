import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  HStack,
  Icon,
  Divider,
  Grid,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaBox } from 'react-icons/fa';
import { FiMail, FiPhone } from 'react-icons/fi';
import confetti from 'canvas-confetti';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    // Fire confetti on successful order
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  if (!order) {
    return (
      <Container maxW="container.md" py={20}>
        <VStack spacing={6}>
          <Heading size="lg">Order Not Found</Heading>
          <Text color="gray.500">Unable to load order details</Text>
          <Button colorScheme="cyan" onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </VStack>
      </Container>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={8} align="stretch">
        {/* Success Header */}
        <VStack spacing={4} py={8}>
          <Icon as={FaCheckCircle} boxSize={20} color="green.500" />
          <Heading size="2xl" textAlign="center">
            Order Placed Successfully!
          </Heading>
          <Text fontSize="lg" color="gray.500" textAlign="center">
            Thank you for your purchase! Your order is being processed.
          </Text>
        </VStack>

        {/* Order Summary Card */}
        <Box
          p={8}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          shadow="lg"
        >
          <VStack spacing={6} align="stretch">
            {/* Order ID and Status */}
            <HStack justify="space-between" flexWrap="wrap">
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color="gray.500">
                  Order ID
                </Text>
                <Text fontSize="lg" fontWeight="bold">
                  #{order._id}
                </Text>
              </VStack>
              <Badge colorScheme="yellow" fontSize="md" px={4} py={2} borderRadius="full">
                {order.status.toUpperCase()}
              </Badge>
            </HStack>

            <Divider />

            {/* Order Date */}
            <HStack>
              <Text fontWeight="medium">Order Date:</Text>
              <Text color="gray.600">{formatDate(order.orderDate)}</Text>
            </HStack>

            {/* Shipping Information */}
            <Box>
              <Heading size="sm" mb={3}>
                Shipping Address
              </Heading>
              <VStack align="start" spacing={1} pl={4}>
                <Text fontWeight="medium">{order.shippingInfo.fullName}</Text>
                <Text fontSize="sm">{order.shippingInfo.address}</Text>
                <Text fontSize="sm">
                  {order.shippingInfo.city}
                  {order.shippingInfo.state && `, ${order.shippingInfo.state}`}{' '}
                  {order.shippingInfo.postalCode}
                </Text>
                <Text fontSize="sm">{order.shippingInfo.country}</Text>
                <HStack fontSize="sm" color="gray.600">
                  <Icon as={FiMail} />
                  <Text>{order.shippingInfo.email}</Text>
                </HStack>
                <HStack fontSize="sm" color="gray.600">
                  <Icon as={FiPhone} />
                  <Text>{order.shippingInfo.phone}</Text>
                </HStack>
              </VStack>
            </Box>

            <Divider />

            {/* Order Items */}
            <Box>
              <Heading size="sm" mb={3}>
                Order Items ({order.items.length})
              </Heading>
              <VStack spacing={3}>
                {order.items.map((item, index) => (
                  <Grid
                    key={index}
                    templateColumns="auto 1fr auto"
                    gap={4}
                    w="100%"
                    p={3}
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    borderRadius="md"
                  >
                    <Box>
                      <Badge colorScheme="cyan">{item.quantity}x</Badge>
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium">{item.name}</Text>
                      <Text fontSize="sm" color="gray.500">
                        ${item.price} each
                      </Text>
                    </VStack>
                    <Text fontWeight="bold" color="green.500">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </Grid>
                ))}
              </VStack>
            </Box>

            <Divider />

            {/* Price Breakdown */}
            <VStack spacing={2} align="stretch">
              <HStack justify="space-between">
                <Text>Subtotal:</Text>
                <Text fontWeight="medium">
                  $
                  {order.items
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toFixed(2)}
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Shipping:</Text>
                <Text fontWeight="medium" color="green.500">
                  $10.00
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Tax:</Text>
                <Text fontWeight="medium">
                  $
                  {(
                    order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.1
                  ).toFixed(2)}
                </Text>
              </HStack>
              <Divider />
              <HStack justify="space-between" fontSize="xl">
                <Text fontWeight="bold">Total Paid:</Text>
                <Text fontWeight="bold" color="green.500">
                  ${order.totalAmount.toFixed(2)}
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </Box>

        {/* Confirmation Message */}
        <Box
          p={6}
          bg="blue.50"
          borderRadius="lg"
          _dark={{ bg: 'blue.900' }}
        >
          <VStack spacing={3} align="start">
            <HStack>
              <Icon as={FiMail} color="blue.700" _dark={{ color: 'blue.200' }} />
              <Text fontWeight="bold" color="blue.700" _dark={{ color: 'blue.200' }}>
                Order Confirmation Email Sent
              </Text>
            </HStack>
            <Text fontSize="sm" color="blue.600" _dark={{ color: 'blue.300' }}>
              We've sent a confirmation email to <strong>{order.shippingInfo.email}</strong> with
              your order details and tracking information.
            </Text>
          </VStack>
        </Box>

        {/* Action Buttons */}
        <HStack justify="center" spacing={4} pt={4}>
          <Button
            leftIcon={<FaHome />}
            colorScheme="cyan"
            size="lg"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </Button>
          <Button
            leftIcon={<FaBox />}
            variant="outline"
            colorScheme="cyan"
            size="lg"
            onClick={() => navigate('/admin/orders')}
          >
            View Orders
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
};

export default OrderConfirmationPage;
