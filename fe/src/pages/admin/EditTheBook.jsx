import { useState } from "react";
import { useDispatch } from "react-redux";
import { createBookApi, editBookApi } from "../../app/thunkApiCalls";
import useModal from "../../reusables/useModal";
import CreateEditCommonComponent from "./CreateEditCommonComponent";
import { validationSchema } from "./CreateABook";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { modifyEditedBook } from "../../app/apiSlicer";
import { Button } from "@mui/material";

  
  const title = "Edit the Book";
  const subTitle = "Fill in the details to edit the book";
  const submitBtnText = "Save the book";

const EditTheBook = () => {

//   const {bookName,aboutBook,bookId}= useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { bookId, bookName, aboutBook } = location.state || {};
  const [loading, setLoading] = useState(false);
  const {showModal,setShowModal,modalData,setModalData,modalType,setModalType} = useModal();
  const dispatch = useDispatch();

  const initialValues = {
    bookName,
    aboutBook
  };
  const onSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);

      // const result = await loginUser(values);
      const editBookResult = await dispatch(
        editBookApi({
          url: `${import.meta.env.VITE_BOOK_PUT_DELETE}/${bookId}`,
          data: values,
        }),
      );
      if (editBookApi.fulfilled.match(editBookResult)) {
        const {bookId,bookName,aboutBook} = editBookResult.payload?.data;
        const editedBook = {
            bookId,
            bookName,
            aboutBook
        }
        setModalData({
          title: "Book editd Successfully",
          content: "Edit Book successful",
        });
        setModalType("success");
        resetForm();
        dispatch(modifyEditedBook(editedBook));
      }else if(editBookApi.rejected.match(editBookResult)){
        // console.log('error',editBookResult.payload);
        
        setModalData({
          title: "Edit Book Failed",
          content: editBookResult.payload,
        });
        setModalType("error");
      }
        setShowModal(true);
    } catch (error) {
      setModalType("error");
      setModalData({
        title: "Edit Book Failed",
        content: error.message,
      });

      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };
    
  return (
      //  Animated Water Background
    <>
      <CreateEditCommonComponent
        title={title}
        subTitle={subTitle}
        loading={loading}
        showModal={showModal}
        setShowModal={setShowModal}
        modalData={modalData}
        setModalData={setModalData}
        modalType={modalType}
        setModalType={setModalType}
        initialValues={initialValues}
        validationSchema={validationSchema}
        submitBtnText={submitBtnText}
        onSubmit={onSubmit}
        navigateLocation={-1}
        isEdit={true}
      />
    </>
  );
};

export default EditTheBook;
