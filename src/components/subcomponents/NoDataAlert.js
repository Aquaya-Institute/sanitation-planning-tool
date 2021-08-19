import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import { IconButton, Collapse } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    marginLeft: 175,
    "& > * + *": {
      marginTop: theme.spacing(1),
    },
    zIndex: 1000,
  },
}));

export default function NoDataAlert() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  return (
    <div className={classes.root}>
      <Collapse in={open}>
        <Alert
          severity="warning"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          This country has areas with inconsistent data, check various
          resolutions for variable availability.
        </Alert>
      </Collapse>
    </div>
  );
}
