import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Input,
  Button,
  useColorModeValue,
  HStack,
  Icon,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  useSteps,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiPackage, FiTruck, FiCheckCircle, FiSearch } from "react-icons/fi";
import { useState } from "react";

const MotionBox = motion.create(Box);

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [showTracking, setShowTracking] = useState(false);

  const bgGradient = useColorModeValue(
    "linear(to-br, purple.50, pink.50)",
    "linear(to-br, gray.900, purple.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const steps = [
    { title: "Order Placed", description: "Dec 1, 2025" },
    { title: "Processing", description: "Dec 2, 2025" },
    { title: "Shipped", description: "Dec 3, 2025" },
    { title: "Out for Delivery", description: "Expected Dec 4" },
    { title: "Delivered", description: "Pending" },
  ];

  const { activeStep } = useSteps({
    index: 2,
    count: steps.length,
  });

  const handleTrack = () => {
    if (orderNumber) {
      setShowTracking(true);
    }
  };

  return (
    <Box bgGradient={bgGradient} minH="100vh" py={16}>
      <Container maxW="container.lg">
        <VStack spacing={8}>
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            textAlign="center"
          >
            <Icon
              as={FiPackage}
              boxSize={16}
              color="purple.500"
              mb={4}
            />
            <Heading
              size="2xl"
              bgGradient="linear(to-r, purple.400, pink.500)"
              bgClip="text"
              mb={4}
            >
              Track Your Order
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Enter your order number to see real-time tracking information
            </Text>
          </MotionBox>

          {/* Search Box */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
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
              <VStack spacing={4}>
                <HStack w="full" spacing={4}>
                  <Input
                    placeholder="Enter order number (e.g., ORD-123456)"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    size="lg"
                    borderRadius="xl"
                  />
                  <Button
                    bgGradient="linear(to-r, purple.400, pink.500)"
                    color="white"
                    size="lg"
                    px={8}
                    leftIcon={<FiSearch />}
                    onClick={handleTrack}
                    _hover={{
                      bgGradient: "linear(to-r, purple.500, pink.600)",
                    }}
                  >
                    Track
                  </Button>
                </HStack>
                <Text fontSize="sm" color="gray.500">
                  You can find your order number in the confirmation email
                </Text>
              </VStack>
            </Box>
          </MotionBox>

          {/* Tracking Information */}
          {showTracking && (
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
                <VStack spacing={6} align="stretch">
                  <HStack justify="space-between">
                    <Box>
                      <Text fontSize="sm" color="gray.500">
                        Order Number
                      </Text>
                      <Text fontSize="xl" fontWeight="bold">
                        {orderNumber || "ORD-123456"}
                      </Text>
                    </Box>
                    <Box textAlign="right">
                      <Text fontSize="sm" color="gray.500">
                        Estimated Delivery
                      </Text>
                      <Text fontSize="xl" fontWeight="bold" color="purple.500">
                        Dec 4, 2025
                      </Text>
                    </Box>
                  </HStack>

                  <Stepper index={activeStep} orientation="vertical" height="400px" gap="0">
                    {steps.map((step, index) => (
                      <Step key={index}>
                        <StepIndicator>
                          <StepStatus
                            complete={<StepIcon />}
                            incomplete={<StepNumber />}
                            active={<StepNumber />}
                          />
                        </StepIndicator>

                        <Box flexShrink="0">
                          <StepTitle>{step.title}</StepTitle>
                          <StepDescription>{step.description}</StepDescription>
                        </Box>

                        <StepSeparator />
                      </Step>
                    ))}
                  </Stepper>

                  <Box
                    p={4}
                    bg={useColorModeValue("purple.50", "purple.900")}
                    borderRadius="xl"
                  >
                    <HStack>
                      <Icon as={FiTruck} color="purple.500" boxSize={6} />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold">Current Status: Shipped</Text>
                        <Text fontSize="sm" color="gray.600">
                          Your package is on its way! Estimated delivery by Dec 4, 2025
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                </VStack>
              </Box>
            </MotionBox>
          )}

          {/* Help Card */}
          <Card w="full" variant="outline">
            <CardBody>
              <VStack spacing={2}>
                <Icon as={FiCheckCircle} boxSize={8} color="green.500" />
                <Heading size="md">Need Help?</Heading>
                <Text textAlign="center" color="gray.600">
                  If you have any questions about your order, please contact our
                  customer support team.
                </Text>
                <Button colorScheme="purple" variant="outline" mt={2}>
                  Contact Support
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
