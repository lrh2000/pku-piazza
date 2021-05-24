import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Link from '@material-ui/core/Link'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'

export default function Discussion() {
  return (
    <div>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Grid container alignItems="center">
            <Grid item xs={4}>
              <Typography variant="h3" align="left">
                PKU Piazza
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6" align="center">
                Introduction to Computer Systems: Homework
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Container>
        <Box mx="10px" px="10px" pt="10px" mt="10px">
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Typography>
            </Typography>
            <Link color="inherit" href="/courses">
              Course List
            </Link>
            <Breadcrumbs separator=":" aria-label="breadcrumb">
              <Typography color="textPrimary">
                Introduction to Computer Systems
              </Typography>
              <Breadcrumbs separator="/" aria-label="breadcrumb">
                <Link color="inherit" href="/discussion">
                  Discussion
                </Link>
                <Typography color="textPrimary">
                  Homework
                </Typography>
              </Breadcrumbs>
            </Breadcrumbs>
          </Breadcrumbs>
        </Box>
        <Box border={1} borderRadius="borderRadius" borderColor="grey.500" m="10px" p="10px" minHeight="500px">
          <Card>
            <CardContent>
              <Typography color="textSecondary">
                2021/5/24
              </Typography>
              <Typography variant="h5" gutterBottom>
                Homework 1
              </Typography>
              <Typography>
                Exercise 2.3.3
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary"> Submit </Button>
            </CardActions>
          </Card>
        </Box>
      </Container>
    </div>
  );
}
