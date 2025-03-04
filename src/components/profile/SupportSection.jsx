import React from 'react';
import { 
  Box, Card, CardContent, CardHeader, 
  Typography, Button 
} from '@mui/material';
import { User, FileText } from "lucide-react";

const SupportSection = () => {
  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardHeader 
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <User size={20} color="purple" />
            <Typography variant="h6">Support</Typography>
          </Box>
        }
        sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button 
          variant="outlined" 
          fullWidth 
          startIcon={<FileText size={16} />} 
          sx={{ 
            color: 'purple',
            borderColor: 'purple',
            '&:hover': { borderColor: 'darkviolet' }
          }}
        >
          Contact Support
        </Button>
        <Button 
          variant="outlined" 
          fullWidth 
          startIcon={<FileText size={16} />}
          sx={{ 
            color: 'purple',
            borderColor: 'purple',
            '&:hover': { borderColor: 'darkviolet' }
          }}
        >
          FAQs & Help
        </Button>
      </CardContent>
    </Card>
  );
};

export default SupportSection;
