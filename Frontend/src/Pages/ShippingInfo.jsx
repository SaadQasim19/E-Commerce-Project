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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiTruck,
  FiClock,
  FiGlobe,
  FiPackage,
  FiDollarSign,
  FiMapPin,
} from "react-icons/fi";

const MotionBox = motion.create(Box);

export default function ShippingInfo() {
  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, cyan.50)",
    "linear(to-br, gray.900, blue.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const shippingFeatures = [
    {
      icon: FiTruck,
      title: "Fast Delivery",
      description: "Express shipping available on most items",
      color: "blue",
    },
    {
      icon: FiClock,
      title: "On-Time Guarantee",
      description: "Delivery within estimated timeframe or your money back",
      color: "green",
    },
    {
      icon: FiGlobe,
      title: "Worldwide Shipping",
      description: "We ship to over 100 countries worldwide",
      color: "purple",
    },
    {
      icon: FiPackage,
      title: "Secure Packaging",
      description: "All items carefully packaged to prevent damage",
      color: "orange",
    },
  ];

  const domesticRates = [
    { method: "Standard", time: "5-7 business days", cost: "$5.99", threshold: "$50" },
    { method: "Express", time: "2-3 business days", cost: "$12.99", threshold: "$100" },
    { method: "Overnight", time: "1 business day", cost: "$24.99", threshold: "$150" },
  ];

  const internationalZones = [
    { zone: "North America", time: "7-10 days", cost: "$15.99" },
    { zone: "Europe", time: "10-14 days", cost: "$19.99" },
    { zone: "Asia", time: "12-16 days", cost: "$22.99" },
    { zone: "Other Regions", time: "14-21 days", cost: "$29.99" },
  ];

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
            <Icon as={FiTruck} boxSize={16} color="blue.500" mb={4} />
            <Heading
              size="2xl"
              bgGradient="linear(to-r, blue.400, cyan.500)"
              bgClip="text"
              mb={4}
            >
              Shipping Information
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Everything you need to know about our shipping policies, rates, and delivery times
            </Text>
          </MotionBox>

          {/* Features */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
            {shippingFeatures.map((feature, index) => (
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

          {/* Domestic Shipping */}
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
              <HStack mb={6}>
                <Icon as={FiMapPin} boxSize={6} color="blue.500" />
                <Heading size="lg">Domestic Shipping Rates</Heading>
              </HStack>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Shipping Method</Th>
                    <Th>Delivery Time</Th>
                    <Th>Cost</Th>
                    <Th>Free Shipping Over</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {domesticRates.map((rate, index) => (
                    <Tr key={index}>
                      <Td fontWeight="bold">{rate.method}</Td>
                      <Td>{rate.time}</Td>
                      <Td>
                        <Badge colorScheme="green" fontSize="md">
                          {rate.cost}
                        </Badge>
                      </Td>
                      <Td>{rate.threshold}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </MotionBox>

          {/* International Shipping */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
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
              <HStack mb={6}>
                <Icon as={FiGlobe} boxSize={6} color="purple.500" />
                <Heading size="lg">International Shipping</Heading>
              </HStack>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Destination</Th>
                    <Th>Delivery Time</Th>
                    <Th>Starting Cost</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {internationalZones.map((zone, index) => (
                    <Tr key={index}>
                      <Td fontWeight="bold">{zone.zone}</Td>
                      <Td>{zone.time}</Td>
                      <Td>
                        <Badge colorScheme="purple" fontSize="md">
                          {zone.cost}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Text mt={4} fontSize="sm" color="gray.600">
                * International shipping rates may vary based on weight, dimensions, and customs fees
              </Text>
            </Box>
          </MotionBox>

          {/* FAQ */}
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
              <HStack mb={6}>
                <Icon as={FiDollarSign} boxSize={6} color="green.500" />
                <Heading size="lg">Frequently Asked Questions</Heading>
              </HStack>
              <Accordion allowMultiple>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left" fontWeight="bold">
                        Do you offer free shipping?
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    Yes! We offer free standard shipping on all domestic orders over $50.
                    Express shipping is free on orders over $100, and overnight shipping is
                    free on orders over $150.
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left" fontWeight="bold">
                        Can I change my shipping address after placing an order?
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    You can change your shipping address within 24 hours of placing your
                    order by contacting our customer support team. After that, we cannot
                    guarantee the change will be processed in time.
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left" fontWeight="bold">
                        What if my package is lost or damaged?
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    All our shipments are fully insured. If your package is lost or arrives
                    damaged, please contact us immediately. We'll work with the carrier to
                    resolve the issue and send you a replacement or refund.
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left" fontWeight="bold">
                        Do you ship to PO boxes?
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    Yes, we can ship to PO boxes for standard shipping only. Express and
                    overnight shipping require a physical address.
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Box>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
}
