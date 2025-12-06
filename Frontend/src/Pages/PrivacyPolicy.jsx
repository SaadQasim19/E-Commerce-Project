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
import { FiShield, FiCheckCircle } from "react-icons/fi";

const MotionBox = motion.create(Box);

export default function PrivacyPolicy() {
  const bgGradient = useColorModeValue(
    "linear(to-br, gray.50, blue.50)",
    "linear(to-br, gray.900, blue.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const sections = [
    {
      title: "Information We Collect",
      content: [
        "Personal identification information (Name, email address, phone number, etc.)",
        "Billing and shipping addresses",
        "Payment information (processed securely through our payment providers)",
        "Order history and preferences",
        "Device and browser information",
        "Cookies and tracking data for analytics",
      ],
    },
    {
      title: "How We Use Your Information",
      content: [
        "Process and fulfill your orders",
        "Communicate with you about your orders and account",
        "Send promotional emails (you can opt-out anytime)",
        "Improve our website and customer experience",
        "Detect and prevent fraud",
        "Comply with legal obligations",
      ],
    },
    {
      title: "Information Sharing",
      content: [
        "We do not sell your personal information to third parties",
        "We share data with service providers (shipping, payment processing)",
        "We may disclose information if required by law",
        "We share anonymized data for analytics purposes",
        "With your consent, we may share data with marketing partners",
      ],
    },
    {
      title: "Data Security",
      content: [
        "Industry-standard SSL encryption for all data transmission",
        "Secure servers with regular security audits",
        "PCI-DSS compliance for payment processing",
        "Limited employee access to personal information",
        "Regular security updates and monitoring",
        "Incident response plan in case of data breaches",
      ],
    },
    {
      title: "Your Rights",
      content: [
        "Access your personal data at any time",
        "Request correction of inaccurate information",
        "Request deletion of your account and data",
        "Opt-out of marketing communications",
        "Object to data processing in certain circumstances",
        "Data portability - receive your data in a structured format",
      ],
    },
    {
      title: "Cookies and Tracking",
      content: [
        "We use cookies to improve your experience",
        "Essential cookies for website functionality",
        "Analytics cookies to understand user behavior",
        "Marketing cookies for targeted advertising",
        "You can control cookies through your browser settings",
        "Some features may not work without cookies enabled",
      ],
    },
    {
      title: "Third-Party Services",
      content: [
        "We use Google Analytics for website analytics",
        "Payment processing through Stripe and PayPal",
        "Shipping services (FedEx, UPS, USPS)",
        "Email service providers for communications",
        "Social media integration (Facebook, Instagram, Twitter)",
        "Each service has its own privacy policy",
      ],
    },
    {
      title: "Children's Privacy",
      content: [
        "Our website is not intended for children under 13",
        "We do not knowingly collect data from children",
        "If you believe we have data from a child, contact us immediately",
        "Parents can request deletion of their child's information",
      ],
    },
    {
      title: "International Users",
      content: [
        "We comply with GDPR for EU users",
        "We comply with CCPA for California residents",
        "Data may be transferred and stored in the United States",
        "We ensure adequate protection for international data transfers",
        "Different regions may have additional rights",
      ],
    },
    {
      title: "Policy Updates",
      content: [
        "We may update this privacy policy periodically",
        "We'll notify you of significant changes via email",
        "Last updated: December 2025",
        "Your continued use after changes constitutes acceptance",
        "Review this policy regularly for updates",
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
            <Icon as={FiShield} boxSize={16} color="blue.500" mb={4} />
            <Heading
              size="2xl"
              bgGradient="linear(to-r, blue.400, cyan.500)"
              bgClip="text"
              mb={4}
            >
              Privacy Policy
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Your privacy is important to us. This policy explains how we collect, use,
              and protect your personal information.
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
                    <Heading size="md" mb={4} color="blue.500">
                      {index + 1}. {section.title}
                    </Heading>
                    <List spacing={2}>
                      {section.content.map((item, itemIndex) => (
                        <ListItem key={itemIndex}>
                          <HStack align="start">
                            <ListIcon as={FiCheckCircle} color="blue.500" mt={1} />
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
                Questions About Privacy?
              </Heading>
              <Text color="gray.600" mb={6}>
                If you have any questions or concerns about our privacy policy, please
                don't hesitate to contact us.
              </Text>
              <HStack justify="center" spacing={4}>
                <Text fontWeight="bold">Email:</Text>
                <Text color="blue.500">privacy@shophub.com</Text>
              </HStack>
              <HStack justify="center" spacing={4} mt={2}>
                <Text fontWeight="bold">Phone:</Text>
                <Text color="blue.500">+1 (555) 123-4567</Text>
              </HStack>
            </Box>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
}
