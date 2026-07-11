import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./auth/login/Login";
import SignUp from "./auth/signUp/SignUp";

import ProtectedRoute from "./routing/ProtectedRoute";
import PublicRoute from "./routing/PublicRoute";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import LayoutFile from "./pages/common/LayoutFile";
import Profile from "./pages/account/Profile";
import AccountSettings from "./pages/account/AccountSettings";
import Settings from "./pages/account/Settings";
import { navigationLocations } from "./utils/utils";
import ListOfSubscribers from "./pages/admin/ListOfSubscribers";
import Information from "./pages/common/Information";
import ListOfWorks from "./pages/common/ListOfWorks";
import CreateInfoWork from "./pages/admin/CreateInfoWork";
import HomeRedirect from "./routing/HomeRedirect";
import { useDispatch } from "react-redux";
import { getProfileApi } from "./app/thunkApiCalls";
import { setUser } from "./app/apiSlicer";
import EditProfile from "./pages/account/EditProfile";
import PublicLayout from "./pages/common/PublicLayout";
import DashboardList from "./pages/admin/DashboardList";
import UnAuthorized from "./pages/common/UnAuthorized";
import IdlePage from "./pages/admin/IdlePage";
import UploadCsvData from "./pages/admin/UploadCsvData";
import DisplayCensusData from "./pages/common/DisplayCensusData";
import ListOfPersonalWorks from "./pages/admin/ListOfPersonalWorks";
import WorldMap from "./pages/admin/GIS/WorldMap";
import DisplaySDSDVData from "./pages/common/DisplaySDSDVData";
import CreateTour from "./pages/admin/add_tour/CreateTour";
import ListOfTours from "./pages/admin/add_tour/ListOfTours";
import AddPlaceInTour from "./pages/admin/add_tour/AddPlaceInTour";
import VisitTour from "./pages/admin/add_tour/visitTour/VisitTour";
// import AddTour from "./pages/admin/GIS_MAP/AddTour";

const App = () => {


  const dispatch = useDispatch();


useEffect(() => {
  const fetchProfile = async () => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (user?.token) {
      const result = await dispatch(
        getProfileApi({
          url: `${import.meta.env.VITE_GET_PROFILE_URL}/${user.id}`,
        })
      );

      if (getProfileApi.fulfilled.match(result)) {
        dispatch(setUser(result.payload.user));
      }
    }
  };

  fetchProfile();
}, [dispatch]);


  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomeRedirect />}
        />

        {/* Public Routes */}
        <Route element={<PublicRoute />}>
        <Route path={navigationLocations?.LOGIN} element={<Login />} />
            <Route path={navigationLocations?.SIGNUP} element={<SignUp />} />
          {/* <Route element={<PublicLayout/>}>
            
          </Route> */}
        </Route>

        <Route
          path={navigationLocations?.UNAUTHORIZED}
          element={<UnAuthorized />}
        />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<LayoutFile />}>
            <Route
              path={navigationLocations?.ADMINDASHBOARD}
              element={<AdminDashboard />}
            />
            <Route
              path={navigationLocations?.DASHBOARDLIST}
              element={<DashboardList />}
            />
            <Route
              path={navigationLocations?.DISPLAYCENSUS}
              element={<DisplayCensusData />}
            />
            <Route
              path={navigationLocations?.DISPLAYSTATELGD}
              element={<DisplaySDSDVData />}
            />
            <Route
              path={navigationLocations?.ADDTOUR}
              element={<CreateTour />}
            />
            <Route
              path={navigationLocations?.TOURSLIST}
              element={<ListOfTours />}
            />
            <Route
              path={navigationLocations?.ADDPLACEINTOUR}
              element={<AddPlaceInTour />}
            />
            <Route
              path={navigationLocations?.VISITTOUR}
              element={<VisitTour />}
            />
            <Route
              path={navigationLocations?.CONTRIBUTERS}
              element={<ListOfSubscribers />}
            />
            <Route
              path={navigationLocations?.ALLPERSONALWORKSLIST}
              element={<ListOfPersonalWorks />}
            />
            <Route
              path={navigationLocations?.CREATEDATA}
              element={<CreateInfoWork />}
            />
            <Route
              path={navigationLocations?.UPLOADCSVDATA}
              element={<UploadCsvData />}
            />
            <Route
              path={navigationLocations?.WORLDMAP}
              element={<WorldMap />}
            />
            
            <Route
              path={navigationLocations?.IDLE}
              element={<IdlePage />}
            />
          </Route>
        </Route>

        {/* User Routes */}
        {/* <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route element={<LayoutFile />}>
            <Route
              path={navigationLocations?.USERDASHBOARD}
              element={<UserDashboard />}
            />
          </Route>
        </Route> */}
        {/* both admin user access */}
        <Route element={<ProtectedRoute allowedRoles={["admin", "user"]} />}>
          <Route element={<LayoutFile />}>
          <Route
              path={navigationLocations?.USERDASHBOARD}
              element={<UserDashboard />}
            />
            
            <Route path={navigationLocations?.PROFILE} element={<Profile />} />
            <Route path={navigationLocations?.EDITPROFILE} element={<EditProfile />} />
            <Route
              path={navigationLocations?.ACCOUNTSETTINGS}
              element={<AccountSettings />}
            />
            <Route
              path={navigationLocations?.SETTINGS}
              element={<Settings />}
            />
            <Route
              path={navigationLocations?.ALLINFO}
              element={<Information />}
            />
            <Route
              path={navigationLocations?.ALLWORKSLIST}
              element={<ListOfWorks />}
            />
            
          </Route>
        </Route>
        <Route
          path="*"
          element={<UnAuthorized />}
        />
        {/* <Route
          path="*"
          element={<Navigate to={navigationLocations?.LOGIN} replace />}
        /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
