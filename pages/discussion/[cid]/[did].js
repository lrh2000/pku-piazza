import React,{useState} from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Header from "../../../src/ui/Header";
import useSWR from "swr";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";

import { getCourseName } from "../../../src/db/courses";
import { getDiscussionByDID } from "../../../src/db/discussion";

export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
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
  const did = Number.parseInt(context.params.did);
  const discussion = await getDiscussionByDID(did);
  if (!discussion) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      courseId: id,
      courseName: name,
      discussionId: did,
    },
  };
}

function Discussion({ courseId, courseName, discussionId }) {
  const fetcher = (url, courseId, discussionId) =>
    fetch(url, {
      body: JSON.stringify({
        action: "content",
        payload: {
          courseId: courseId,
          discussionId: discussionId,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then((r) => r.json());
  const { data } = useSWR(["/api/discussion", courseId, discussionId], fetcher);
  const STATE_CLOSED = 0;
  const STATE_LOADING = 1;
  const STATE_PREPARED = 2;
  const STATE_SUBMITTING = 3;
  const [state, setState] = useState(false);
  const [submissionContent, setSubmissionContent] = useState("");
  const [message, setMessage] = useState("");

  const D_STATE_CLOSED = 0;
  const D_STATE_LOADING = 1;
  const D_STATE_PREPARED = 2;
  const D_STATE_DELETING = 3;
  const [d_state, setD_state] = useState(false);
  const [currentContent, setCurrentContent] = useState({
    discussionid: 0,
    postid: 0,
  });
  const prepareDelete = (discussionContent) => {
    if (discussionContent.discussionid !== currentContent.discussionid ||
        discussionContent.postid !== currentContent.postid
        ) {
          setCurrentContent({
          discussionid: discussionContent.discussionid,
          postid: discussionContent.postid,
        });
        setMessage("");
      }
    setD_state(D_STATE_PREPARED);
  };
  const performDelete = () => {
    setD_state(D_STATE_DELETING);
    setMessage("Processing...");
    fetch(
        "/api/discussion",
        {
          body: JSON.stringify({
            action: "deleteContent",
            payload: {
              discussionId: currentContent.discussionid,
              postId: currentContent.postid,
            },
          }), 
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        }
    )
      .then((x) => x.json())
      .then((res) => {
        if (res.ok) {
          window.location.reload();
        } else {
          setMessage(res.msg);
        }
        setD_state(D_STATE_PREPARED);
      });
  };

  const handleDeleteClose = () => {
    if (d_state === D_STATE_PREPARED) {
      setD_state(D_STATE_CLOSED);
    }
  };

  const prepareSubmission = () =>{
    setState(STATE_PREPARED);
  };
  const performSubmission = () =>{
    setState(STATE_SUBMITTING);
    setMessage("Processing...");
    fetch(
      "/api/discussion",
      {
        body: JSON.stringify({
          action: "submitContent",
          payload: {
            discussionId: discussionId,
            content: submissionContent,
          },
        }), 
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    )
      .then((x) => x.json())
      .then((res) => {
        if (res.ok) {
          window.location.reload();
        } else {
          setMessage(res.msg);
        }
        setState(STATE_PREPARED);
      });
  };
  const handleSubmissionClose = () => {
    if (state === STATE_PREPARED) {
      setState(STATE_CLOSED);
    }
  };

  let discussionContentList;
  if (!data) {
    discussionContentList = (
      <Box display="flex" flexDirection="column" alignItems="center">
        <CircularProgress />
        <Box mt="10px">
          <Typography variant="h5"> Loading... </Typography>
        </Box>
      </Box>
    );
  } else {
    if (data.user.identity === 1){
        const discussionContentItems = data.content.map((discussionContent) => (
            <ListItem key={discussionContent}>
              <Box width="100%">
                <Card>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Thread {discussionContent.postid}
                    </Typography>
                    <Typography color="textSecondary">
                      Create User: {discussionContent.userid}
                    </Typography>
                    <Typography color="textSecondary">
                      Create Date: {discussionContent.createdate}
                    </Typography>
                    <Typography>{discussionContent.content}</Typography>
                  </CardContent>
                  <CardActions>
                    <Box 
                      display="flex" 
                      component="span"
                      justifyContent="space-between" 
                      alignItems="center"
                    >
                      <Button
                        size="Small"
                        color="primary"
                        variant="contained" 
                        alignItems="left"
                        onClick={() => prepareDelete(discussionContent)}
                        >
                        Delete
                      </Button>
                    </Box>
                  </CardActions>
                </Card>
              </Box>
            </ListItem>
        ));
        discussionContentList = <List>{discussionContentItems}</List>;
    }else{
        const discussionContentItems = data.content.map((discussionContent) => (
            <ListItem key={discussionContent}>
              <Box width="100%">
                <Card>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Thread {discussionContent.postid}
                    </Typography>
                    <Typography color="textSecondary">
                      Create User: {discussionContent.userid}
                    </Typography>
                    <Typography color="textSecondary">
                      Create Date: {discussionContent.createdate}
                    </Typography>
                    <Typography>{discussionContent.content}</Typography>
                  </CardContent>
                </Card>
              </Box>
            </ListItem>
        ));
        discussionContentList = <List>{discussionContentItems}</List>;
    }
  }
  let dialogContent;
  if (state === STATE_LOADING) {
    dialogContent = (
      <Box display="flex" flexDirection="column" alignItems="center">
        <CircularProgress />
        <Box mt="10px">
          <Typography variant="h5"> Loading... </Typography>
        </Box>
      </Box>
    );
  } else {
    dialogContent = (
      <React.Fragment>
        <DialogContentText>Please express your opinion: </DialogContentText>
        <TextField
          variant="outlined"
          rows="10"
          placeholder="Writing your opinion here..."
          value={submissionContent}
          onChange={(e) => setSubmissionContent(e.target.value)}
          autoFocus
          multiline
          fullWidth
        ></TextField>
        <DialogContentText color="secondary">{message}</DialogContentText>
      </React.Fragment>
    );
  }
  return (
    <div>
      <Header title={`${courseName}: Discussion`} data={data} />
      <Container>
        <Box mx="10px" px="10px" pt="10px" mt="10px">
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Typography></Typography>
            <Link color="inherit" href="/courses">
              Course List
            </Link>
            <Breadcrumbs separator=":" aria-label="breadcrumb">
              <Typography color="textPrimary">{courseName}</Typography>
              <Breadcrumbs separator="/" aria-label="breadcrumb">
                <Typography color="textPrimary">Discussion</Typography>
                <Link color="inherit" href={`/homework/${courseId}`}>
                  Homework
                </Link>
              </Breadcrumbs>
            </Breadcrumbs>
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
          {discussionContentList}
        </Box>
        <Box mx="10px" px="10px" pt="10px" mt="10px" 
          display="flex" 
          component="span"
          justifyContent="space-between" 
          alignItems="center"
        >
          <Button
            size="Small"
            color="primary"
            variant="contained" 
            alignItems="left"
            onClick={prepareSubmission}
          >
            Create Thread
          </Button>
        </Box>
      </Container>
      <Dialog
        open={state > STATE_CLOSED}
        onClose={handleSubmissionClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Creating thread</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>
          <Button
            color="primary"
            disabled={state !== STATE_PREPARED}
            onClick={performSubmission}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={d_state > D_STATE_CLOSED}
        onClose={handleDeleteClose}
        maxWidth="lg"
      >
        <DialogTitle>Deleting this thread?</DialogTitle>
        <DialogContent>
        <DialogContentText color="secondary">{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            disabled={d_state !== D_STATE_PREPARED}
            onClick={performDelete}
            alignItems="left"
          >
            Yes
          </Button>
          <Button
            color="primary"
            disabled={d_state !== D_STATE_PREPARED}
            onClick={()=>{window.location.reload();
                setD_state(D_STATE_PREPARED);}}
            alignItems="right"
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

Discussion.propTypes = {
  courseId: PropTypes.number.isRequired,
  courseName: PropTypes.string.isRequired,
  discussionId: PropTypes.number.isRequired,
};

export default Discussion;
