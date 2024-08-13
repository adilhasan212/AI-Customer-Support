import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import HMobiledataIcon from '@mui/icons-material/HMobiledata';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{
        bgcolor: '#111',
        color: 'white',
        padding: '1rem',
        textAlign: 'center',
        width: '100%',
        marginTop: 'auto',  // Ensures the footer stays at the bottom
        position: 'bottom',
      }}
    >
      <Box sx={{ marginBottom: '1rem' }}>
        <IconButton 
          href="https://adilhasan.me" 
          target="_blank" 
          sx={{ color: 'darkred','&:hover':{bgcolor:'#222'}, margin: '0 12px'}}
        >
          <TextFormatIcon sx={{ fontSize: 36 }}/>
          </IconButton>

        <IconButton 
          href="https://www.linkedin.com/in/adil-hasan-033304280/" 
          target="_blank" 
          sx={{ color: "#0077B5",  '&:hover':{bgcolor:'#222'}, margin: '0 12px'}}
        >
          <LinkedInIcon sx={{ fontSize: 36 }}/>
        </IconButton>

        <IconButton 
          href="https://github.com/adilhasan212" 
          target="_blank" 
          sx={{ color: 'white', '&:hover':{bgcolor:'#333'}, margin: '0 12px'}}
        >
          <GitHubIcon sx={{ fontSize: 36 }}/>
        </IconButton>
        
        <IconButton 
          href="https://www.instagram.com/adilh212/" 
          target="_blank" 
          sx={{ color: "white",  '&:hover':{bgcolor:'#222'}, margin: '0 12px'}}
        >
          <InstagramIcon sx={{ fontSize: 36 }} />
        </IconButton>

        <IconButton 
          href="https://headstarter.co/" 
          target="_blank" 
          sx={{ color: '#00e3b2', '&:hover':{bgcolor:'#333'}, margin: '0 12px'}}
        >
          <HMobiledataIcon sx={{ fontSize: 36 }}/>
        </IconButton>

      </Box>

      <Box>
        <Typography variant="body2" bgcolor="black" p={1}>
          &copy; 2024 Designed by <span style={{ fontWeight: 'bold' }}>Adil Hasan</span>
        </Typography>
      </Box>
    </Box>
  );
}

export default Footer;
