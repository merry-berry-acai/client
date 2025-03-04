import React from 'react';
import { useSnackbar } from '../contexts/SnackbarContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Layout from '../components/Layout';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

const ContactPage = () => {
  const { showSuccess } = useSnackbar();
  
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    message: Yup.string().required('Message is required'),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    showSuccess('Message sent successfully!');
    resetForm();
    setSubmitting(false);
  };

  return (
    <Layout>
      <Box sx={{ bgcolor: 'grey.50', py: 6, minHeight: '80vh' }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Typography variant="h6" color="textSecondary" sx={{ maxWidth: '700px', mx: 'auto', mb: 4 }}>
              Have questions or feedback? We'd love to hear from you!
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Contact Information */}
            <Grid item xs={12} md={5}>
              <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                  Get In Touch
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <LocationOnIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      Our Location
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      123 Smoothie Lane<br />
                      Brisbane, QLD 4000
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <AccessTimeIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      Business Hours
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Monday - Friday: 8am - 8pm<br />
                      Saturday - Sunday: 9am - 6pm
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      Email Address
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      hello@merryberry.example
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      Phone Number
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      (07) 1234 5678
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 4 }} />
                
                <Box sx={{ bgcolor: '#e8f4fd', p: 2, borderRadius: 1 }}>
                  <Typography variant="body2">
                    <strong>Note:</strong> This is a school project. Contact information and form submission are for demonstration purposes only.
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Contact Form */}
            <Grid item xs={12} md={7}>
              <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                  Send Us a Message
                </Typography>
                
                <Formik
                  initialValues={{ name: '', email: '', subject: '', message: '' }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, errors, touched }) => (
                    <Form>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            name="name"
                            label="Your Name"
                            fullWidth
                            variant="outlined"
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                            margin="normal"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            name="email"
                            label="Your Email"
                            fullWidth
                            variant="outlined"
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            margin="normal"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            as={TextField}
                            name="subject"
                            label="Subject"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            as={TextField}
                            name="message"
                            label="Your Message"
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={5}
                            error={touched.message && Boolean(errors.message)}
                            helperText={touched.message && errors.message}
                            margin="normal"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            size="large" 
                            fullWidth 
                            disabled={isSubmitting}
                            sx={{ mt: 2, py: 1.5, bgcolor: '#4a148c', '&:hover': { bgcolor: '#6a1b9a' } }}
                          >
                            Send Message
                          </Button>
                        </Grid>
                      </Grid>
                    </Form>
                  )}
                </Formik>
              </Paper>
            </Grid>
          </Grid>
          
          {/* Map Placeholder */}
          <Paper 
            elevation={3} 
            sx={{ 
              mt: 6, 
              p: 2, 
              height: '300px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: '#f5f5f5'
            }}
          >
            <Typography variant="subtitle1" color="textSecondary">
              [Google Map would appear here in a real application]
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
};

export default ContactPage;
