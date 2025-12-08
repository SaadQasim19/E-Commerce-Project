import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  VStack,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../Store/cart';
import CartReview from '../Components/Checkout/CartReview';
import ShippingForm from '../Components/Checkout/ShippingForm';
import PaymentForm from '../Components/Checkout/PaymentForm';
import OrderSummary from '../Components/Checkout/OrderSummary';

const steps = [
  { title: 'Cart', description: 'Review Items' },
  { title: 'Shipping', description: 'Delivery Address' },
  { title: 'Payment', description: 'Payment Method' },
  { title: 'Confirm', description: 'Place Order' },
];

const CheckoutPage = () => {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const navigate = useNavigate();
  const toast = useToast();
  const { cartItems: items, getTotalPrice, clearCart } = useCartStore();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'card',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Check if cart is empty
  if (items.length === 0 && activeStep === 0) {
    return (
      <Container maxW="container.md" py={20}>
        <VStack spacing={6}>
          <Heading size="lg">Your Cart is Empty</Heading>
          <Text color="gray.500">Add some products to your cart before checking out</Text>
          <Button colorScheme="cyan" onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </VStack>
      </Container>
    );
  }

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      // Prepare order data
      const orderData = {
        items: items.map((item) => ({
          product: item._id || item.externalId, // Handle both manual and external products
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          source: item.source || 'manual', // Include source field
        })),
        shippingInfo,
        paymentInfo: {
          method: paymentInfo.paymentMethod,
          // In production, never send full card details to backend
          // Use payment gateway tokens instead
          lastFourDigits: paymentInfo.cardNumber.slice(-4),
        },
        totalAmount: getTotalPrice() + 10 + (getTotalPrice() * 0.1), // Add shipping and tax
        status: 'pending',
        orderDate: new Date().toISOString(),
      };

      // Send order to backend
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      // Clear cart after successful order
      clearCart();

      // Show success message
      toast({
        title: 'Order Placed Successfully!',
        description: `Your order #${data.order._id} has been confirmed.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Navigate to order confirmation
      navigate(`/order-confirmation/${data.order._id}`, {
        state: { order: data.order },
      });
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Order Failed',
        description: error.message || 'Something went wrong. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return items.length > 0;
      case 1:
        return (
          shippingInfo.fullName &&
          shippingInfo.email &&
          shippingInfo.phone &&
          shippingInfo.address &&
          shippingInfo.city &&
          shippingInfo.postalCode &&
          shippingInfo.country
        );
      case 2:
        return (
          paymentInfo.cardNumber.length === 16 &&
          paymentInfo.cardName &&
          paymentInfo.expiryDate &&
          paymentInfo.cvv.length === 3
        );
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="xl" mb={2}>
            Checkout
          </Heading>
          <Text color="gray.500">Complete your purchase in just a few steps</Text>
        </Box>

        {/* Stepper */}
        <Stepper index={activeStep} colorScheme="cyan">
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

        {/* Content */}
        <Box>
          {activeStep === 0 && <CartReview />}
          {activeStep === 1 && (
            <ShippingForm shippingInfo={shippingInfo} setShippingInfo={setShippingInfo} />
          )}
          {activeStep === 2 && (
            <PaymentForm paymentInfo={paymentInfo} setPaymentInfo={setPaymentInfo} />
          )}
          {activeStep === 3 && (
            <OrderSummary
              shippingInfo={shippingInfo}
              paymentInfo={paymentInfo}
              items={items}
              subtotal={getTotalPrice()}
            />
          )}
        </Box>

        {/* Navigation Buttons */}
        <HStack justify="space-between">
          <Button
            onClick={handleBack}
            isDisabled={activeStep === 0}
            variant="ghost"
            colorScheme="gray"
          >
            Back
          </Button>

          <HStack>
            <Button variant="outline" onClick={() => navigate('/')}>
              Continue Shopping
            </Button>

            {activeStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                colorScheme="cyan"
                isDisabled={!isStepValid()}
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handlePlaceOrder}
                colorScheme="green"
                isLoading={isProcessing}
                loadingText="Processing..."
                isDisabled={!isStepValid()}
              >
                Place Order
              </Button>
            )}
          </HStack>
        </HStack>
      </VStack>
    </Container>
  );
};

export default CheckoutPage;
