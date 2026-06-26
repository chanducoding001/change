import React, { useEffect, useState } from "react";
import ReusableStackAccordion from "../../reusables/ReusableStackAccordion";
import { BASE_URL, localUser } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  allInformationsApi,
  deleteInformationApi,
  modifyInformationApi,
} from "../../app/thunkApiCalls";
import { loadingStates } from "../../app/appUtils";
import { callKeys } from "../admin/CreateInfoWork";
import UniversalModal from "../../features/UniversalModal";

const Information = () => {
  const [informationList, setInformationList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    content: "",
  });
  const [modalType, setModalType] = useState("info");

  const allInformationsState = useSelector(
    (state) => state.apiSlicer.allInformations,
  );

  const dispatch = useDispatch();

  const fetchAllInformation = async () => {
      try {
        const result = await dispatch(
        allInformationsApi({
          url: `${import.meta.env.VITE_INFORMATION_GET_PUT_DELETE}`,
          data: [],
        }),
      );
        if (allInformationsApi.fulfilled.match(result)) {
          setModalData({
            title: "Success!",
            content:
              result.payload?.data?.length > 0
                ? "Successfully fetched the Information!"
                : "Information is not created yet!",
          });
          setModalType("success");
        } else if (allInformationsApi.rejected.match(result)) {
          setModalData({
            title: "Failed to fetch Information!",
            content: result.payload,
          });
          setModalType("error");
        }
        setShowModal(true);
      } catch (error) {
        setModalData({
          title: "Failed to fetch Information!",
          content: error.message,
        });
        setModalType("error");
        setShowModal(true);
      }
    };

  useEffect(() => {
    if (allInformationsState?.loading === loadingStates?.IDLE) {
      fetchAllInformation();
    }
  }, [dispatch]);

  return (
    <>
      {allInformationsState?.data?.data?.map((item) => (
        <ReusableStackAccordion
          key={item._id}
          id={item._id}
          item={item}
          type={callKeys.INFO}
          saveUrl={`${import.meta.env.VITE_INFORMATION_GET_PUT_DELETE}`}
          deleteUrl={`${import.meta.env.VITE_INFORMATION_GET_PUT_DELETE}`}
          saveApiReference={modifyInformationApi}
          deleteApiReference={deleteInformationApi}
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

export default Information;
