import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  useColorModeValue,
  FormControl,
  FormLabel,
  Input,
  Button,
  Divider,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Icon,
  Spinner,
  Center,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  InputGroup,
  InputRightElement,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiShield, 
  FiSave, 
  FiLock,
  FiEye,
  FiEyeOff,
  FiCalendar,
  FiCheckCircle,
  FiAlertTriangle,
  FiTrash2
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AvatarUpload from "../Components/AvatarUpload";
import useAuthStore from "../Store/auth";

export default function UserProfile() {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const toast = useToast();
  const navigate = useNavigate();

  const { user, checkAuth, updateProfile, updatePassword, deleteAccount } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Password change state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        await checkAuth();
      }
      setInitialLoading(false);
    };

    loadUserData();
  }, []);

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  // Handle avatar upload success
  const handleAvatarUpload = async (newAvatarUrl) => {
    await checkAuth();
    toast({
      title: "Success!",
      description: "Profile picture updated successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: "Success!",
          description: "Profile updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        await checkAuth();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setPasswordLoading(true);

    try {
      const result = await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (result.success) {
        toast({
          title: "Success!",
          description: "Password changed successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Reset form and close modal
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        onClose();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast({
        title: "Error",
        description: "Please enter your password to confirm",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setDeleteLoading(true);

    try {
      const result = await deleteAccount(deletePassword);

      if (result.success) {
        toast({
          title: "Account Deleted",
          description: "Your account has been permanently deleted",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Close modal and redirect to home
        setShowDeleteModal(false);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete account",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Center h="400px">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (!user) {
    return (
      <Container maxW="container.lg" py={8}>
        <Card bg={bg}>
          <CardBody>
            <VStack spacing={4}>
              <Text>Unable to load user data. Please try logging in again.</Text>
              <Button colorScheme="blue" onClick={() => window.location.href = '/login'}>
                Go to Login
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")} py={8}>
      <Container maxW="container.xl">
        {/* Header */}
        <Box mb={8}>
          <HStack justify="space-between" align="center" mb={2}>
            <Box>
              <Heading size="xl" mb={2}>
                My Account
              </Heading>
              <Text color="gray.500" fontSize="lg">
                Manage your profile and account settings
              </Text>
            </Box>
            <Badge colorScheme="green" fontSize="md" px={4} py={2} rounded="full">
              <HStack spacing={2}>
                <Icon as={FiCheckCircle} />
                <Text>Active</Text>
              </HStack>
            </Badge>
          </HStack>
        </Box>

        <Tabs colorScheme="blue" variant="enclosed">
          <TabList>
            <Tab>Profile Information</Tab>
            <Tab>Security</Tab>
            <Tab>Account Details</Tab>
          </TabList>

          <TabPanels>
            {/* Profile Information Tab */}
            <TabPanel>
              <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
                {/* Profile Picture Section */}
                <Card bg={bg} shadow="md" borderColor={borderColor} borderWidth="1px">
                  <CardHeader>
                    <Heading size="md">Profile Picture</Heading>
                  </CardHeader>
                  <CardBody>
                    <AvatarUpload
                      currentAvatar={user.avatar}
                      onUploadSuccess={handleAvatarUpload}
                      userName={user.name}
                    />
                    <Text fontSize="sm" color="gray.500" mt={4} textAlign="center">
                      JPG, PNG or GIF. Max size 5MB
                    </Text>
                  </CardBody>
                </Card>

                {/* Personal Information */}
                <Card bg={bg} shadow="md" borderColor={borderColor} borderWidth="1px" gridColumn={{ base: "1", lg: "2 / 4" }}>
                  <CardHeader>
                    <Heading size="md">Personal Information</Heading>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Update your personal details
                    </Text>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={5}>
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="medium">
                          <HStack>
                            <Icon as={FiUser} />
                            <Text>Full Name</Text>
                          </HStack>
                        </FormLabel>
                        <Input
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          placeholder="Enter your full name"
                          size="lg"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="medium">
                          <HStack>
                            <Icon as={FiMail} />
                            <Text>Email Address</Text>
                          </HStack>
                        </FormLabel>
                        <Input
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          placeholder="Enter your email"
                          type="email"
                          size="lg"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="medium">
                          <HStack>
                            <Icon as={FiPhone} />
                            <Text>Phone Number</Text>
                          </HStack>
                        </FormLabel>
                        <Input
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          placeholder="Enter your phone number"
                          type="tel"
                          size="lg"
                        />
                      </FormControl>

                      <Button
                        colorScheme="blue"
                        size="lg"
                        w="full"
                        leftIcon={<Icon as={FiSave} />}
                        onClick={handleUpdateProfile}
                        isLoading={loading}
                        loadingText="Saving..."
                      >
                        Save Changes
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </TabPanel>

            {/* Security Tab */}
            <TabPanel>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                <Card bg={bg} shadow="md" borderColor={borderColor} borderWidth="1px">
                  <CardHeader>
                    <Heading size="md">Password</Heading>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Change your account password
                    </Text>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Text fontSize="sm" color="gray.600">
                        Keep your account secure by using a strong password
                      </Text>
                      <Button
                        colorScheme="blue"
                        variant="outline"
                        leftIcon={<Icon as={FiLock} />}
                        onClick={onOpen}
                        size="lg"
                      >
                        Change Password
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>

                <Card bg={bg} shadow="md" borderColor={borderColor} borderWidth="1px">
                  <CardHeader>
                    <Heading size="md">Login Security</Heading>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Manage your login credentials
                    </Text>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <HStack justify="space-between">
                        <Text fontSize="sm">Password</Text>
                        <Badge colorScheme="green">Secured</Badge>
                      </HStack>
                      <Divider />
                      <HStack justify="space-between">
                        <Text fontSize="sm">Last Password Change</Text>
                        <Text fontSize="sm" color="gray.500">
                          {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Never'}
                        </Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Danger Zone */}
                <Card 
                  bg={bg} 
                  shadow="md" 
                  borderColor="red.300" 
                  borderWidth="2px"
                  mt={6}
                >
                  <CardHeader bg="red.50" _dark={{ bg: "red.900" }}>
                    <HStack>
                      <Icon as={FiAlertTriangle} color="red.500" boxSize={5} />
                      <Heading size="md" color="red.600" _dark={{ color: "red.300" }}>
                        Danger Zone
                      </Heading>
                    </HStack>
                    <Text fontSize="sm" color="red.600" _dark={{ color: "red.300" }} mt={1}>
                      Irreversible actions - proceed with caution
                    </Text>
                  </CardHeader>
                  <CardBody>
                    <HStack justify="space-between" align="start">
                      <VStack align="start" spacing={1} flex={1}>
                        <Text fontWeight="medium" color="red.600" _dark={{ color: "red.300" }}>
                          Delete Account
                        </Text>
                        <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </Text>
                      </VStack>
                      <Button
                        colorScheme="red"
                        variant="outline"
                        size="sm"
                        leftIcon={<Icon as={FiTrash2} />}
                        onClick={() => setShowDeleteModal(true)}
                        _hover={{ bg: "red.50", _dark: { bg: "red.900" } }}
                      >
                        Delete Account
                      </Button>
                    </HStack>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </TabPanel>

            {/* Account Details Tab */}
            <TabPanel>
              <Card bg={bg} shadow="md" borderColor={borderColor} borderWidth="1px">
                <CardHeader>
                  <Heading size="md">Account Information</Heading>
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    View your account details and status
                  </Text>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between" py={3} borderBottomWidth="1px" borderColor={borderColor}>
                      <HStack>
                        <Icon as={FiShield} color="blue.500" />
                        <Text fontWeight="medium">Account Type</Text>
                      </HStack>
                      <Badge colorScheme="blue" fontSize="sm" px={3} py={1}>
                        {user.role === 'admin' ? 'Administrator' : 'Customer'}
                      </Badge>
                    </HStack>

                    <HStack justify="space-between" py={3} borderBottomWidth="1px" borderColor={borderColor}>
                      <HStack>
                        <Icon as={FiCalendar} color="green.500" />
                        <Text fontWeight="medium">Member Since</Text>
                      </HStack>
                      <Text color="gray.600">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'N/A'}
                      </Text>
                    </HStack>

                    <HStack justify="space-between" py={3} borderBottomWidth="1px" borderColor={borderColor}>
                      <HStack>
                        <Icon as={FiCheckCircle} color="green.500" />
                        <Text fontWeight="medium">Account Status</Text>
                      </HStack>
                      <Badge colorScheme="green" fontSize="sm" px={3} py={1}>
                        Active
                      </Badge>
                    </HStack>

                    <HStack justify="space-between" py={3}>
                      <HStack>
                        <Icon as={FiMail} color="purple.500" />
                        <Text fontWeight="medium">Email Verified</Text>
                      </HStack>
                      <Badge colorScheme="green" fontSize="sm" px={3} py={1}>
                        Verified
                      </Badge>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Change Password Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Change Password</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={5}>
                {/* Current Password */}
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Current Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      size="lg"
                    />
                    <InputRightElement height="full">
                      <IconButton
                        icon={<Icon as={showPasswords.current ? FiEyeOff : FiEye} />}
                        variant="ghost"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        aria-label="Toggle password visibility"
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                {/* New Password */}
                <FormControl isRequired>
                  <FormLabel fontSize="sm">New Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      size="lg"
                    />
                    <InputRightElement height="full">
                      <IconButton
                        icon={<Icon as={showPasswords.new ? FiEyeOff : FiEye} />}
                        variant="ghost"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        aria-label="Toggle password visibility"
                      />
                    </InputRightElement>
                  </InputGroup>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Must be at least 6 characters
                  </Text>
                </FormControl>

                {/* Confirm Password */}
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Confirm New Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                      size="lg"
                    />
                    <InputRightElement height="full">
                      <IconButton
                        icon={<Icon as={showPasswords.confirm ? FiEyeOff : FiEye} />}
                        variant="ghost"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        aria-label="Toggle password visibility"
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <HStack w="full" spacing={3} pt={4}>
                  <Button variant="ghost" onClick={onClose} size="lg" flex={1}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={handlePasswordChange}
                    isLoading={passwordLoading}
                    loadingText="Changing..."
                    size="lg"
                    flex={1}
                  >
                    Change Password
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Delete Account Modal */}
        <Modal 
          isOpen={showDeleteModal} 
          onClose={() => {
            setShowDeleteModal(false);
            setDeletePassword("");
            setShowDeletePassword(false);
          }}
          size="md"
          isCentered
        >
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent>
            <ModalHeader>
              <HStack spacing={2} color="red.500">
                <Icon as={FiAlertTriangle} boxSize={6} />
                <Text>Delete Account</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4} align="stretch">
                <Box 
                  p={4} 
                  bg="red.50" 
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="red.200"
                  _dark={{ bg: "red.900", borderColor: "red.700" }}
                >
                  <VStack spacing={2} align="start">
                    <Text fontWeight="bold" color="red.600" _dark={{ color: "red.300" }}>
                      ⚠️ Warning: This action is permanent
                    </Text>
                    <Text fontSize="sm" color="red.700" _dark={{ color: "red.200" }}>
                      Deleting your account will permanently remove:
                    </Text>
                    <VStack pl={4} spacing={1} align="start" fontSize="sm">
                      <Text>• Your profile and personal information</Text>
                      <Text>• Your order history and reviews</Text>
                      <Text>• All saved data and preferences</Text>
                      <Text>• Profile picture and uploaded content</Text>
                    </VStack>
                    <Text fontSize="sm" fontWeight="bold" color="red.700" _dark={{ color: "red.200" }} mt={2}>
                      This action cannot be undone!
                    </Text>
                  </VStack>
                </Box>

                <FormControl isRequired>
                  <FormLabel>Confirm with your password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showDeletePassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      borderColor="red.300"
                      _focus={{
                        borderColor: "red.500",
                        boxShadow: "0 0 0 1px red.500"
                      }}
                    />
                    <InputRightElement>
                      <IconButton
                        variant="ghost"
                        icon={showDeletePassword ? <FiEyeOff /> : <FiEye />}
                        onClick={() => setShowDeletePassword(!showDeletePassword)}
                        size="sm"
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <HStack w="full" spacing={3} pt={2}>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeletePassword("");
                      setShowDeletePassword(false);
                    }}
                    size="lg" 
                    flex={1}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={handleDeleteAccount}
                    isLoading={deleteLoading}
                    loadingText="Deleting..."
                    size="lg"
                    flex={1}
                    leftIcon={<Icon as={FiTrash2} />}
                  >
                    Delete Forever
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
}
