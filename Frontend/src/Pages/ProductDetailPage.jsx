import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Container,
  Box,
  Image,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  Grid,
  GridItem,
  useColorModeValue,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  IconButton,
  Badge,
  SimpleGrid,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { ChevronRightIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";
import ProductStore from "../Store/product";
import useCartStore from "../Store/cart";
import ProductCard from "../Components/ProductCard";
import ReviewForm from "../Components/Reviews/ReviewForm";
import ReviewsList from "../Components/Reviews/ReviewsList";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { oldProduct, fetchProducts } = ProductStore();
  const { addToCart, updateQuantity, getItemQuantity, isInCart } = useCartStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewRefresh, setReviewRefresh] = useState(0);

  // Check if user is authenticated as admin
  const isAdminAuthenticated = localStorage.getItem("adminAuthenticated") === "true";

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    // Fetch products if not already loaded
    if (oldProduct.length === 0) {
      fetchProducts();
    }
  }, [oldProduct.length, fetchProducts]);

  useEffect(() => {
    // Find the product by ID
    if (oldProduct.length > 0) {
      const foundProduct = oldProduct.find((p) => p._id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        // Set initial quantity to cart quantity if already in cart
        const cartQty = getItemQuantity(id);
        if (cartQty > 0) {
          setQuantity(cartQty);
        }
      } else {
        toast({
          title: "Product not found",
          description: "The product you're looking for doesn't exist.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate("/");
      }
      setLoading(false);
    }
  }, [id, oldProduct, navigate, toast, getItemQuantity]);

  const handleAddToCart = () => {
    if (isInCart(product._id)) {
      // Update quantity if already in cart
      updateQuantity(product._id, quantity);
      toast({
        title: "Cart Updated",
        description: `Quantity updated to ${quantity}`,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-right",
      });
    } else {
      // Add to cart
      addToCart(product);
      // Update to desired quantity if more than 1
      if (quantity > 1) {
        updateQuantity(product._id, quantity);
      }
      toast({
        title: "Added to Cart",
        description: `${product.name} added to your cart`,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Get related products (exclude current product)
  const relatedProducts = oldProduct
    .filter((p) => p._id !== id)
    .slice(0, 4);

  if (loading) {
    return (
      <Container maxW="container.xl" py={12}>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={10}>
          <GridItem>
            <Skeleton height="500px" borderRadius="lg" />
          </GridItem>
          <GridItem>
            <VStack align="stretch" spacing={6}>
              <SkeletonText noOfLines={2} spacing={4} />
              <SkeletonText noOfLines={4} spacing={3} />
              <Skeleton height="60px" />
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    );
  }

  if (!product) return null;

  return (
    <Container maxW="container.xl" py={8}>
      {/* Breadcrumb Navigation */}
      <HStack mb={6} spacing={4}>
        <IconButton
          icon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          variant="ghost"
          aria-label="Go back"
        />
        <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/">
              Products
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{product.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </HStack>

      {/* Product Details Grid */}
      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
        gap={10}
        bg={bg}
        p={{ base: 4, md: 8 }}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={borderColor}
        shadow="lg"
      >
        {/* Product Image */}
        <GridItem>
          <Box
            position="relative"
            borderRadius="lg"
            overflow="hidden"
            bg={useColorModeValue("gray.100", "gray.700")}
          >
            <Image
              src={product.image}
              alt={product.name}
              w="100%"
              h={{ base: "300px", md: "500px" }}
              objectFit="cover"
            />
            {isInCart(product._id) && (
              <Badge
                position="absolute"
                top={4}
                right={4}
                colorScheme="green"
                fontSize="md"
                px={3}
                py={1}
                borderRadius="full"
              >
                In Cart
              </Badge>
            )}
          </Box>
        </GridItem>

        {/* Product Info */}
        <GridItem>
          <VStack align="stretch" spacing={6} h="full">
            {/* Title and Price */}
            <Box>
              <Heading as="h1" size="xl" mb={4}>
                {product.name}
              </Heading>
              <Text fontSize="3xl" fontWeight="bold" color="green.500">
                ${product.price}
              </Text>
            </Box>

            <Divider />

            {/* Description Section */}
            <Box>
              <Text fontWeight="semibold" fontSize="lg" mb={2}>
                Product Description
              </Text>
              <Text color={useColorModeValue("gray.600", "gray.400")}>
                This is a high-quality product available in our store. Perfect for your needs
                with excellent value for money. Get it now before it's gone!
              </Text>
            </Box>

            {/* Product Details */}
            <Box>
              <Text fontWeight="semibold" fontSize="lg" mb={2}>
                Product Details
              </Text>
              <VStack align="stretch" spacing={2}>
                <HStack justify="space-between">
                  <Text color={useColorModeValue("gray.600", "gray.400")}>Product ID:</Text>
                  <Text fontWeight="medium">{product._id.slice(-8)}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color={useColorModeValue("gray.600", "gray.400")}>Availability:</Text>
                  <Badge colorScheme="green">In Stock</Badge>
                </HStack>
              </VStack>
            </Box>

            <Divider />

            {/* Quantity Selector - Hidden for Admin */}
            {!isAdminAuthenticated && (
              <Box>
                <Text fontWeight="semibold" mb={3}>
                  Quantity
                </Text>
                <HStack spacing={4}>
                  <HStack>
                    <IconButton
                      icon={<FiMinus />}
                      onClick={decreaseQuantity}
                      size="md"
                      variant="outline"
                      aria-label="Decrease quantity"
                    />
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      minW="60px"
                      textAlign="center"
                      px={4}
                      py={2}
                      borderWidth="1px"
                      borderColor={borderColor}
                      borderRadius="md"
                    >
                      {quantity}
                    </Text>
                    <IconButton
                      icon={<FiPlus />}
                      onClick={increaseQuantity}
                      size="md"
                      variant="outline"
                      aria-label="Increase quantity"
                    />
                  </HStack>
                  <Text color={useColorModeValue("gray.600", "gray.400")}>
                    Subtotal: <Text as="span" fontWeight="bold" color="green.500">
                      ${(product.price * quantity).toFixed(2)}
                    </Text>
                  </Text>
                </HStack>
              </Box>
            )}

            {/* Add to Cart Button - Hidden for Admin */}
            {!isAdminAuthenticated && (
              <Button
                leftIcon={<FiShoppingCart />}
                colorScheme={isInCart(product._id) ? "green" : "blue"}
                size="lg"
                fontSize="md"
                onClick={handleAddToCart}
                w="full"
                py={6}
              >
                {isInCart(product._id) ? "Update Cart" : "Add to Cart"}
              </Button>
            )}
            
            {/* Admin Notice */}
            {isAdminAuthenticated && (
              <Box
                p={4}
                bg={useColorModeValue("blue.50", "blue.900")}
                borderRadius="md"
                textAlign="center"
              >
                <Text color={useColorModeValue("blue.700", "blue.200")} fontWeight="medium">
                  👨‍💼 Admin View Mode - Cart features disabled
                </Text>
              </Box>
            )}
          </VStack>
        </GridItem>
      </Grid>

      {/* Reviews Section */}
      <Box mt={16}>
        <Heading size="lg" mb={6}>
          Customer Reviews
        </Heading>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8}>
          {/* Review Form */}
          <GridItem>
            <ReviewForm
              productId={product._id}
              onReviewSubmitted={() => setReviewRefresh((prev) => prev + 1)}
            />
          </GridItem>

          {/* Reviews List */}
          <GridItem>
            <ReviewsList productId={product._id} refreshTrigger={reviewRefresh} />
          </GridItem>
        </Grid>
      </Box>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <Box mt={16}>
          <Heading size="lg" mb={6}>
            You May Also Like
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct._id} product={relatedProduct} />
            ))}
          </SimpleGrid>
        </Box>
      )}
    </Container>
  );
}
