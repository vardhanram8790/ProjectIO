import { Dialog, DialogActions, DialogContent, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ChatBubbleModalProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

const ChatBubbleModal: React.FC<ChatBubbleModalProps> = ({ open, onClose, message }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          maxWidth: '300px',
          padding: '0px',
          borderRadius: '20px',
          backgroundColor: '#d1f7c4',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden', // Ensures it doesn’t expand beyond the bubble shape
          '& .MuiDialogContent-root': {
            padding: '10px',
            backgroundColor: '#d1f7c4',
          },
          '& .MuiDialogActions-root': {
            padding: '0',
            marginTop: '5px',
          },
          '&:before': {
            content: '""',
            position: 'absolute',
            bottom: '-10px', // Position the tail below
            left: '10px', // Adjust tail position
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '10px solid #d1f7c4', // Color of the tail
          },
        },
      }}
    >
      <DialogContent>
        <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            padding: '2px',
            backgroundColor: '#d1f7c4',
            '&:hover': { backgroundColor: '#b1e8a1' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default ChatBubbleModal;
