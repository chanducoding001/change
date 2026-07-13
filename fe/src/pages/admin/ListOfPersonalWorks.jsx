import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  allPersonalWorkApi,
  modifyPersonalWorkApi,
  deletePersonalWorkApi,
} from "../../app/thunkApiCalls";
import { data } from "react-router-dom";
import ReusableStackAccordion from "../../reusables/ReusableStackAccordion";
import { loadingStates } from "../../app/appUtils";
import { callKeys } from "../admin/CreateInfoWork";
import UniversalModal from "../../features/UniversalModal";
import useModal from "../../reusables/useModal";

const ListOfPersonalWorks = () => {
  const {
    showModal,
    modalData,
    modalType,
    setShowModal,
    setModalData,
    setModalType,
  } = useModal();
  const dispatch = useDispatch();
  const allPersonalWorksState = useSelector(
    (state) => state.apiSlicer.allPersonalWorks,
  );

  const fetchAllPersonalWorks = async () => {
    try {
      const result = await dispatch(
        allPersonalWorkApi({
          url: `${import.meta.env.VITE_PERSONAL_WORK_GET_PUT_DELETE}`,
          data: [],
        }),
      );
      if (allPersonalWorkApi.fulfilled.match(result)) {
        setModalData({
          title: "Success!",
          content:
            result.payload?.data?.length > 0
              ? "Successfully fetched personal Works!"
              : "Personal works are not created yet!",
        });
        setModalType("success");
      } else if (allPersonalWorkApi.rejected.match(result)) {
        setModalData({
          title: "Failed to fetch personal Works!",
          content: result.payload,
        });
        setModalType("error");
      }
      setShowModal(true);
    } catch (error) {
      setModalData({
        title: "Failed to fetch personal Works!",
        content: error.message,
      });
      setModalType("error");
      setShowModal(true);
    }
  };
  useEffect(() => {
    if (allPersonalWorksState.loading === loadingStates.IDLE) {
      fetchAllPersonalWorks();
    }
  }, []);
  return (
    <>
      {allPersonalWorksState.data?.data?.map((eachWork, index) => (
        <ReusableStackAccordion
          key={eachWork?._id}
          id={eachWork?._id}
          title={eachWork?.title}
          content={eachWork?.content}
          item={eachWork}
          type={callKeys.PERSONALWORK}
          saveUrl={`${import.meta.env.VITE_PERSONAL_WORK_GET_PUT_DELETE}`}
          deleteUrl={`${import.meta.env.VITE_PERSONAL_WORK_GET_PUT_DELETE}`}
          saveApiReference={modifyPersonalWorkApi}
          deleteApiReference={deletePersonalWorkApi}
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
        modalType={modalType}
        setModalType={setModalType}
      />
    </>
  );
};

export default ListOfPersonalWorks;
