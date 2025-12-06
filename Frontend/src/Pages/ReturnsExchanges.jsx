import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Icon,
  SimpleGrid,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Select,
  useToast,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiPackage,
} from "react-icons/fi";
import { useState } from "react";

const MotionBox = motion.create(Box);

export default function ReturnsExchanges() {
  const [formData, setFormData] = useState({
    orderNumber: "",
    email: "",
    reason: "",
    description: "",
  });

  const toast = useToast();

  const bgGradient = useColorModeValue(
    "linear(to-br, orange.50, red.50)",
    "linear(to-br, gray.900, orange.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const features = [
    {
      icon: FiClock,
      title: "30-Day Returns",
      description: "Return any item within 30 days of purchase",
      color: "orange",
    },
    {
      icon: FiRefreshCw,
      title: "Easy Exchanges",
      description: "Quick and hassle-free exchange process",
      color: "blue",
    },
    {
      icon: FiCheckCircle,
      title: "Full Refund",
      description: "Get your money back with our guarantee",
      color: "green",
    },
    {
      icon: FiPackage,
      title: "Free Return Shipping",
      description: "We cover return shipping costs",
      color: "purple",
    },
  ];

  const returnConditions = [
    "Item must be in original condition and packaging",
    "All tags and labels must be attached",
    "Item must be unused and unworn",
    "Proof of purchase required",
    "Some items may be non-returnable (see exclusions)",
  ];

  const returnProcess = [
    {
      step: 1,
      title: "Initiate Return",
      description: "Fill out the return request form below",
    },
    {
      step: 2,
      title: "Get Approval",
      description: "We'll review and approve your request within 24 hours",
    },
    {
      step: 3,
      title: "Ship Item",
      description: "Pack and ship the item using our prepaid label",
    },
    {
      step: 4,
      title: "Receive Refund",
      description: "Get your refund within 5-7 business days",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Return Request Submitted",
      description: "We'll review your request and get back to you within 24 hours.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    setFormData({
      orderNumber: "",
      email: "",
      reason: "",
      description: "",
    });
  };

  return (
    <Box bgGradient={bgGradient} minH="100vh" py={16}>
      <Container maxW="container.xl">
        <VStack spacing={12}>
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            textAlign="center"
          >
            <Icon as={FiRefreshCw} boxSize={16} color="orange.500" mb={4} />
            <Heading
              size="2xl"
              bgGradient="linear(to-r, orange.400, red.500)"
              bgClip="text"
              mb={4}
            >
              Returns & Exchanges
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              We want you to be completely satisfied with your purchase. If you're not happy,
              we're here to help.
            </Text>
          </MotionBox>

          {/* Features */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
            {features.map((feature, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Box
                  bg={cardBg}
                  p={6}
                  borderRadius="xl"
                  boxShadow="md"
                  border="1px"
                  borderColor={borderColor}
                  textAlign="center"
                  transition="all 0.3s"
                  _hover={{
                    transform: "translateY(-4px)",
                    boxShadow: "xl",
                  }}
                >
                  <Icon
                    as={feature.icon}
                    boxSize={12}
                    color={`${feature.color}.500`}
                    mb={4}
                  />
                  <Heading size="md" mb={2}>
                    {feature.title}
                  </Heading>
                  <Text color="gray.600" fontSize="sm">
                    {feature.description}
                  </Text>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>

          {/* Return Process */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            w="full"
          >
            <Box
              bg={cardBg}
              p={8}
              borderRadius="2xl"
              boxShadow="xl"
              border="1px"
              borderColor={borderColor}
            >
              <Heading size="lg" mb={6}>
                How Returns Work
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                {returnProcess.map((step, index) => (
                  <Box key={index} textAlign="center">
                    <Box
                      bgGradient="linear(to-r, orange.400, red.500)"
                      color="white"
                      borderRadius="full"
                      w={12}
                      h={12}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="xl"
                      fontWeight="bold"
                      mx="auto"
                      mb={4}
                    >
                      {step.step}
                    </Box>
                    <Heading size="sm" mb={2}>
                      {step.title}
                    </Heading>
                    <Text fontSize="sm" color="gray.600">
                      {step.description}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </MotionBox>

          {/* Return Conditions */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} w="full">
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Box
                bg={cardBg}
                p={8}
                borderRadius="2xl"
                boxShadow="xl"
                border="1px"
                borderColor={borderColor}
                h="full"
              >
                <HStack mb={6}>
                  <Icon as={FiCheckCircle} boxSize={6} color="green.500" />
                  <Heading size="lg">Return Conditions</Heading>
                </HStack>
                <List spacing={3}>
                  {returnConditions.map((condition, index) => (
                    <ListItem key={index}>
                      <HStack align="start">
                        <ListIcon as={FiCheckCircle} color="green.500" mt={1} />
                        <Text>{condition}</Text>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </MotionBox>

            {/* Request Form */}
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Box
                bg={cardBg}
                p={8}
                borderRadius="2xl"
                boxShadow="xl"
                border="1px"
                borderColor={borderColor}
              >
                <HStack mb={6}>
                  <Icon as={FiAlertCircle} boxSize={6} color="orange.500" />
                  <Heading size="lg">Submit Return Request</Heading>
                </HStack>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Order Number</FormLabel>
                      <Input
                        placeholder="ORD-123456"
                        value={formData.orderNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, orderNumber: e.target.value })
                        }
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Return Reason</FormLabel>
                      <Select
                        placeholder="Select reason"
                        value={formData.reason}
                        onChange={(e) =>
                          setFormData({ ...formData, reason: e.target.value })
                        }
                      >
                        <option value="wrong-item">Wrong Item Received</option>
                        <option value="defective">Defective Product</option>
                        <option value="not-as-described">Not As Described</option>
                        <option value="changed-mind">Changed My Mind</option>
                        <option value="other">Other</option>
                      </Select>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        placeholder="Please provide details about your return..."
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        rows={4}
                      />
                    </FormControl>
                    <Button
                      type="submit"
                      bgGradient="linear(to-r, orange.400, red.500)"
                      color="white"
                      w="full"
                      size="lg"
                      _hover={{
                        bgGradient: "linear(to-r, orange.500, red.600)",
                      }}
                    >
                      Submit Request
                    </Button>
                  </VStack>
                </form>
              </Box>
            </MotionBox>
          </SimpleGrid>

          {/* Exchange Info */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            w="full"
          >
            <Box
              bg={cardBg}
              p={8}
              borderRadius="2xl"
              boxShadow="xl"
              border="1px"
              borderColor={borderColor}
            >
              <Heading size="lg" mb={4}>
                Exchanges
              </Heading>
              <Text color="gray.600" mb={4}>
                If you'd like to exchange an item for a different size or color, simply
                return the original item and place a new order. We'll expedite the shipping
                on your new order at no extra cost.
              </Text>
              <Text color="gray.600">
                For faster service, you can also contact our customer support team to
                arrange an exchange directly.
              </Text>
            </Box>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
}
