import { Container, VStack, Text, SimpleGrid } from "@chakra-ui/react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import ProductStore from "../Store/product";
import ProductCard from "../Components/ProductCard";

export default function HomePage() {
  const fetchProducts = ProductStore((state) => state.fetchProducts);
  const oldProduct = ProductStore((state) => state.oldProduct);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  console.log("Products:", oldProduct);

  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={6}>
        <Text
          fontSize={"30"}
          fontWeight="bold"
          bgGradient="linear(to-r, cyan.400, blue.500)"
          textAlign="center"
          bgClip="text"
        >
          Welcome to Our Application
        </Text>

        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
          spacing={10}
          w={"full"}
        >
          {oldProduct.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </SimpleGrid>

        {oldProduct.length === 0 && (
          <Text
            fontSize={"xl"}
            textAlign={"center"}
            fontWeight={"bold"}
            color={"gray.500"}
          >
            No Products Found!{" "}
            <Link to={"/create"}>
              <Text
                as={"span"}
                color={"blue.500"}
                _hover={{ textDecoration: "underline" }}
              >
                Create Product
              </Text>
            </Link>
          </Text>
        )}
      </VStack>
    </Container>
  );
}
