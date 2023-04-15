import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import './css/messageContainer.css';

const useStyles = makeStyles((theme) => ({
  list: {
    width: '100%',
    overflowWrap: 'break-word',
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: 'inline'
  },
  content: {
    fontSize: '20px',
    backgroundColor: '#f2f2f2',
    alignItems: 'end',
    borderRadius: '10px',
    border: '1px solid #f2f2f2'
  },
  frame: {
    border: '2px black solid',
    borderRadius: '10px',
    backgroundColor: 'green'
  },
  userMessage: {
    justifyContent: 'flex-end',
    display: 'flex',
    textAlign: 'end'
  },
  otherMessage: {
    justifyContent: 'flex-start',
    display: 'flex',
    textAlign: 'start'
  },
  listItem: {
  }
}));

function MessageContainer({message, onMessageClick}) {
  const classes = useStyles();

  const formatMessageDate = (date) => {
    const options = {
      hour: "numeric",
      minute: "numeric"
    };
    return new Date(date).toLocaleTimeString(undefined, options).replace(/^0/, '');
  };

  return (
          <div key={message.messageId}>
            <ListItem multiline selected={true} class={`${message.isUserOwner? classes.userMessage : classes.otherMessage}`}>
              <ListItemText class={classes.listItem}
                primary={
                    <>
                    <Typography
                      component="span"
                      variant="inherit"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      {message.login}
                      {' — '}
                      {formatMessageDate(message.dateTime)}
                    </Typography>
                  </>
                }
                secondary={
                  <>
                    <div onClick = {onMessageClick(message)} class={classes.content}>
                        {message.text}
                    </div>
                  </>
                }
              />
            </ListItem>
          </div>
  );
}

MessageContainer.defaultProps = {};

export default MessageContainer;