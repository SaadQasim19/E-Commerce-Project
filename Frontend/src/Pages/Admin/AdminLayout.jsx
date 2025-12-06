import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../Components/Admin/AdminSidebar";
import AdminHeader from "../../Components/Admin/AdminHeader";
import AdminFooter from "../../Components/Admin/AdminFooter";

export default function AdminLayout() {
  const bgColor = useColorModeValue("gray.50", "gray.900");

  return (
    <Flex h="100vh" overflow="hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <Flex direction="column" flex={1} overflow="hidden">
        {/* Header */}
        <AdminHeader />

        {/* Page Content */}
        <Box
          flex={1}
          overflowY="auto"
          bg={bgColor}
          display="flex"
          flexDirection="column"
        >
          <Box flex={1} p={{ base: 4, md: 8 }}>
            <Outlet />
          </Box>
          
          {/* Footer */}
          <AdminFooter />
        </Box>
      </Flex>
    </Flex>
  );
}
