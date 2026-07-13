import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { List, ListItem, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { addPlaceInTourApi, deleteTourUnresolvedPlaceApi } from '../../../app/thunkApiCalls';
import { addPlaceInTour, fetchUnResolvedPlacesFromTourId, updateResolvedPlacesInTour } from '../../../app/mapSlicer';
import { useDispatch, useSelector } from 'react-redux';
import UniversalModal from '../../../features/UniversalModal';
import useModal from '../../../reusables/useModal';
import { useParams } from 'react-router-dom';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function AddPlaceButton(props) {
  const {addPlaceData,searchedString,setSearchedString,setSearch} = props;
  const [open, setOpen] = React.useState(false);
  const unResolvedPlacesData = useSelector((state)=>state.mapSlicer.unresolvedPlaces);
  const dispatch = useDispatch();
  const {tourId} = useParams();
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

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleAddPlace = async (e)=>{
    e.preventDefault();
    // call api with searched string
    const requiredObj = {searchQuery:searchedString};
    const tourId = addPlaceData?.tourId;
    try {
      const url = import.meta.env.VITE_ADD_PLACE_IN_TOUR_TAIL_URL.replace(":tourId",tourId);
      const result = await dispatch(addPlaceInTourApi({
        url,
        data:requiredObj
      }));
      if(addPlaceInTourApi.fulfilled.match(result)){
        const data = result.payload;
        // console.log('add place fulfilled',data);
        dispatch(addPlaceInTour(data));
        setModalData({
          title:'Add Place',
          content:`${searchedString} added successfully!`
        }),
        setModalType('success');
        setSearchedString('');
        setSearch('');
      }else if(addPlaceInTourApi.rejected.match(result)){
        // console.log('error',result.payload);
        setModalData({
          title:'Add Place',
          content: result.payload
        }),
        setModalType('error');
      }
        setShowModal(true);
    } catch (error) {
        // console.log('error',error.message);
        setModalData({
          title:'Add Place',
          content: error.message
        }),
        setModalType('error');
        setShowModal(true);
    }
  };
  const handleDeleteUnresolvedPlace = async (searchQuery)=>{
    try {
      const url = `${import.meta.env.VITE_DELETE_TOUR_UNRESOLVED_PLACE.replace(':tourId',addPlaceData?.tourId)}`;
      const result = await dispatch(deleteTourUnresolvedPlaceApi({
        url,
        data:{searchQuery}
      }));
      if(deleteTourUnresolvedPlaceApi.fulfilled.match(result)){
        setModalData({
          title:'Delete Unresolved place',
          content: 'Successfully deleted unresolved place!'
        });
        setModalType('success');
        setShowModal(true);
        // console.log('delete unresolved',{tourId,searchQuery});
        // dispatch(fetchUnResolvedPlacesFromTourId(tourId));
        
        dispatch(updateResolvedPlacesInTour(result.payload?.data));
      }else if(deleteTourUnresolvedPlaceApi.rejected.match(result)){
        setModalData({
          title:'Delete Unresolved place',
          content: result.payload
        });
        setModalType('error');
        setShowModal(true);

      }
    } catch (error) {
      setModalData({
          title:'Delete Unresolved place',
          content: error.message
        });
        setModalType('error');
        setShowModal(true);
    }
  }
  // console.log('unresolved',resolvedPlacesData);
  
  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleAddPlace}>Add Place in this Tour</Button>
      <Button variant="outlined" onClick={handleClickOpen}>
        Un Resolved Places
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Un Resolved Places of this Tour
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
            <List>
          {
            // addPlaceData?.unresolvedPlaces?.length>0 ?(
            //   addPlaceData?.unresolvedPlaces?.map((place)=>(
            unResolvedPlacesData.length>0 ?(
              unResolvedPlacesData.map((place)=>(
                <ListItem
                key={place?.searchQuery}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" 
                    onClick={()=>handleDeleteUnresolvedPlace(place?.searchQuery)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  {/* <ListItemAvatar>
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar> */}
                  <ListItemText
                    primary={place?.searchQuery}
                    // secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
              ))
                

            ):<ListItem>
                <ListItemText>Unresolved places are empty!</ListItemText>
            </ListItem>
          }
            </List>
        </DialogContent>
      </BootstrapDialog>
      <UniversalModal
      showModal={showModal}
      modalData={modalData}
      modalType={modalType}
      setShowModal={setShowModal}
      setModalData={setModalData}
      setModalType={setModalType}
      />
    </React.Fragment>
  );
}
