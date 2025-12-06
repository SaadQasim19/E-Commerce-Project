import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  useToast,
  Link as ChakraLink,
  Icon,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import useAuthStore from "../Store/auth";

const MotionBox = motion(Box);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const { forgotPassword, isLoading } = useAuthStore();
  const toast = useToast();

  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, purple.50, cyan.50)",
    "linear(to-br, gray.900, blue.900, purple.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const result = await forgotPassword(email);

    if (result.success) {
      setIsSubmitted(true);
      setResetToken(result.resetToken); // In production, this would be sent via email
      toast({
        title: "Success",
        description: result.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error",
        description: result.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      minH="100vh"
      bgGradient={bgGradient}
      display="flex"
      alignItems="center"
      py={12}
      px={4}
    >
      <Container maxW="440px">
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <VStack spacing={8}>
            {/* Back Button */}
            <ChakraLink
              as={Link}
              to="/login"
              display="flex"
              alignItems="center"
              gap={2}
              fontSize="sm"
              color="blue.500"
              fontWeight="medium"
              _hover={{ color: "blue.600", textDecor: "none" }}
              alignSelf="flex-start"
            >
              <Icon as={FiArrowLeft} />
              Back to login
            </ChakraLink>

            {/* Header */}
            <VStack spacing={1} textAlign="center" w="full">
              <Heading
                size="xl"
                fontWeight="bold"
                color={useColorModeValue("gray.800", "white")}
              >
                {isSubmitted ? "Check your email" : "Forgot password?"}
              </Heading>
              <Text fontSize="md" color={useColorModeValue("gray.600", "gray.400")}>
                {isSubmitted
                  ? "We've sent you reset instructions"
                  : "No worries, we'll send you reset instructions"}
              </Text>
            </VStack>

            {/* Forgot Password Card */}
            <Box
              w="full"
              bg={cardBg}
              p={8}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              shadow="sm"
            >
              {!isSubmitted ? (
                <form onSubmit={handleSubmit}>
                  <VStack spacing={5}>
                    {/* Email Input */}
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                        Email
                      </FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FiMail} color="gray.400" boxSize={4} />
                        </InputLeftElement>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          size="lg"
                          focusBorderColor="blue.500"
                          bg={useColorModeValue("white", "gray.700")}
                          borderRadius="lg"
                        />
                      </InputGroup>
                    </FormControl>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      w="full"
                      colorScheme="blue"
                      isLoading={isLoading}
                      loadingText="Sending..."
                      _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
                      transition="all 0.2s"
                      mt={2}
                    >
                      Send reset link
                    </Button>
                  </VStack>
                </form>
              ) : (
                <VStack spacing={5}>
                  {/* Success Message */}
                  <Alert
                    status="success"
                    variant="subtle"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    borderRadius="lg"
                    py={6}
                  >
                    <AlertIcon boxSize="40px" mr={0} />
                    <AlertDescription mt={4} fontSize="sm">
                      We've sent a password reset link to <strong>{email}</strong>.
                      Please check your inbox and follow the instructions.
                    </AlertDescription>
                  </Alert>

                  {/* Development Only - Show Reset Token */}
                  {resetToken && (
                    <Alert
                      status="info"
                      variant="solid"
                      flexDirection="column"
                      alignItems="flex-start"
                      borderRadius="lg"
                      py={4}
                    >
                      <AlertDescription fontSize="xs">
                        <strong>Development Mode:</strong><br />
                        Reset Token: {resetToken}<br />
                        <ChakraLink
                          as={Link}
                          to={`/reset-password/${resetToken}`}
                          textDecor="underline"
                          fontWeight="bold"
                        >
                          Click here to reset password
                        </ChakraLink>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Resend Button */}
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    size="lg"
                    w="full"
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                    }}
                  >
                    Try another email
                  </Button>
                </VStack>
              )}
            </Box>

            {/* Info Text */}
            <Text fontSize="xs" color={useColorModeValue("gray.600", "gray.400")} textAlign="center">
              Didn't receive the email? Check your spam folder or try again.
            </Text>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
}
