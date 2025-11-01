import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import AdminDashBoard from "./pages/AdminDashBoard";
import CreateUser from "./pages/CreateUser";
import AssignTask from "./pages/AssignTask";
import UserDashBoard from "./pages/UserDashBoard";
import MyTask from "./pages/MyTask";
import TaskDetail from "./pages/TaskDetail";
import TaskOverview from "./pages/TaskOverview";
const App=()=>{
  return(
    <>
      <BrowserRouter>
        <Routes>
           <Route path="/" element={<Layout/>}>
            <Route index element={<Home/>}/>
           
           </Route>
        </Routes>
     
        <Routes>
           <Route path="admindashboard" element={<AdminDashBoard/>}>
             <Route path="createuser" element={<CreateUser/>}/>
             <Route path="assigntask" element={<AssignTask/>} />
             <Route path="taskdetail" element={<TaskDetail/>} />
               <Route path="taskoverview" element={<TaskOverview />} />

            </Route>
        </Routes>

       <Routes>
          <Route path="userdashboard" element={<UserDashBoard/>}>
           <Route path="mytask" element={<MyTask/>}/>
          
          </Route>
       </Routes>
      </BrowserRouter>
    </>
  )
}
export default App;
