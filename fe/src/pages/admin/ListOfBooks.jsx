import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { allBooksApi } from '../../app/thunkApiCalls';
import { loadingStates } from '../../app/appUtils';
import ReusableTable from '../../reusables/ReusableTable';
import useModal from '../../reusables/useModal';
import UniversalModal from '../../features/UniversalModal';
import { useNavigate } from 'react-router-dom';
import { callKeys } from './CreateInfoWork';
import { pushIntoAllBooks } from '../../app/apiSlicer';

const tableHeadRowCells = [
    "Book Name",
    "About Book",
    "Actions",
    "Edit",
    "Delete"
];
const columns = [
    "bookName",
    "aboutBook",
    "actions",
    "edit",
    "delete"
];
const createData = (user) => ({
    id: user.bookId,
    bookName: user.bookName,
    aboutBook: user.aboutBook,
    actions: user.actions,
    edit:user.edit,
    delete:user.delete
});

const ListOfBooks = () => {
    const {
    showModal,
    setShowModal,
    modalData,
    setModalData,
    setModalType,
    modalType,
  } = useModal();
    const dispatch = useDispatch();
    const allBooksState = useSelector((state) => state.apiSlicer.allBooks);
    const allBooksData = useSelector((state) => state.apiSlicer.allListedBooks);
    const allBooksLoading = allBooksState?.loading;
    // const allBooksData = allListedBooksState?.data?.data || [];
    // const allBooksData = allBooksState?.data?.data || [];
    
      const fetchAllBooks = async () => {
        try {
          const result = await dispatch(
            allBooksApi({
              url: `${import.meta.env.VITE_GET_ALL_BOOKS}`,
            })
          );
          if(allBooksApi.fulfilled.match(result)){
            // console.log("Fetched all books successfully:", result.payload);
            const allBooksData = result.payload?.data;
            setModalData({
                title:'Success!',
                content:'Fetched the books Successfully!'
            })
            setModalType("success");
            dispatch(pushIntoAllBooks(allBooksData));
        }else if(allBooksApi.rejected.match(result)){
            // console.log(result.payload);
            setModalData({
                title:'Failed!',
                content:result.payload
            })
            setModalType("error");
        }
        setShowModal(true);
        } catch (error) {
          console.error("Error fetching all books:", error);
          setModalData({
                title:'Failed!',
                content:error.message
            })
            setModalType("error");
            setShowModal(true);
        }
      };
    
      useEffect(() => {
        // Fetch all books from the backend
        if(allBooksLoading === loadingStates.IDLE){
          fetchAllBooks();
        }
      }, []);
      const rows = useMemo(() => {
          return (allBooksData || []).map(createData);
        }, [allBooksData]);
      // const rows = useMemo(() => {
      //     return (allBooksData || []).map(createData);
      //   }, [allBooksData]);
        
  return (
    <div>
        <ReusableTable
            tableHeadRowCells={tableHeadRowCells}
            rows={rows}
            columns={columns}
            type={callKeys.BOOK}
        />
        <UniversalModal
        showModal={showModal}
        setShowModal={setShowModal}
        modalData={modalData}
        setModalData={setModalData}
        modalType={modalType}
        setModalType={setModalType}
      />
    </div>
  )
}

export default ListOfBooks;

