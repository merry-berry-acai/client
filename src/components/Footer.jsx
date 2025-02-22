import { Link } from 'react-router-dom';
import { Container, Grid, Typography, Box } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#4a148c', color: '#fff', py: 6, mt: 4 }}>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>Merry Berry</Typography>
            <Typography variant="body2">
              Fresh, healthy, and delicious smoothies & bowls
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>Quick Links</Typography>
            <Typography variant="body2">
              <Link to="/menu" style={{ color: '#fff' }}>Menu</Link><br />
              <Link to="/about" style={{ color: '#fff' }}>About</Link><br />
              <Link to="/contact" style={{ color: '#fff' }}>Contact</Link><br />
              <Link to="/admin" style={{ color: '#fff' }}>Admin Panel</Link>
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>Legal</Typography>
            <Typography variant="body2">
              <Link to="/privacy" style={{ color: '#fff' }}>Privacy</Link><br />
              <Link to="/terms" style={{ color: '#fff' }}>Terms</Link>
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>Connect</Typography>
            <Typography variant="body2">
              {/* Social media icons */}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Footer;
