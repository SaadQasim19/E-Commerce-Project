import {
  Container,
  useColorModeValue,
  VStack,
  Heading,
  Box,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import ProductStore from "../Store/product";  

export default function CreatePage() {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
  });

  const createProduct = ProductStore((state) => state.createProduct); 
  const toast = useToast(); 

  const handleNewProduct = async () => {
    console.log("New Product Created", newProduct);
    const result = await createProduct(newProduct); 
    console.log(`Result:`, result); 

    if (result.success) {
      toast({
        title: "Product Created",
        description: result.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error",
        description: result.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }

    //&Optionally reset the form:
    setNewProduct({ name: "", price: "", image: "" });
  };

  return (
    <Container maxW="container.sm">
      <VStack spacing={8}>
        <Heading as="h1" size="2xl" textAlign="center" mb={8}>
          Create New Product
        </Heading>

        <Box
          w="full"
          bg={useColorModeValue("white", "gray.800")}
          p={6}
          rounded="lg"
          shadow="md"
        >
          <VStack spacing={4}>
            <Input
              placeholder="Product Name"
              name="name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <Input
              placeholder="Product Price"
              type="number"
              name="price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
            <Input
              placeholder="Product Image"
              name="image"
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.value })
              }
            />
            <Button colorScheme="blue" onClick={handleNewProduct} w="full">
              Add Product
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
