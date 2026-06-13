import { useState } from "react";

const initialModalData = {
  title: "",
  content: "",
};

const useModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(initialModalData);
  const [modalType, setModalType] = useState("info");
  const [modalNavigation, setModalNavigation] = useState("");
  const [modalAction,setModalAction] = useState(null);
  

  return {
    showModal,
    modalData,
    modalType,
    modalNavigation,
    modalAction,
    setModalAction,
    setShowModal,
    setModalData,
    setModalType,
    setModalNavigation,
  };
};

export default useModal;