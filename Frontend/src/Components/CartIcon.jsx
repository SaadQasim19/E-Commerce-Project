import { IconButton, Badge, Box } from "@chakra-ui/react";
import { FiShoppingCart } from "react-icons/fi";
import useCartStore from "../Store/cart";

const CartIcon = ({ onOpen }) => {
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const totalItems = getTotalItems();

  return (
    <Box position="relative" display="inline-block">
      <IconButton
        icon={<FiShoppingCart size={20} />}
        onClick={onOpen}
        aria-label="Shopping Cart"
        variant="ghost"
        _hover={{ bg: "whiteAlpha.200" }}
      />
      {totalItems > 0 && (
        <Badge
          position="absolute"
          top="-1"
          right="-1"
          colorScheme="red"
          borderRadius="full"
          fontSize="0.8em"
          px={2}
          py={0.5}
        >
          {totalItems}
        </Badge>
      )}
    </Box>
  );
};

export default CartIcon;
