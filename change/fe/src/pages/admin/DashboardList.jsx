import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadingStates } from "../../app/appUtils";
import {
  deleteDashboardApi,
  getAllDashboardsApi,
  modifyDashboardApi,
  setMainDashboardApi,
} from "../../app/thunkApiCalls";
import ReusableStackAccordion from "../../reusables/ReusableStackAccordion";
import { callKeys } from "./CreateInfoWork";
import UniversalModal from "../../features/UniversalModal";
import useModal from "../../reusables/useModal";

const DashboardList = () => {
  const allDashboardsState = useSelector(
    (state) => state.apiSlicer.getAllDashboards,
  );
  const dispatch = useDispatch();
  const {
    showModal,
    modalData,
    modalType,
    setShowModal,
    setModalData,
    setModalType,
  } = useModal();

  useEffect(() => {
    if (allDashboardsState?.loading === loadingStates?.IDLE) {
      dispatch(
        getAllDashboardsApi({
          url: `${import.meta.env.VITE_DASHBOARD_CRUD}`,
          data: [],
        }),
      );
    }
  }, [dispatch]);

  return (
    <>
      {allDashboardsState?.data?.data?.map((item, i) => (
        <ReusableStackAccordion
          key={item._id}
          id={item._id}
          item={item}
          type={callKeys.DASHBOARD}
          saveUrl={`${import.meta.env.VITE_DASHBOARD_CRUD}`}
          deleteUrl={`${import.meta.env.VITE_DASHBOARD_CRUD}`}
          saveApiReference={modifyDashboardApi}
          deleteApiReference={deleteDashboardApi}
          dashboardFor={item.dashboardFor}
          isDefault={item.isDefault}
          setParentModalData={setModalData}
          setParentModalType={setModalType}
          setParentShowModal={setShowModal}
        />
      ))}
      <UniversalModal
        showModal={showModal}
        setShowModal={setShowModal}
        modalData={modalData}
        setModalData={setModalData}
        type={modalType}
        setModalType={setModalType}
      />
    </>
  );
};

export default DashboardList;
