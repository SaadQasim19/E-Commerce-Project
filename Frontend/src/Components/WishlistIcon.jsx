import { IconButton, Badge, Box } from "@chakra-ui/react";
import { FiHeart } from "react-icons/fi";
import useWishlistStore from "../Store/wishlist";

const WishlistIcon = ({ onOpen }) => {
  const { getTotalItems } = useWishlistStore();
  const itemCount = getTotalItems();

  return (
    <Box position="relative">
      <IconButton
        icon={<FiHeart />}
        variant="ghost"
        fontSize="20px"
        aria-label="Open wishlist"
        onClick={onOpen}
      />
      {itemCount > 0 && (
        <Badge
          position="absolute"
          top="-1"
          right="-1"
          colorScheme="red"
          borderRadius="full"
          fontSize="xs"
          px={2}
        >
          {itemCount}
        </Badge>
      )}
    </Box>
  );
};

export default WishlistIcon;
