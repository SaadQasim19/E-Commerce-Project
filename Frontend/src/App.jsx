import { Box ,useColorModeValue} from "@chakra-ui/react";
import Navbar  from "./Components/Navbar";
import CreatePage from "./Pages/CreatePage";
import HomePage from "./Pages/HomePage";
import { Routes, Route } from "react-router-dom";

function App() {
  console.log("App component rendered");
  return (
    <Box minH={"100vh"} bg={useColorModeValue("green.900" , "gray.900")} >
      <Navbar />
      <Routes>
        <Route path ="/" element = {<HomePage/>} ></Route>
        <Route path ="/create" element = {<CreatePage/>} ></Route>

      </Routes>
    </Box>
  );
}

export default App;