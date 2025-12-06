import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  Icon,
  HStack,
  Divider,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiFileText, FiCheckCircle } from "react-icons/fi";

const MotionBox = motion.create(Box);

export default function TermsOfService() {
  const bgGradient = useColorModeValue(
    "linear(to-br, gray.50, purple.50)",
    "linear(to-br, gray.900, purple.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const sections = [
    {
      title: "Acceptance of Terms",
      content: [
        "By accessing and using ShopHub, you accept and agree to be bound by these Terms of Service",
        "If you do not agree to these terms, please do not use our services",
        "We reserve the right to modify these terms at any time",
        "Your continued use after changes constitutes acceptance of new terms",
      ],
    },
    {
      title: "Account Registration",
      content: [
        "You must provide accurate and complete information when creating an account",
        "You are responsible for maintaining the security of your account",
        "You must be at least 18 years old to create an account",
        "One person or entity may not maintain more than one account",
        "We reserve the right to suspend or terminate accounts that violate our terms",
      ],
    },
    {
      title: "Product Information",
      content: [
        "We strive to display product information accurately",
        "Colors may vary slightly due to monitor settings",
        "We reserve the right to correct any errors in pricing or descriptions",
        "Product availability is subject to change without notice",
        "We do not guarantee that all products will be available",
      ],
    },
    {
      title: "Orders and Payment",
      content: [
        "All orders are subject to acceptance and availability",
        "We reserve the right to refuse or cancel any order",
        "Prices are subject to change without notice",
        "Payment must be received before order processing",
        "You authorize us to charge your payment method for all purchases",
        "All prices are in USD unless otherwise stated",
      ],
    },
    {
      title: "Shipping and Delivery",
      content: [
        "Delivery times are estimates and not guaranteed",
        "Risk of loss passes to you upon delivery to the carrier",
        "We are not responsible for delays caused by carriers or customs",
        "You must inspect packages upon delivery and report damage immediately",
        "Shipping addresses cannot be changed once an order has shipped",
      ],
    },
    {
      title: "Returns and Refunds",
      content: [
        "Returns must be initiated within 30 days of delivery",
        "Items must be in original condition with tags attached",
        "Some items are non-returnable (clearance, personalized items)",
        "Refunds will be processed to the original payment method",
        "Refunds typically take 5-7 business days to process",
        "Return shipping is free for domestic orders",
      ],
    },
    {
      title: "Intellectual Property",
      content: [
        "All content on ShopHub is protected by copyright and trademark laws",
        "You may not use our content without written permission",
        "Product images and descriptions are property of ShopHub or our suppliers",
        "Our logo, brand name, and trademarks may not be used without authorization",
        "Violation of intellectual property rights may result in legal action",
      ],
    },
    {
      title: "User Conduct",
      content: [
        "You agree not to use our service for any unlawful purpose",
        "You will not attempt to interfere with the proper functioning of the website",
        "You will not upload viruses or malicious code",
        "You will not impersonate others or provide false information",
        "You will not harvest or collect user information",
        "Violation may result in account termination and legal action",
      ],
    },
    {
      title: "Limitation of Liability",
      content: [
        "ShopHub is provided 'as is' without warranties of any kind",
        "We are not liable for indirect, incidental, or consequential damages",
        "Our total liability is limited to the amount you paid for the product",
        "We are not responsible for third-party content or services",
        "Some jurisdictions do not allow limitation of liability",
      ],
    },
    {
      title: "Dispute Resolution",
      content: [
        "Any disputes will be resolved through binding arbitration",
        "You waive the right to participate in class action lawsuits",
        "Arbitration will be conducted in accordance with AAA rules",
        "The arbitrator's decision is final and binding",
        "Each party bears their own legal costs unless otherwise awarded",
      ],
    },
    {
      title: "Governing Law",
      content: [
        "These terms are governed by the laws of the State of New York",
        "Any legal action must be brought in New York courts",
        "You consent to the jurisdiction of New York courts",
        "If any provision is found invalid, the rest remains in effect",
      ],
    },
    {
      title: "Contact Information",
      content: [
        "For questions about these terms, contact us at legal@shophub.com",
        "You may also reach us by phone at +1 (555) 123-4567",
        "Written notices should be sent to: 123 Commerce Street, New York, NY 10001",
      ],
    },
  ];

  return (
    <Box bgGradient={bgGradient} minH="100vh" py={16}>
      <Container maxW="container.lg">
        <VStack spacing={12}>
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            textAlign="center"
          >
            <Icon as={FiFileText} boxSize={16} color="purple.500" mb={4} />
            <Heading
              size="2xl"
              bgGradient="linear(to-r, purple.400, pink.500)"
              bgClip="text"
              mb={4}
            >
              Terms of Service
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Please read these terms carefully before using our service. By using ShopHub,
              you agree to be bound by these terms.
            </Text>
            <Text fontSize="sm" color="gray.500" mt={4}>
              Effective Date: December 1, 2025
            </Text>
          </MotionBox>

          {/* Content */}
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
              <VStack spacing={8} align="stretch">
                {sections.map((section, index) => (
                  <Box key={index}>
                    <Heading size="md" mb={4} color="purple.500">
                      {index + 1}. {section.title}
                    </Heading>
                    <List spacing={2}>
                      {section.content.map((item, itemIndex) => (
                        <ListItem key={itemIndex}>
                          <HStack align="start">
                            <ListIcon as={FiCheckCircle} color="purple.500" mt={1} />
                            <Text color="gray.600">{item}</Text>
                          </HStack>
                        </ListItem>
                      ))}
                    </List>
                    {index < sections.length - 1 && <Divider mt={6} />}
                  </Box>
                ))}
              </VStack>
            </Box>
          </MotionBox>

          {/* Contact */}
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
              textAlign="center"
            >
              <Heading size="lg" mb={4}>
                Questions About These Terms?
              </Heading>
              <Text color="gray.600" mb={6}>
                If you have any questions or concerns about our terms of service, please
                contact our legal team.
              </Text>
              <HStack justify="center" spacing={4}>
                <Text fontWeight="bold">Email:</Text>
                <Text color="purple.500">legal@shophub.com</Text>
              </HStack>
              <HStack justify="center" spacing={4} mt={2}>
                <Text fontWeight="bold">Phone:</Text>
                <Text color="purple.500">+1 (555) 123-4567</Text>
              </HStack>
            </Box>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
}
