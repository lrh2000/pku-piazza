import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import useSWR from "swr";
import Header from "../src/ui/Header";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Courses() {
  const { data } = useSWR("/api/courses", fetcher);

  const STATE_CLOSED = 0;
  const STATE_PREPARED = 1;
  const STATE_PROCESSING = 2;

  const [dMessage, setDMessage] = useState("");
  const [dState, setDState] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(0);

  const [cMessage, setCMessage] = useState("\u200b");
  const [cState, setCState] = useState(STATE_CLOSED);

  let courseList;
  let footer = null;
  if (!data) {
    courseList = (
      <Box display="flex" flexDirection="column" alignItems="center">
        <CircularProgress />
        <Box mt="10px">
          <Typography variant="h5"> Loading... </Typography>
        </Box>
      </Box>
    );
  } else if (data.courses.length === 0) {
    courseList = (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box mt="10px">
          <Typography
            variant="h5"
            color="textSecondary"
            align="center"
            gutterBottom
          >
            {" "}
            No courses yet.{" "}
          </Typography>
        </Box>
      </Box>
    );
  } else {
    let delButton = () => null;
    let delDialog = null;

    if (data.user.identity === 1) {
      const prepareDelete = (course) => {
        if (currentCourse !== course) {
          setCurrentCourse(course);
          setDMessage("");
        }
        setDState(STATE_PREPARED);
      };

      const performDelete = () => {
        setDState(STATE_PROCESSING);
        setDMessage("Processing...");
        fetch("/api/courses", {
          body: JSON.stringify({
            action: "destroy",
            cid: currentCourse,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        })
          .then((x) => x.json())
          .then((res) => {
            if (res.ok) {
              window.location.reload();
            } else {
              setDMessage(res.msg);
            }
            setDState(STATE_PREPARED);
          });
      };

      const handleDeleteClose = () => {
        if (dState === STATE_PREPARED) {
          setDState(STATE_CLOSED);
        }
      };

      // eslint-disable-next-line react/display-name
      delButton = (cid) => (
        <Box display="inline-block" width="20%">
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              prepareDelete(cid);
            }}
          >
            Delete
          </Link>
        </Box>
      );

      delDialog = (
        <Dialog
          open={dState > STATE_CLOSED}
          onClose={handleDeleteClose}
          maxWidth="lg"
        >
          <DialogTitle>Deleting this course?</DialogTitle>
          <DialogContent>
            <DialogContentText color="secondary">{dMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              disabled={dState !== STATE_PREPARED}
              onClick={performDelete}
            >
              Yes
            </Button>
            <Button
              color="primary"
              disabled={dState !== STATE_PREPARED}
              onClick={handleDeleteClose}
            >
              No
            </Button>
          </DialogActions>
        </Dialog>
      );

      const prepareCreate = () => {
        setCState(STATE_PREPARED);
      };

      const performCreate = (event) => {
        event.preventDefault();
        setCState(STATE_PROCESSING);
        setCMessage("Processing...");
        fetch("/api/courses", {
          body: JSON.stringify({
            action: "create",
            name: event.target.name.value,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        })
          .then((x) => x.json())
          .then((res) => {
            if (res.ok) {
              window.location.reload();
            } else {
              setCMessage(res.msg);
            }
            setCState(STATE_PREPARED);
          });
      };

      const handleCreateClose = () => {
        if (cState === STATE_PREPARED) {
          setCState(STATE_CLOSED);
        }
      };

      footer = (
        <React.Fragment>
          <Box
            mx="10px"
            px="10px"
            pt="10px"
            mt="10px"
            display="flex"
            component="span"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={prepareCreate}
            >
              Add Course
            </Button>
          </Box>

          <Dialog
            open={cState > STATE_CLOSED}
            onClose={handleCreateClose}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>Adding course</DialogTitle>
            <form onSubmit={performCreate}>
              <DialogContent>
                <TextField
                  variant="outlined"
                  label="Course name"
                  inputProps={{ minLength: 10, maxLength: 60 }}
                  name="name"
                  autoFocus
                  fullWidth
                  required
                ></TextField>
                <DialogContentText color="secondary">
                  {cMessage}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  color="primary"
                  disabled={cState !== STATE_PREPARED}
                  type="submit"
                >
                  Submit
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </React.Fragment>
      );
    }

    const courseItems = data.courses.map((course) => (
      <React.Fragment key={course.courseid}>
        <ListItem>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6">{course.name}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Box display="inline-block" width="20%">
                <Link href={`/homework/${course.courseid}`}>Homework</Link>
              </Box>
              <Box display="inline-block" width="20%">
                <Link href={`/discussion/${course.courseid}`}>Discussion</Link>
              </Box>
              {delButton(course.courseid)}
            </Grid>
          </Grid>
        </ListItem>
        <Divider />
      </React.Fragment>
    ));
    courseList = (
      <React.Fragment>
        <List>
          <Divider />
          {courseItems}
        </List>
        {delDialog}
      </React.Fragment>
    );
  }

  return (
    <div>
      <Header title="Course List" data={data} />
      <Container>
        <Box mx="10px" px="10px" pt="10px" mt="10px">
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Typography> </Typography>
            <Typography color="textPrimary">Course List</Typography>
          </Breadcrumbs>
        </Box>
        <Box
          border={1}
          borderRadius="borderRadius"
          borderColor="grey.500"
          m="10px"
          p="10px"
          minHeight="500px"
        >
          {courseList}
        </Box>
        {footer}
      </Container>
    </div>
  );
}
