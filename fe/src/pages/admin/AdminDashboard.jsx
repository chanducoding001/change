import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadingStates } from "../../app/appUtils";
import { getMainDashboardApi } from "../../app/thunkApiCalls";
import SustainabilityCards from "../../cards/SustainabilityCards";
import C from "../../cards/C";
import HarmonyCards from "../../cards/HarmonyCards";
import GlassWrittingCard from "../../cards/GlassWrittingCard";
import ChoiceCards from "../../cards/ChoiceCards";
import RootsRiskCards from "../../cards/RootsRiskCards";
import WhatWillIDoCards from "../../cards/WhatWillIDoCards";

const AdminDashboard = () => {
  const getMainDashboardState = useSelector(
    (state) => state.apiSlicer.getMainDashboard,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (getMainDashboardState.loading === loadingStates.IDLE) {
      dispatch(
        getMainDashboardApi({
          url: `${import.meta.env.VITE_GET_MAIN_DASHBOARD}/admin`,
        }),
      );
    }
  }, [dispatch]);

  return (
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
      {getMainDashboardState.data?.data?.title ||
        (getMainDashboardState.data?.data?.content && (
          <GlassWrittingCard title={getMainDashboardState.data?.data?.title}>
            <div
              dangerouslySetInnerHTML={{
                __html: getMainDashboardState.data?.data?.content || "",
              }}
            />
          </GlassWrittingCard>
        ))}
    </div>
  );
};

export default AdminDashboard;
