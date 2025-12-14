import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Grid,
  Heading,
  VStack,
  FormErrorMessage,
  RadioGroup,
  Radio,
  HStack,
  Icon,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaCreditCard, FaPaypal, FaGooglePay, FaApplePay } from 'react-icons/fa';
import { useState } from 'react';

const PaymentForm = ({ paymentInfo, setPaymentInfo }) => {
  const [errors, setErrors] = useState({});
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Format card number with spaces
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      value = value.slice(0, 19); // Max length with spaces
    }

    // Format expiry date with slash
    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      value = value.slice(0, 5);
    }

    // Limit CVV to 3 digits
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }

    setPaymentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handlePaymentMethodChange = (value) => {
    setPaymentInfo((prev) => ({
      ...prev,
      paymentMethod: value,
    }));
  };

  const validateCardNumber = (number) => {
    const cleaned = number.replace(/\s/g, '');
    return /^\d{16}$/.test(cleaned);
  };

  const validateExpiryDate = (date) => {
    if (!/^\d{2}\/\d{2}$/.test(date)) return false;

    const [month, year] = date.split('/').map(Number);
    if (month < 1 || month > 12) return false;

    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = '';

    if (paymentInfo.paymentMethod === 'card') {
      if (!value.trim()) {
        error = 'This field is required';
      } else if (name === 'cardNumber' && !validateCardNumber(value)) {
        error = 'Please enter a valid 16-digit card number';
      } else if (name === 'expiryDate' && !validateExpiryDate(value)) {
        error = 'Please enter a valid expiry date (MM/YY)';
      } else if (name === 'cvv' && value.length !== 3) {
        error = 'CVV must be 3 digits';
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  return (
    <Box
      p={6}
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      shadow="sm"
    >
      <Heading size="md" mb={6}>
        Payment Method
      </Heading>

      <VStack spacing={6}>
        {/* Payment Method Selection */}
        <FormControl>
          <FormLabel>Select Payment Method</FormLabel>
          <RadioGroup
            value={paymentInfo.paymentMethod}
            onChange={handlePaymentMethodChange}
          >
            <VStack spacing={3} align="stretch">
              <Box
                p={4}
                borderRadius="md"
                borderWidth="2px"
                borderColor={
                  paymentInfo.paymentMethod === 'card' ? 'cyan.500' : 'gray.200'
                }
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ borderColor: 'cyan.400' }}
              >
                <Radio value="card" colorScheme="cyan">
                  <HStack>
                    <Icon as={FaCreditCard} boxSize={5} />
                    <Text fontWeight="medium">Credit / Debit Card</Text>
                  </HStack>
                </Radio>
              </Box>

              <HStack spacing={3}>
                <Box
                  p={4}
                  borderRadius="md"
                  borderWidth="2px"
                  borderColor={
                    paymentInfo.paymentMethod === 'paypal' ? 'cyan.500' : 'gray.200'
                  }
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{ borderColor: 'cyan.400' }}
                  flex={1}
                >
                  <Radio value="paypal" colorScheme="cyan">
                    <HStack>
                      <Icon as={FaPaypal} boxSize={5} color="blue.600" />
                      <Text fontWeight="medium">PayPal</Text>
                    </HStack>
                  </Radio>
                </Box>

                <Box
                  p={4}
                  borderRadius="md"
                  borderWidth="2px"
                  borderColor={
                    paymentInfo.paymentMethod === 'google' ? 'cyan.500' : 'gray.200'
                  }
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{ borderColor: 'cyan.400' }}
                  flex={1}
                >
                  <Radio value="google" colorScheme="cyan">
                    <HStack>
                      <Icon as={FaGooglePay} boxSize={5} />
                      <Text fontWeight="medium">Google Pay</Text>
                    </HStack>
                  </Radio>
                </Box>

                <Box
                  p={4}
                  borderRadius="md"
                  borderWidth="2px"
                  borderColor={
                    paymentInfo.paymentMethod === 'apple' ? 'cyan.500' : 'gray.200'
                  }
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{ borderColor: 'cyan.400' }}
                  flex={1}
                >
                  <Radio value="apple" colorScheme="cyan">
                    <HStack>
                      <Icon as={FaApplePay} boxSize={5} />
                      <Text fontWeight="medium">Apple Pay</Text>
                    </HStack>
                  </Radio>
                </Box>
              </HStack>

              <Box
                p={4}
                borderRadius="md"
                borderWidth="2px"
                borderColor={
                  paymentInfo.paymentMethod === 'cod' ? 'cyan.500' : 'gray.200'
                }
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ borderColor: 'cyan.400' }}
              >
                <Radio value="cod" colorScheme="cyan">
                  <HStack>
                    <Text fontSize="xl">💵</Text>
                    <Text fontWeight="medium">Cash on Delivery</Text>
                  </HStack>
                </Radio>
              </Box>
            </VStack>
          </RadioGroup>
        </FormControl>

        {/* Card Details Form (only shown when card is selected) */}
        {paymentInfo.paymentMethod === 'card' && (
          <VStack spacing={4} w="100%">
            <FormControl isRequired isInvalid={errors.cardNumber}>
              <FormLabel>Card Number</FormLabel>
              <Input
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentInfo.cardNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={19}
              />
              <FormErrorMessage>{errors.cardNumber}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.cardName}>
              <FormLabel>Cardholder Name</FormLabel>
              <Input
                name="cardName"
                placeholder="JOHN DOE"
                value={paymentInfo.cardName}
                onChange={handleChange}
                onBlur={handleBlur}
                textTransform="uppercase"
              />
              <FormErrorMessage>{errors.cardName}</FormErrorMessage>
            </FormControl>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} w="100%">
              <FormControl isRequired isInvalid={errors.expiryDate}>
                <FormLabel>Expiry Date</FormLabel>
                <Input
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={paymentInfo.expiryDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={5}
                />
                <FormErrorMessage>{errors.expiryDate}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={errors.cvv}>
                <FormLabel>CVV</FormLabel>
                <Input
                  name="cvv"
                  type="password"
                  placeholder="123"
                  value={paymentInfo.cvv}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={3}
                />
                <FormErrorMessage>{errors.cvv}</FormErrorMessage>
              </FormControl>
            </Grid>
          </VStack>
        )}

        {paymentInfo.paymentMethod === 'cod' && (
          <Box p={4} bg="green.50" borderRadius="md" w="100%" _dark={{ bg: 'green.900' }}>
            <Text fontSize="sm" color="green.700" _dark={{ color: 'green.200' }}>
              💵 Pay with cash when your order is delivered. No advance payment needed!
            </Text>
          </Box>
        )}

        {paymentInfo.paymentMethod !== 'card' && paymentInfo.paymentMethod !== 'cod' && (
          <Box p={4} bg="blue.50" borderRadius="md" w="100%" _dark={{ bg: 'blue.900' }}>
            <Text fontSize="sm" color="blue.700" _dark={{ color: 'blue.200' }}>
              🔒 You'll be redirected to {paymentInfo.paymentMethod.toUpperCase()} to complete
              your payment securely.
            </Text>
          </Box>
        )}

        <Box p={4} bg="gray.50" borderRadius="md" w="100%" _dark={{ bg: 'gray.700' }}>
          <Text fontSize="xs" color="gray.600" _dark={{ color: 'gray.300' }}>
            🔐 Your payment information is encrypted and secure. We never store your full card
            details.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default PaymentForm;
