import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NavigateBackComponent = (props) => {
    
    const navigate = useNavigate();
    const {btnText} = props;
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
          {btnText}
        </Button>
    </Box>
    </>
  )
}

export default NavigateBackComponent;