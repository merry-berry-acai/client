import { Box, Container, Typography } from "@mui/material"

const PageNotFound = () => {
    return (
      <Box sx={{
        background: 'linear-gradient(to bottom, #8e24aa, #4a148c)',
        color: '#fff',
        py: 8,
        textAlign: 'center'
      }}>
        <Container>
          <Typography variant="h2" gutterBottom>
            404 - Page Not Found
          </Typography>
          <Typography variant="h5" gutterBottom>
            You've reached a page that doesn't exist.
          </Typography>
        </Container>
      </Box>

      )
      }

export default PageNotFound