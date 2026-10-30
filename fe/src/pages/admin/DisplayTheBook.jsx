import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteChapterInBookApi, getBookByIdApi, modifyChapterInBookApi } from '../../app/thunkApiCalls';
import { insertTheBookInFetchedBooks } from '../../app/apiSlicer';
import { useNavigate, useParams } from 'react-router-dom';
import { callKeys } from './CreateInfoWork';
import useModal from '../../reusables/useModal';
import UniversalModal from '../../features/UniversalModal';
import ReusableStackAccordion from '../../reusables/ReusableStackAccordion';
import { Box, Button } from '@mui/material';

const DisplayTheBook = (props) => {
    const { showModal, modalData, modalType, setShowModal, setModalData, setModalType } = useModal();
    const {bookId} = useParams();
    const dispatch = useDispatch();
    const [displayingBook, setDisplayingBook] = useState(null);
    // const getBookByIdState = useSelector((state) => state.apiSlicer.getBookById);
    const fetchedBooks = useSelector((state) => state.apiSlicer.fetchedBooks);
    const navigate = useNavigate();

    const fetchBookById = async () => {
        try {
            const result = await dispatch(
                getBookByIdApi({
                    url: `${import.meta.env.VITE_BOOK_GET_PUT_DELETE}/${bookId}`,
                }));
            if(getBookByIdApi.fulfilled.match(result)){
                // store in the state
                const book = result.payload?.data;
                setDisplayingBook(book);
                dispatch(insertTheBookInFetchedBooks(book));
                setModalType("success");
                setModalData({
                  title: "Success",
                  content: "Fetched the book!",
                });
            }else if(getBookByIdApi.rejected.match(result)){
                setModalType("error");
                setModalData({
                  title: "Create Book Failed!",
                  content: error.message,
                });

    }
            setShowModal(true);
        }catch(error){
            setModalType("error");
            setModalData({
              title: "Fetching Book Failed",
              content: error.message,
            });
            setShowModal(true);
        }
    }
    const isTheBookFetched = ()=>{
        return fetchedBooks.some((book) => book.bookId === bookId);
    };
    useEffect(() => {
        if(!isTheBookFetched()){
            fetchBookById();
        }else if(isTheBookFetched()){
            const book = fetchedBooks.find((book) => book.bookId === bookId);
            setDisplayingBook(book);
            // setModalType("success");
        }
    }, []);
    // console.log("displayingBook", displayingBook);
  return (
    <>
        <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%",marginBottom:'10px' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{
                px: 4,
                py: 1.2,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
                color: "white",
                borderColor: "white",
              }}
            >
              Navigate to all books
            </Button>
        </Box>
        {displayingBook?.chapters?.map ((chapter) => (
            <ReusableStackAccordion
                key={chapter?.chapterId}
                id={chapter?.chapterId}
                bookId={displayingBook?.bookId}
                title={chapter?.title}
                content={chapter?.content}
                item={chapter}
                type={callKeys.BOOK}
                saveUrl={`${import.meta.env.VITE_BOOK_GET_PUT_DELETE}`}
                deleteUrl={`${import.meta.env.VITE_BOOK_GET_PUT_DELETE}`}
                saveApiReference={modifyChapterInBookApi}
                deleteApiReference={deleteChapterInBookApi}
                setParentModalData={setModalData}
                setParentModalType={setModalType}
                setParentShowModal={setShowModal}
            />
        )
        )}
      <UniversalModal
        showModal={showModal}
        setShowModal={setShowModal}
        modalData={modalData}
        setModalData={setModalData}
        modalType={modalType}
        setModalType={setModalType}
      />
    </>
  )
}

export default DisplayTheBook;

