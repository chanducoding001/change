import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { allBooksApi } from '../../app/thunkApiCalls';
import { loadingStates } from '../../app/appUtils';
import ReusableTable from '../../reusables/ReusableTable';
import useModal from '../../reusables/useModal';
import UniversalModal from '../../features/UniversalModal';

const tableHeadRowCells = [
    "Book Name",
    "About Book",
    "Actions"
];
const columns = [
    "bookName",
    "aboutBook",
    "actions"
];
const createData = (user) => ({
    id: user.bookId,
    bookName: user.bookName,
    aboutBook: user.aboutBook,
    actions: user.actions
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
    const allBooksLoading = allBooksState?.loading;
    const allBooksData = allBooksState?.data?.data || [];
    
      const fetchAllBooks = async () => {
        try {
          const result = await dispatch(
            allBooksApi({
              url: `${import.meta.env.VITE_GET_ALL_BOOKS}`,
            })
          );
          if(allBooksApi.fulfilled.match(result)){
            // console.log("Fetched all books successfully:", result.payload);
            setModalData({
                title:'Success!',
                content:'Fetched the books Successfully!'
            })
            setModalType("success");
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
        // console.log("allBooksData", rows);

  return (
    <div>
        <ReusableTable
            tableHeadRowCells={tableHeadRowCells}
            rows={rows}
            columns={columns}
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

