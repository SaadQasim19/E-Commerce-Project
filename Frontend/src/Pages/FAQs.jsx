import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  HStack,
  Badge,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiHelpCircle, FiSearch, FiShoppingCart, FiTruck, FiRefreshCw, FiCreditCard } from "react-icons/fi";
import { useState } from "react";

const MotionBox = motion.create(Box);

export default function FAQs() {
  const [searchQuery, setSearchQuery] = useState("");

  const bgGradient = useColorModeValue(
    "linear(to-br, teal.50, green.50)",
    "linear(to-br, gray.900, teal.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const faqCategories = [
    {
      name: "Orders",
      icon: FiShoppingCart,
      color: "blue",
      faqs: [
        {
          question: "How do I place an order?",
          answer: "To place an order, browse our products, add items to your cart, and proceed to checkout. You'll need to provide shipping information and payment details. Once your order is confirmed, you'll receive an email confirmation with your order number.",
        },
        {
          question: "Can I cancel or modify my order?",
          answer: "You can cancel or modify your order within 24 hours of placing it. After that, if your order hasn't shipped yet, contact our customer support team. Once shipped, you'll need to follow our returns process.",
        },
        {
          question: "How do I track my order?",
          answer: "You can track your order using the order number from your confirmation email. Visit our Track Order page and enter your order number to see real-time tracking information.",
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, and Google Pay. All payments are securely processed through our encrypted payment gateway.",
        },
      ],
    },
    {
      name: "Shipping",
      icon: FiTruck,
      color: "purple",
      faqs: [
        {
          question: "How long does shipping take?",
          answer: "Standard shipping takes 5-7 business days, Express shipping takes 2-3 business days, and Overnight shipping takes 1 business day. International shipping times vary by destination (7-21 days).",
        },
        {
          question: "Do you offer free shipping?",
          answer: "Yes! We offer free standard shipping on orders over $50, free express shipping on orders over $100, and free overnight shipping on orders over $150.",
        },
        {
          question: "Do you ship internationally?",
          answer: "Yes, we ship to over 100 countries worldwide. International shipping rates vary based on destination, weight, and dimensions. Customs fees and import taxes may apply and are the responsibility of the customer.",
        },
        {
          question: "What if my package is lost or damaged?",
          answer: "All shipments are fully insured. If your package is lost or arrives damaged, contact us immediately with photos of any damage. We'll work with the carrier and send a replacement or issue a refund.",
        },
      ],
    },
    {
      name: "Returns",
      icon: FiRefreshCw,
      color: "orange",
      faqs: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy. Items must be unused, unworn, in original condition with all tags attached, and in original packaging. Some items may be non-returnable (clearance items, personalized products).",
        },
        {
          question: "How do I return an item?",
          answer: "Submit a return request on our Returns & Exchanges page. Once approved, you'll receive a prepaid shipping label. Pack the item securely and ship it back. Refunds are processed within 5-7 business days of receiving the item.",
        },
        {
          question: "Do you charge for returns?",
          answer: "No, return shipping is free! We provide a prepaid shipping label for all domestic returns. For international returns, you may need to pay for return shipping.",
        },
        {
          question: "Can I exchange an item instead of returning it?",
          answer: "Yes! If you want a different size or color, return the original item and place a new order. We'll expedite shipping on your new order at no extra cost. Contact customer support for faster exchange processing.",
        },
      ],
    },
    {
      name: "Payment",
      icon: FiCreditCard,
      color: "green",
      faqs: [
        {
          question: "Is my payment information secure?",
          answer: "Yes! We use industry-standard SSL encryption to protect your payment information. We're PCI-DSS compliant and never store your full credit card details on our servers.",
        },
        {
          question: "When will I be charged?",
          answer: "Your payment method will be charged when you place your order. For pre-orders, you'll be charged when the item ships. If your order is cancelled, any charges will be refunded within 3-5 business days.",
        },
        {
          question: "Do you offer payment plans?",
          answer: "Yes! We partner with Affirm and Klarna to offer payment plans on orders over $100. You can choose from various payment plans at checkout with no hidden fees.",
        },
        {
          question: "What if my payment is declined?",
          answer: "Payment declines can happen for various reasons (insufficient funds, incorrect card details, bank security measures). Please verify your payment information and try again. Contact your bank if the issue persists, or try a different payment method.",
        },
      ],
    },
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
            <Icon as={FiHelpCircle} boxSize={16} color="teal.500" mb={4} />
            <Heading
              size="2xl"
              bgGradient="linear(to-r, teal.400, green.500)"
              bgClip="text"
              mb={4}
            >
              Frequently Asked Questions
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Find answers to common questions about orders, shipping, returns, and more
            </Text>
          </MotionBox>

          {/* Search Bar */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            w="full"
            maxW="2xl"
          >
            <InputGroup size="lg">
              <InputLeftElement>
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg={cardBg}
                borderRadius="xl"
                border="2px"
                borderColor={borderColor}
                _focus={{
                  borderColor: "teal.400",
                  boxShadow: "0 0 0 1px teal.400",
                }}
              />
            </InputGroup>
          </MotionBox>

          {/* FAQ Tabs */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
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
              <Tabs variant="soft-rounded" colorScheme="teal">
                <TabList mb={8} flexWrap="wrap" justifyContent="center" gap={2}>
                  {faqCategories.map((category, index) => (
                    <Tab key={index}>
                      <HStack>
                        <Icon as={category.icon} />
                        <Text>{category.name}</Text>
                        <Badge colorScheme={category.color}>
                          {category.faqs.length}
                        </Badge>
                      </HStack>
                    </Tab>
                  ))}
                </TabList>

                <TabPanels>
                  {faqCategories.map((category, categoryIndex) => (
                    <TabPanel key={categoryIndex} p={0}>
                      <Accordion allowMultiple defaultIndex={[0]}>
                        {category.faqs.map((faq, faqIndex) => (
                          <AccordionItem key={faqIndex} border="none" mb={2}>
                            <AccordionButton
                              bg={useColorModeValue("gray.50", "gray.700")}
                              _hover={{
                                bg: useColorModeValue("gray.100", "gray.600"),
                              }}
                              borderRadius="xl"
                              py={4}
                            >
                              <Box flex="1" textAlign="left" fontWeight="bold">
                                {faq.question}
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4} pt={4} px={6}>
                              <Text color="gray.600">{faq.answer}</Text>
                            </AccordionPanel>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            </Box>
          </MotionBox>

          {/* Contact Card */}
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
                Still Have Questions?
              </Heading>
              <Text color="gray.600" mb={6}>
                Can't find what you're looking for? Our customer support team is here to help!
              </Text>
              <HStack justify="center" spacing={4}>
                <Box
                  as="a"
                  href="/contact"
                  px={6}
                  py={3}
                  bgGradient="linear(to-r, teal.400, green.500)"
                  color="white"
                  borderRadius="xl"
                  fontWeight="bold"
                  _hover={{
                    bgGradient: "linear(to-r, teal.500, green.600)",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.3s"
                >
                  Contact Support
                </Box>
                <Box
                  as="a"
                  href="tel:+15551234567"
                  px={6}
                  py={3}
                  border="2px"
                  borderColor="teal.400"
                  color="teal.500"
                  borderRadius="xl"
                  fontWeight="bold"
                  _hover={{
                    bg: "teal.50",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.3s"
                >
                  Call Us
                </Box>
              </HStack>
            </Box>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
}
