import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadingStates } from "../../app/appUtils";
import { getUserMainDashboardApi } from "../../app/thunkApiCalls";
import { Box } from "@mui/material";
import SustainabilityCards from "../../cards/SustainabilityCards";
import HarmonyCards from "../../cards/HarmonyCards";
import RootsRiskCards from "../../cards/RootsRiskCards";
import WhatWillIDoCards from "../../cards/WhatWillIDoCards";
import ChoiceCards from "../../cards/ChoiceCards";
import GlassWrittingCard from "../../cards/GlassWrittingCard";

const UserDashboard = () => {
  const getUserMainDashboardState = useSelector(
    (state) => state.apiSlicer.getUserMainDashboard,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (getUserMainDashboardState.loading === loadingStates.IDLE) {
      dispatch(
        getUserMainDashboardApi({
          url: `${import.meta.env.VITE_GET_MAIN_DASHBOARD}/user`,
        }),
      );
    }
  }, [dispatch]);

  return (
    <>
      <div
        style={{
          // padding: "16px",
          color: "white",
          // backgroundColor:"black"
        }}
      >
        <SustainabilityCards />
        <HarmonyCards />
        <RootsRiskCards />
        <WhatWillIDoCards />
        <ChoiceCards />
        {getUserMainDashboardState.data?.data?.title ||
          (getUserMainDashboardState.data?.data?.content && (
            <GlassWrittingCard
              title={getUserMainDashboardState.data?.data?.title}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: getUserMainDashboardState.data?.data?.content || "",
                }}
              />
            </GlassWrittingCard>
          ))}
      </div>
    </>
  );
  //   return (
  //     <>
  //     <Box
  //   sx={{
  //     color:'white',
  //     width: "100%",
  //     maxWidth: "100%",
  //     "& img": {
  //       maxWidth: "100%",
  //       height: "auto",
  //     },
  //     "& table": {
  //       width: "100%",
  //       display: "block",
  //       overflowX: "auto",
  //     },
  //     "& p, & span, & div": {
  //       overflowWrap: "break-word",
  //       wordBreak: "break-word",
  //     },
  //   }}
  //   dangerouslySetInnerHTML={{
  //     __html: getUserMainDashboardState.data?.data?.content || "",
  //   }}
  // />
  //     </>
  //   );
};

export default UserDashboard;
