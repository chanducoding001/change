import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  allWorkApi,
  deleteWorkApi,
  modifyWorkApi,
} from "../../app/thunkApiCalls";
import { data } from "react-router-dom";
import ReusableStackAccordion from "../../reusables/ReusableStackAccordion";
import { loadingStates } from "../../app/appUtils";
import { callKeys } from "../admin/CreateInfoWork";
import UniversalModal from "../../features/UniversalModal";
import useModal from "../../reusables/useModal";

const ListOfWorks = () => {
  const {
    showModal,
    modalData,
    modalType,
    setShowModal,
    setModalData,
    setModalType,
  } = useModal();
  const dispatch = useDispatch();
  const allWorksState = useSelector((state) => state.apiSlicer.allWorks);

  const fetchAllWorks = async () => {
    try {
      const result = await dispatch(
        allWorkApi({
          url: `${import.meta.env.VITE_WORK_GET_PUT_DELETE}`,
          data: [],
        }),
      );
      if (allWorkApi.fulfilled.match(result)) {
      }
    } catch (error) {}
  };
  useEffect(() => {
    if (allWorksState.loading === loadingStates.IDLE) {
      fetchAllWorks();
    }
  }, []);
  return (
    <>
      {allWorksState.data?.data?.map((eachWork, index) => (
        <ReusableStackAccordion
          key={eachWork?._id}
          id={eachWork?._id}
          title={eachWork?.title}
          content={eachWork?.content}
          item={eachWork}
          type={callKeys.WORK}
          saveUrl={`${import.meta.env.VITE_WORK_GET_PUT_DELETE}`}
          deleteUrl={`${import.meta.env.VITE_WORK_GET_PUT_DELETE}`}
          saveApiReference={modifyWorkApi}
          deleteApiReference={deleteWorkApi}
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

export default ListOfWorks;
