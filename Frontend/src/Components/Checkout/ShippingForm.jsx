import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Grid,
  Heading,
  VStack,
  FormErrorMessage,
  Select,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';

const ShippingForm = ({ shippingInfo, setShippingInfo }) => {
  const [errors, setErrors] = useState({});
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
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

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^[\d\s\-\+\(\)]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = '';

    if (!value.trim()) {
      error = 'This field is required';
    } else if (name === 'email' && !validateEmail(value)) {
      error = 'Please enter a valid email address';
    } else if (name === 'phone' && !validatePhone(value)) {
      error = 'Please enter a valid phone number';
    } else if (name === 'postalCode' && value.length < 4) {
      error = 'Please enter a valid postal code';
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
        Shipping Information
      </Heading>

      <VStack spacing={4}>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} w="100%">
          <FormControl isRequired isInvalid={errors.fullName}>
            <FormLabel>Full Name</FormLabel>
            <Input
              name="fullName"
              placeholder="John Doe"
              value={shippingInfo.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormErrorMessage>{errors.fullName}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              placeholder="john@example.com"
              value={shippingInfo.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
        </Grid>

        <FormControl isRequired isInvalid={errors.phone}>
          <FormLabel>Phone Number</FormLabel>
          <Input
            name="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={shippingInfo.phone}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <FormErrorMessage>{errors.phone}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={errors.address}>
          <FormLabel>Street Address</FormLabel>
          <Input
            name="address"
            placeholder="123 Main Street, Apt 4B"
            value={shippingInfo.address}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <FormErrorMessage>{errors.address}</FormErrorMessage>
        </FormControl>

        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} w="100%">
          <FormControl isRequired isInvalid={errors.city}>
            <FormLabel>City</FormLabel>
            <Input
              name="city"
              placeholder="New York"
              value={shippingInfo.city}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormErrorMessage>{errors.city}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.state}>
            <FormLabel>State / Province</FormLabel>
            <Input
              name="state"
              placeholder="NY"
              value={shippingInfo.state}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormErrorMessage>{errors.state}</FormErrorMessage>
          </FormControl>
        </Grid>

        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} w="100%">
          <FormControl isRequired isInvalid={errors.postalCode}>
            <FormLabel>Postal Code</FormLabel>
            <Input
              name="postalCode"
              placeholder="10001"
              value={shippingInfo.postalCode}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormErrorMessage>{errors.postalCode}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={errors.country}>
            <FormLabel>Country</FormLabel>
            <Select
              name="country"
              placeholder="Select country"
              value={shippingInfo.country}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Pakistan">Pakistan</option>
              <option value="India">India</option>
              <option value="Other">Other</option>
            </Select>
            <FormErrorMessage>{errors.country}</FormErrorMessage>
          </FormControl>
        </Grid>
      </VStack>
    </Box>
  );
};

export default ShippingForm;
