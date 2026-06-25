import { Box, Button } from '@mui/material';
import React from 'react'
import ReusableEditorTinyMce from '../../reusables/ReusableEditorTinyMce';
import { useState } from 'react';
import { BASE_URL, localUser } from '../../utils/utils';
import { useDispatch } from 'react-redux';
import { createDashboardApi, createInformationApi, createWorkApi } from '../../app/thunkApiCalls';
import { pushIntoAllDashboards, pushIntoAllInfo, pushIntoAllWorks, updateOneInAllWorks } from '../../app/apiSlicer';
import UniversalModal from '../../features/UniversalModal';
import useModal from '../../reusables/useModal';

export const callKeys = {
    INFO:'information',
    WORK:'work',
    ADMINDASHBOARD:'admin',
    USERDASHBOARD:'user',
    DASHBOARD:'dashboard'
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
    setModalNavigation,
  } = useModal();

  const handleSave= async(callKey)=>{
    const responsiveContent = content.replace(
  /<img([^>]*)>/g,
  '<img$1 style="max-width:100%;height:auto;" />'
);
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
function handleReset(){
        setTitle("");
        setContent("");
      };
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
</Box>
    <UniversalModal
    showModal={showModal}
    setShowModal={setShowModal}
    modalData={modalData}
    setModalData={setModalData}
    type={modalType}
    setModalType={setModalType}
    navigateLocation={modalNavigation}
    />
    </>
  )
}

export default CreateInfoWork;