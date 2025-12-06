import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  useColorModeValue,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Button,
  Divider,
  Select,
  Textarea,
  useToast,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useSettingsStore from "../../Store/settings";

export default function AdminSettings() {
  const bg = useColorModeValue("white", "gray.800");
  const toast = useToast();

  const { settings, loading, fetchSettings, updateStoreInfo, updateGeneralSettings, updatePaymentSettings, updateShippingSettings } = useSettingsStore();

  // Local state for form data
  const [storeInfo, setStoreInfo] = useState({
    storeName: "",
    storeEmail: "",
    storePhone: "",
    storeAddress: "",
  });

  const [generalSettings, setGeneralSettings] = useState({
    enableNotifications: true,
    maintenanceMode: false,
    allowGuestCheckout: true,
    currency: "USD",
    timezone: "UTC",
  });

  const [paymentSettings, setPaymentSettings] = useState({
    enableStripe: false,
    enablePaypal: false,
    enableCOD: true,
    taxRate: 0,
  });

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 50,
    standardShippingFee: 5.99,
    expressShippingFee: 12.99,
    enableInternationalShipping: false,
  });

  // Load settings on component mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Update local state when settings are loaded
  useEffect(() => {
    if (settings) {
      setStoreInfo({
        storeName: settings.storeInfo?.storeName || "",
        storeEmail: settings.storeInfo?.storeEmail || "",
        storePhone: settings.storeInfo?.storePhone || "",
        storeAddress: settings.storeInfo?.storeAddress || "",
      });

      setGeneralSettings({
        enableNotifications: settings.general?.enableNotifications ?? true,
        maintenanceMode: settings.general?.maintenanceMode ?? false,
        allowGuestCheckout: settings.general?.allowGuestCheckout ?? true,
        currency: settings.general?.currency || "USD",
        timezone: settings.general?.timezone || "UTC",
      });

      setPaymentSettings({
        enableStripe: settings.payment?.enableStripe ?? false,
        enablePaypal: settings.payment?.enablePaypal ?? false,
        enableCOD: settings.payment?.enableCOD ?? true,
        taxRate: settings.payment?.taxRate || 0,
      });

      setShippingSettings({
        freeShippingThreshold: settings.shipping?.freeShippingThreshold || 50,
        standardShippingFee: settings.shipping?.standardShippingFee || 5.99,
        expressShippingFee: settings.shipping?.expressShippingFee || 12.99,
        enableInternationalShipping: settings.shipping?.enableInternationalShipping ?? false,
      });
    }
  }, [settings]);

  // Handle save store info
  const handleSaveStoreInfo = async () => {
    const result = await updateStoreInfo(storeInfo);
    toast({
      title: result.success ? "Success" : "Error",
      description: result.message,
      status: result.success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle save general settings
  const handleSaveGeneralSettings = async () => {
    const result = await updateGeneralSettings(generalSettings);
    toast({
      title: result.success ? "Success" : "Error",
      description: result.message,
      status: result.success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle save payment settings
  const handleSavePaymentSettings = async () => {
    const result = await updatePaymentSettings(paymentSettings);
    toast({
      title: result.success ? "Success" : "Error",
      description: result.message,
      status: result.success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle save shipping settings
  const handleSaveShippingSettings = async () => {
    const result = await updateShippingSettings(shippingSettings);
    toast({
      title: result.success ? "Success" : "Error",
      description: result.message,
      status: result.success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  if (loading && !settings) {
    return (
      <Center h="400px">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={6}>
        <Heading size="lg" mb={2}>
          Settings
        </Heading>
        <Text color="gray.500">
          Configure your store settings and preferences
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Store Information */}
        <Box
          bg={bg}
          p={6}
          borderRadius="lg"
          boxShadow="md"
          borderWidth="1px"
          borderColor={useColorModeValue("gray.200", "gray.700")}
        >
          <Heading size="md" mb={4}>
            Store Information
          </Heading>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Store Name</FormLabel>
              <Input 
                placeholder="Product Store" 
                value={storeInfo.storeName}
                onChange={(e) => setStoreInfo({ ...storeInfo, storeName: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Store Email</FormLabel>
              <Input 
                type="email" 
                placeholder="store@example.com" 
                value={storeInfo.storeEmail}
                onChange={(e) => setStoreInfo({ ...storeInfo, storeEmail: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Store Phone</FormLabel>
              <Input 
                placeholder="+1 234-567-8900" 
                value={storeInfo.storePhone}
                onChange={(e) => setStoreInfo({ ...storeInfo, storePhone: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Store Address</FormLabel>
              <Textarea 
                placeholder="Enter your store address" 
                rows={3} 
                value={storeInfo.storeAddress}
                onChange={(e) => setStoreInfo({ ...storeInfo, storeAddress: e.target.value })}
              />
            </FormControl>
            <Button 
              colorScheme="blue" 
              onClick={handleSaveStoreInfo}
              isLoading={loading}
            >
              Save Changes
            </Button>
          </VStack>
        </Box>

        {/* General Settings */}
        <Box
          bg={bg}
          p={6}
          borderRadius="lg"
          boxShadow="md"
          borderWidth="1px"
          borderColor={useColorModeValue("gray.200", "gray.700")}
        >
          <Heading size="md" mb={4}>
            General Settings
          </Heading>
          <VStack spacing={4} align="stretch">
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel mb={0}>Enable Notifications</FormLabel>
              <Switch 
                colorScheme="blue" 
                isChecked={generalSettings.enableNotifications}
                onChange={(e) => setGeneralSettings({ ...generalSettings, enableNotifications: e.target.checked })}
              />
            </FormControl>
            <Divider />
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel mb={0}>Maintenance Mode</FormLabel>
              <Switch 
                colorScheme="red" 
                isChecked={generalSettings.maintenanceMode}
                onChange={(e) => setGeneralSettings({ ...generalSettings, maintenanceMode: e.target.checked })}
              />
            </FormControl>
            <Divider />
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel mb={0}>Allow Guest Checkout</FormLabel>
              <Switch 
                colorScheme="blue" 
                isChecked={generalSettings.allowGuestCheckout}
                onChange={(e) => setGeneralSettings({ ...generalSettings, allowGuestCheckout: e.target.checked })}
              />
            </FormControl>
            <Divider />
            <FormControl>
              <FormLabel>Currency</FormLabel>
              <Select 
                value={generalSettings.currency}
                onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="PKR">PKR (₨)</option>
                <option value="INR">INR (₹)</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Timezone</FormLabel>
              <Select 
                value={generalSettings.timezone}
                onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
              >
                <option value="UTC">UTC</option>
                <option value="EST">EST</option>
                <option value="PST">PST</option>
                <option value="GMT">GMT</option>
                <option value="IST">IST</option>
                <option value="PKT">PKT</option>
              </Select>
            </FormControl>
            <Button 
              colorScheme="blue" 
              onClick={handleSaveGeneralSettings}
              isLoading={loading}
            >
              Save General Settings
            </Button>
          </VStack>
        </Box>

        {/* Payment Settings */}
        <Box
          bg={bg}
          p={6}
          borderRadius="lg"
          boxShadow="md"
          borderWidth="1px"
          borderColor={useColorModeValue("gray.200", "gray.700")}
        >
          <Heading size="md" mb={4}>
            Payment Settings
          </Heading>
          <VStack spacing={4} align="stretch">
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel mb={0}>Enable Stripe</FormLabel>
              <Switch 
                colorScheme="blue" 
                isChecked={paymentSettings.enableStripe}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, enableStripe: e.target.checked })}
              />
            </FormControl>
            <Divider />
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel mb={0}>Enable PayPal</FormLabel>
              <Switch 
                colorScheme="blue" 
                isChecked={paymentSettings.enablePaypal}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, enablePaypal: e.target.checked })}
              />
            </FormControl>
            <Divider />
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel mb={0}>Enable Cash on Delivery</FormLabel>
              <Switch 
                colorScheme="blue" 
                isChecked={paymentSettings.enableCOD}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, enableCOD: e.target.checked })}
              />
            </FormControl>
            <Divider />
            <FormControl>
              <FormLabel>Tax Rate (%)</FormLabel>
              <Input 
                type="number" 
                placeholder="8.5" 
                value={paymentSettings.taxRate}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, taxRate: parseFloat(e.target.value) || 0 })}
              />
            </FormControl>
            <Button 
              colorScheme="blue" 
              onClick={handleSavePaymentSettings}
              isLoading={loading}
            >
              Save Payment Settings
            </Button>
          </VStack>
        </Box>

        {/* Shipping Settings */}
        <Box
          bg={bg}
          p={6}
          borderRadius="lg"
          boxShadow="md"
          borderWidth="1px"
          borderColor={useColorModeValue("gray.200", "gray.700")}
        >
          <Heading size="md" mb={4}>
            Shipping Settings
          </Heading>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Free Shipping Threshold ($)</FormLabel>
              <Input 
                type="number" 
                placeholder="50" 
                value={shippingSettings.freeShippingThreshold}
                onChange={(e) => setShippingSettings({ ...shippingSettings, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Standard Shipping Fee ($)</FormLabel>
              <Input 
                type="number" 
                placeholder="5.99" 
                value={shippingSettings.standardShippingFee}
                onChange={(e) => setShippingSettings({ ...shippingSettings, standardShippingFee: parseFloat(e.target.value) || 0 })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Express Shipping Fee ($)</FormLabel>
              <Input 
                type="number" 
                placeholder="12.99" 
                value={shippingSettings.expressShippingFee}
                onChange={(e) => setShippingSettings({ ...shippingSettings, expressShippingFee: parseFloat(e.target.value) || 0 })}
              />
            </FormControl>
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel mb={0}>Enable International Shipping</FormLabel>
              <Switch 
                colorScheme="blue" 
                isChecked={shippingSettings.enableInternationalShipping}
                onChange={(e) => setShippingSettings({ ...shippingSettings, enableInternationalShipping: e.target.checked })}
              />
            </FormControl>
            <Button 
              colorScheme="blue" 
              onClick={handleSaveShippingSettings}
              isLoading={loading}
            >
              Save Shipping Settings
            </Button>
          </VStack>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
