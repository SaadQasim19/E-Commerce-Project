import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Spinner, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import useAuthStore from "../Store/auth";

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      if (error) {
        console.error("OAuth error:", error);
        navigate("/login?error=" + error);
        return;
      }

      if (token) {
        // Store token
        setToken(token);

        // Fetch user data
        try {
          const response = await fetch("http://localhost:5000/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            navigate("/");
          } else {
            navigate("/login?error=fetch_user_failed");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          navigate("/login?error=fetch_user_failed");
        }
      } else {
        navigate("/login?error=no_token");
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUser, setToken]);

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue("gray.50", "gray.900")}
    >
      <VStack spacing={4}>
        <Spinner size="xl" color="blue.500" thickness="4px" />
        <Text fontSize="lg" color={useColorModeValue("gray.600", "gray.400")}>
          Completing authentication...
        </Text>
      </VStack>
    </Box>
  );
}
