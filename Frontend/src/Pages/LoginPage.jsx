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
  InputRightElement,
  IconButton,
  Checkbox,
  HStack,
  Divider,
  useColorModeValue,
  useToast,
  Link as ChakraLink,
  Icon,
  Stack,
} from "@chakra-ui/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FaGoogle, FaFacebookF, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import useAuthStore from "../Store/auth";

const MotionBox = motion(Box);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [searchParams] = useSearchParams();

  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const toast = useToast();

  // Check for OAuth errors in URL
  useEffect(() => {
    const error = searchParams.get('error');
    const message = searchParams.get('message');
    
    if (error) {
      let errorTitle = "Authentication Error";
      let errorMessage = message || "An error occurred during authentication";
      
      if (error.includes('not_configured')) {
        errorTitle = "Feature Not Available";
        errorMessage = decodeURIComponent(message || "This login method is not configured on the server");
      } else if (error.includes('auth_failed')) {
        errorTitle = "Login Failed";
        errorMessage = "Authentication failed. Please try again.";
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      
      // Clean up URL
      navigate('/login', { replace: true });
    }
  }, [searchParams, toast, navigate]);

  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, purple.50, cyan.50)",
    "linear(to-br, gray.900, blue.900, purple.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const result = await login({ email, password });

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
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
            {/* Header */}
            <VStack spacing={1} textAlign="center" w="full">
              <Heading
                size="xl"
                fontWeight="bold"
                color={useColorModeValue("gray.800", "white")}
              >
                Welcome back
              </Heading>
              <Text fontSize="md" color={useColorModeValue("gray.600", "gray.400")}>
                Enter your credentials to continue
              </Text>
            </VStack>

            {/* Login Card */}
            <Box
              w="full"
              bg={cardBg}
              p={8}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              shadow="sm"
            >
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

                  {/* Password Input */}
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                      Password
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FiLock} color="gray.400" boxSize={4} />
                      </InputLeftElement>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        size="lg"
                        focusBorderColor="blue.500"
                        bg={useColorModeValue("white", "gray.700")}
                        borderRadius="lg"
                      />
                      <InputRightElement>
                        <IconButton
                          icon={<Icon as={showPassword ? FiEyeOff : FiEye} />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label="Toggle password visibility"
                          color="gray.500"
                          _hover={{ bg: "transparent", color: "blue.500" }}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  {/* Remember Me & Forgot Password */}
                  <HStack w="full" justify="space-between" pt={1}>
                    <Checkbox
                      colorScheme="blue"
                      size="sm"
                      isChecked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    >
                      <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
                        Remember me
                      </Text>
                    </Checkbox>
                    <ChakraLink
                      as={Link}
                      to="/forgot-password"
                      fontSize="sm"
                      fontWeight="medium"
                      color="blue.500"
                      _hover={{ color: "blue.600", textDecor: "none" }}
                    >
                      Forgot password?
                    </ChakraLink>
                  </HStack>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    size="lg"
                    w="full"
                    colorScheme="blue"
                    isLoading={isLoading}
                    loadingText="Signing in..."
                    _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
                    transition="all 0.2s"
                    mt={2}
                  >
                    Sign in
                  </Button>

                  {/* Divider */}
                  <HStack w="full" py={2}>
                    <Divider />
                    <Text fontSize="xs" color="gray.500" whiteSpace="nowrap" px={2}>
                      or continue with
                    </Text>
                    <Divider />
                  </HStack>

                  {/* Social Login Buttons */}
                  <VStack w="full" spacing={3}>
                    {/* Google Sign In */}
                    <Button
                      w="full"
                      variant="outline"
                      leftIcon={<Icon as={FaGoogle} color="#EA4335" boxSize={5} />}
                      size="lg"
                      _hover={{ bg: useColorModeValue("gray.50", "gray.700"), transform: "translateY(-1px)", boxShadow: "md" }}
                      transition="all 0.2s"
                      onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
                      borderColor={useColorModeValue("gray.300", "gray.600")}
                    >
                      Continue with Google
                    </Button>

                    {/* Facebook & GitHub Sign In */}
                    <HStack w="full" spacing={3}>
                      <Button
                        flex={1}
                        variant="outline"
                        leftIcon={<Icon as={FaFacebookF} color="#1877F2" boxSize={5} />}
                        size="lg"
                        _hover={{ bg: useColorModeValue("gray.50", "gray.700"), transform: "translateY(-1px)", boxShadow: "md" }}
                        transition="all 0.2s"
                        onClick={() => window.location.href = 'http://localhost:5000/api/auth/facebook'}
                        borderColor={useColorModeValue("gray.300", "gray.600")}
                      >
                        Facebook
                      </Button>
                      <Button
                        flex={1}
                        variant="outline"
                        leftIcon={<Icon as={FaGithub} boxSize={5} />}
                        size="lg"
                        _hover={{ bg: useColorModeValue("gray.50", "gray.700"), transform: "translateY(-1px)", boxShadow: "md" }}
                        transition="all 0.2s"
                        onClick={() => window.location.href = 'http://localhost:5000/api/auth/github'}
                        borderColor={useColorModeValue("gray.300", "gray.600")}
                      >
                        GitHub
                      </Button>
                    </HStack>
                  </VStack>
                </VStack>
              </form>
            </Box>

            {/* Signup Link */}
            <HStack spacing={1} fontSize="sm">
              <Text color={useColorModeValue("gray.600", "gray.400")}>
                Don't have an account?
              </Text>
              <ChakraLink
                as={Link}
                to="/signup"
                color="blue.500"
                fontWeight="semibold"
                _hover={{ color: "blue.600", textDecor: "none" }}
              >
                Sign up
              </ChakraLink>
            </HStack>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
}
