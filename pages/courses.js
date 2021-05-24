import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'

export default function Courses() {
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
                Course List
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Container>
        <Box mx="10px" px="10px" pt="10px" mt="10px">
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Typography> </Typography>
            <Typography color="textPrimary">
              Course List
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box border={1} borderRadius="borderRadius" borderColor="grey.500" m="10px" p="10px" minHeight="500px">
          <List>
            <Divider/>
            <ListItem>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Introduction to Computer Systems
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box display="inline-block" width="20%">
                    <Link href="/homework">
                      Homework
                    </Link>
                  </Box>
                  <Box display="inline-block" width="20%">
                    <Link href="/discussion">
                      Discussion
                    </Link>
                  </Box>
                </Grid>
              </Grid>
            </ListItem>
            <Divider/>
            <ListItem>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Data Structures and Algorithms
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box display="inline-block" width="20%">
                    <Link href="/homework">
                      Homework
                    </Link>
                  </Box>
                  <Box display="inline-block" width="20%">
                    <Link href="/discussion">
                      Discussion
                    </Link>
                  </Box>
                </Grid>
              </Grid>
            </ListItem>
            <Divider/>
          </List>
        </Box>
      </Container>
    </div>
  );
}
