import { Box, Button } from '@mui/material';
import React, { useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ReusableEditorTinyMce from '../../reusables/ReusableEditorTinyMce';
import { useState } from 'react';
import { BASE_URL, localUser } from '../../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { allBooksApi, createChapterApi, createDashboardApi, createInformationApi, createPersonalWorkApi, createWorkApi } from '../../app/thunkApiCalls';
import { pushIntoAllBooks, pushIntoAllDashboards, pushIntoAllInfo, pushIntoAllPersonalWorks, pushIntoAllWorks, updateOneInAllWorks } from '../../app/apiSlicer';
import UniversalModal from '../../features/UniversalModal';
import useModal from '../../reusables/useModal';
import { loadingStates } from '../../app/appUtils';

export const callKeys = {
    INFO:'information',
    WORK:'work',
    PERSONALWORK:'personalWork',
    ADMINDASHBOARD:'admin',
    USERDASHBOARD:'user',
    DASHBOARD:'dashboard',
    BOOK:'book',
}
export const createInfoWorkBtnStyles = {
        color: "#fff",
        borderColor: "rgba(255,255,255,0.4)",
        fontWeight: 600,
        textTransform: "none",

        minWidth: {
          xs: "100%",
          sm: "220px",
          md: "180px",
        },

        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(8px)",

        "&:hover": {
          borderColor: "#fff",
          background: "rgba(255,255,255,0.18)",
          transform: "translateY(-2px)",
        },

        transition: "all 0.3s ease",
      };
const CreateInfoWork = () => {
    const [title, setTitle] = useState("");
      const [content, setContent] = useState("");
      const dispatch = useDispatch();
      const {
    showModal,
    modalData,
    modalType,
    modalNavigation,
    setShowModal,
    setModalData,
    setModalType,
  } = useModal();
  const [bookName, setBookName] = useState("");
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
        const fetchedBooks = result.payload?.data;
        dispatch(pushIntoAllBooks(fetchedBooks));
      }else if(allBooksApi.rejected.match(result)){
        console.log(result.payload);
        
      }
    } catch (error) {
      console.error("Error fetching all books:", error);
    }
  };

  useEffect(() => {
    // Fetch all books from the backend
    fetchAllBooks();
    // if(allBooksLoading === loadingStates.IDLE){
    // }
  }, [dispatch]);
  const responsiveContent = content.replace(
    /<img([^>]*)>/g,
    '<img$1 style="max-width:100%;height:auto;" />'
  );
  const handleSave= async(callKey)=>{
//     const responsiveContent = content.replace(
//   /<img([^>]*)>/g,
//   '<img$1 style="max-width:100%;height:auto;" />'
// );
    try {
      if(callKey===callKeys.INFO){
      const infoResult = await dispatch(createInformationApi({
        url:`${import.meta.env.VITE_CREATE_INFORMATION}`,
        data:{title,content:responsiveContent}
      }));
      if(createInformationApi.fulfilled.match(infoResult)){
        const infoPayload = infoResult.payload.data;
        // handleReset();
        // update store
        dispatch(pushIntoAllInfo(infoPayload));
        setModalData({title:'Success',content:'Information created successfully!'});
        setModalType('success');
        handleReset();
      }else if(createInformationApi.rejected.match(infoResult)){
        setModalData({title:'Failed',content:infoResult.payload});
        setModalType('error');
      }
    }else if(callKey===callKeys.WORK){
      const workResult = await dispatch(createWorkApi({
        url:`${import.meta.env.VITE_CREATE_WORK}`,
        data:{title,content:responsiveContent}
      }));
      if(createWorkApi.fulfilled.match(workResult)){
        // update store
        const workPayload = workResult.payload?.data;
        dispatch(pushIntoAllWorks(workPayload));
        setModalData({title:'Success',content:'Work created successfully!'});
        setModalType('success');
        handleReset();
      }else if(createWorkApi.rejected.match(workResult)){
        setModalData({title:'Failed',content:workResult.payload});
        setModalType('error');
      }
    }else if(callKey===callKeys.PERSONALWORK){
      const personalWorkResult = await dispatch(createPersonalWorkApi({
        url:`${import.meta.env.VITE_CREATE_PERSONAL_WORK}`,
        data:{title,content:responsiveContent}
      }));
      if(createPersonalWorkApi.fulfilled.match(personalWorkResult)){
        // update store
        const workPayload = personalWorkResult.payload?.data;
        dispatch(pushIntoAllPersonalWorks(workPayload));
        setModalData({title:'Success',content:'Personal Work created successfully!'});
        setModalType('success');
        handleReset();
      }else if(createPersonalWorkApi.rejected.match(personalWorkResult)){
        setModalData({title:'Failed',content:personalWorkResult.payload});
        setModalType('error');
      }
    }else if(callKey===callKeys.ADMINDASHBOARD||callKey===callKeys.USERDASHBOARD){
      const dashboardResult= await dispatch(createDashboardApi({
        url:`${import.meta.env.VITE_DASHBOARD_CRUD}`,
        data:{title,content:responsiveContent,dashboardFor:callKey}
      }));
      if(createDashboardApi.fulfilled.match(dashboardResult)){
        const dashboardPayload = {...dashboardResult.payload.data}
        // push into store
        dispatch(pushIntoAllDashboards(dashboardPayload));
        setModalData({title:'Success',content:`${callKey} dashboard created successfully!`});
        setModalType('success');
        handleReset();
      }else if(createDashboardApi.rejected.match(dashboardResult)){
        setModalData({title:'Failed to create dashboard',content:dashboardResult.payload});
        setModalType('error');
      }
    }
    setShowModal(true);
    } catch (error) {
      setModalData({title:'Failed',content:error.message});
      setModalType('error');
      setShowModal(true);
    }
  }
  const handleChapterSave = async (callKey, bookId, obj)=>{
    // console.log('chapter has clicked',bookId);
    
    if(!bookId){
      setModalData({title:'Failed',content:'Please select a book before saving the chapter!'});
      setModalType('error');
      setShowModal(true);
      return;
    }
    if(callKey===callKeys.BOOK){
      // console.log('Saving chapter for bookId:', bookId);
      try {
        // console.log("hitting try block");
        const chapterResult = await dispatch(createChapterApi({
          url:`${import.meta.env.VITE_CREATE_CHAPTER}`,
          data:{title,content:responsiveContent,bookId,bookName:obj?.bookName}
        }));
        if(createChapterApi.fulfilled.match(chapterResult)){
          setModalData({title:'Success',content:'Chapter created successfully!'});
          setModalType('success');
          handleReset();
        }else if(createChapterApi.rejected.match(chapterResult)){
          // console.log("hitting catch block");
          setModalData({title:'Failed',content:chapterResult.payload});
          setModalType('error');
        }  
        setShowModal(true);
    }catch (error) {
      // console.log("hitting catch block error",error);
      setModalData({title:'Failed',content:error.message});
      setModalType('error');
      setShowModal(true);
    }
    }
  }
function handleReset(){
        setTitle("");
        setContent("");
        setBookName("");
      };
      function handleChange(value) {
        setBookName(value);
      }
  return (
    <>
    {/* CreateInfoWork */}
    <ReusableEditorTinyMce
    title={title}
        content={content}
        onTitleChange={setTitle}
        onContentChange={setContent}
        height='500px'
    />
    <Box
  sx={{
    width: "100%",
    mt: 2,
    p: 2,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,

    background:
      "linear-gradient(135deg, #00c6ff 0%, #0072ff 50%, #00c6ff 100%)",
    backgroundSize: "400% 400%",
    animation: "waterFlow 12s ease infinite",

    borderRadius: 3,

    boxShadow: `
      inset 0 1px 1px rgba(255,255,255,0.25),
      0 10px 30px rgba(0,114,255,0.25),
      0 20px 60px rgba(0,198,255,0.20)
    `,

    "@keyframes waterFlow": {
      "0%": { backgroundPosition: "0% 50%" },
      "50%": { backgroundPosition: "100% 50%" },
      "100%": { backgroundPosition: "0% 50%" },
    },
  }}
>
  {[
    {
      label: "Save Information",
      action: () => handleSave(callKeys?.INFO),
    },
    {
      label: "Save Work",
      action: () => handleSave(callKeys?.WORK),
    },
    {
      label: "Save Personal Work",
      action: () => handleSave(callKeys?.PERSONALWORK),
    },
    {
      label: "Save Admin Dashboard",
      action: () => handleSave(callKeys?.ADMINDASHBOARD),
    },
    {
      label: "Save User Dashboard",
      action: () => handleSave(callKeys?.USERDASHBOARD),
    },
    {
      label: "Reset Editor",
      action: handleReset,
    },
  ].map((btn) => (
    <Button
      key={btn.label}
      variant="outlined"
      onClick={btn.action}
      sx={createInfoWorkBtnStyles}
    >
      {btn.label}
    </Button>
  ))}

  <Box sx={{ minWidth: 500 }}>
  <FormControl fullWidth>
    <InputLabel
      id="book-name-label"
      sx={{
        color: "rgba(255,255,255,0.8)",
        "&.Mui-focused": {
          color: "white",
        },
      }}
    >
      Book Name
    </InputLabel>

    <Select
      labelId="book-name-label"
      id="book-name-select"
      value={bookName}
      label="Book Name"
      onChange={(event) => handleChange(event.target.value)}
      sx={{
        color: "white",
        borderRadius: 2,
        background: "rgba(255,255,255,0.08)",

        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(255,255,255,0.5)",
        },

        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(255,255,255,0.9)",
        },

        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#00c6ff",
        },

        "& .MuiSvgIcon-root": {
          color: "white",
        },
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            background: "#073b75",
            color: "white",
            "& .MuiMenuItem-root:hover": {
              background: "rgba(0,198,255,0.2)",
            },
            "& .MuiMenuItem-root.Mui-selected": {
              background: "rgba(0,198,255,0.3)",
            },
          },
        },
      }}
    >

      {
        allBooksData.map((book) => (
          <MenuItem
            key={book.bookId}
            value={book.bookId}
            onClick={() => handleChapterSave(callKeys?.BOOK, book.bookId, { bookName: book.bookName })}
          >
            {book.bookName}
          </MenuItem>
        ))
      }
    </Select>
  </FormControl>
</Box>
  {/* <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Book Name</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={bookName}
          label="Book Name"
          onChange={(event) => handleChange(event.target.value)}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </Box> */}
</Box>
    <UniversalModal
    showModal={showModal}
    setShowModal={setShowModal}
    modalData={modalData}
    setModalData={setModalData}
    modalType={modalType}
    setModalType={setModalType}
    navigateLocation={modalNavigation}
    />
    </>
  )
}

export default CreateInfoWork;