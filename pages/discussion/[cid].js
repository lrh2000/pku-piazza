import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Link from '@material-ui/core/Link'
import Box from '@material-ui/core/Box'

import { getCourseName } from '../../src/db/courses.js'

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps(context) {
  const id = Number.parseInt(context.params.cid);
  const name = await getCourseName(id);
  if (!name) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      courseId: id,
      courseName: name,
    },
  };
}

export default function Discussion({ courseId, courseName }) {
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
                {courseName}: Discussion
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
                {courseName}
              </Typography>
              <Breadcrumbs separator="/" aria-label="breadcrumb">
                <Typography color="textPrimary">
                  Discussion
                </Typography>
                <Link color="inherit" href={`/homework/${courseId}`}>
                  Homework
                </Link>
              </Breadcrumbs>
            </Breadcrumbs>
          </Breadcrumbs>
        </Box>
        <Box border={1} borderRadius="borderRadius" borderColor="grey.500" m="10px" p="10px" minHeight="500px">
        </Box>
      </Container>
    </div>
  );
}
