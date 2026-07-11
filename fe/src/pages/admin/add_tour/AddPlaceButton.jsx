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
import { addPlaceInTourApi } from '../../../app/thunkApiCalls';
import { addPlaceInTour } from '../../../app/mapSlicer';
import { useDispatch } from 'react-redux';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function AddPlaceButton(props) {
  const {addPlaceData,searchedString,setSearchedString} = props;
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();

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
        console.log('data',data);
        dispatch(addPlaceInTour(data));
        setSearchedString('');
        setSearch('');
      }else if(addPlaceInTourApi.rejected.match(result)){
        console.log('error',result.payload);
      }
    } catch (error) {
        console.log('error',error.message);
    }
  };
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
            addPlaceData?.unresolvedPlaces?.length>0 ?(
              addPlaceData?.unresolvedPlaces?.map((place)=>(
                <ListItem
                key={place?.searchQuery}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete">
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
    </React.Fragment>
  );
}
