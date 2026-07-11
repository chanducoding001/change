import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadingStates } from '../../../app/appUtils';
import { deleteTourApi, getAllToursApi } from '../../../app/thunkApiCalls';
import ReusableEachStaticMapCard from './ReusableEachStaticMapCard';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { navigationLocations } from '../../../utils/utils';
import { crudAllTours, fetchUnResolvedPlacesFromTourId } from '../../../app/mapSlicer';
import UniversalModal from "../../../features/UniversalModal";
import useModal from '../../../reusables/useModal';

const ListOfTours = () => {
    const dispatch = useDispatch();
    const getAllToursStateData = useSelector((state)=>state.mapSlicer.getAllToursState);
    const {loading, data} = getAllToursStateData;
    const [selectedTourId,setSelectedTourId] = useState('');
    const navigate = useNavigate();
    const {
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
  } = useModal();
  
    const fetchAllTours = async ()=>{
        try {
            const result = await dispatch(getAllToursApi({
                url:import.meta.env.VITE_GET_ALL_TOURS,
                data:[]
            }));

        if(getAllToursApi.fulfilled.match(result)){
            const requiredData = result.payload?.data
            dispatch(crudAllTours({
                type:'allTours',
                data:requiredData
            }));
            // show modal
        }
        } catch (error) {
            console.log('error',error.message);
        }
    }
    useEffect(()=>{
        if(loading===loadingStates.IDLE){
            fetchAllTours();
        }
    },[dispatch]);
    console.log('all tours',data);
    const handleAddPlace = (tourId)=>{
        console.log('add place',tourId);
        navigate(navigationLocations?.ADDPLACEINTOUR.replace(":tourId", tourId));
    };
    const handleVisitTour = (tourId)=>{
        console.log('add tour',tourId);
        navigate(navigationLocations?.VISITTOUR.replace(":tourId", tourId));
    };
    const handleDeleteTour = async (tourId)=>{
        console.log('delete tour',tourId);
        setSelectedTourId(tourId);
        setShowModal(true);
        setModalData({
            title:'Delete Tour',
            content:'Are you sure to delete the tour?'
        });
        setModalType('info');
        setModalAction('delete');
    };
    const handleModalDeleteTour = async ()=>{
        try {
            const result = await dispatch(deleteTourApi({
            url:`${import.meta.env.VITE_TOUR_MAIN_URL}/${selectedTourId}`
        }));
        if(deleteTourApi.fulfilled.match(result)){
            console.log('deleted tour');
            setModalData({
                title:'Tour Delete',
                content:'Tour deleted successfully!'
            });
            setModalType('success');
            setShowModal(false);
        }else if(deleteTourApi.rejected.match(result)){
            console.log('could not delete tour',result.payload);
            setModalData({
                title:'Tour Delete',
                content:result.payload
            });
            setModalType('error');
            setShowModal(true);
        }
        } catch (error) {
            console.log('error',error.message);
            setModalData({
                title:'Tour Delete',
                content:error.message
            });
            setModalType('error');
            setShowModal(true);
        }
        
    }
    const handleDeletePlace = (placeId)=>{
        console.log('delete place',placeId);
    }
  return (
    <>
    <Typography className='center'>Tours List</Typography>
        {
            data?.data?.map((place)=>(
                <ReusableEachStaticMapCard
                key={place?._id}
                place={place}
                handleAddPlace={handleAddPlace}
                handleVisitTour={handleVisitTour}
                handleDeleteTour={handleDeleteTour}
                handleDeletePlace={handleDeletePlace}
                />
            ))
        }
        {
            showModal && (
                <UniversalModal
                    showModal={showModal}
                    modalData={modalData}
                    modalAction={modalAction}
                    modalType={modalType}
                    setShowModal={setShowModal}
                    setModalData={setModalData}
                    setModalType={setModalType}
                    setModalAction={setModalAction}
                    deleteFunctionReference={handleModalDeleteTour}

                />
            )
        }
    </>
  )
}

export default ListOfTours;

