import React, {useEffect, useState, useRef} from 'react';
import {createStompClient} from '../api/stompClient';
import InputField from '../components/InputField';
import {makeStyles} from '@material-ui/core/styles';
import ChatService from '../api/ChatService';
import List from '@material-ui/core/List';
import Title from '../components/Title'
import MessageContainer from '../components/MessageContainer';
import MessageMenu from '../components/MessageMenu';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    textAlign: 'center',
    flexDirection: 'column',
    height: 'calc(100vh - 2rem)',
    width: '100%'
  },
  messageListContainer: {
    flex: 1,
    height: '100%',
    overflow: 'auto'
  },
  inputFieldContainer: {
    boxSizing: 'border-box',
    padding: '1rem',
    width: '100%'
  }
}));

const COUNT_MESSAGES = 20;
const MIN_COUNT_MESSAGES = 0;
const WINDOW_SIZE_INFELICITY = 200;

function Chat() {
    const [wsLastAction, setWsLastAction] = useState(null);
    const inputFieldRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const [numberPage, setNumberPage] = useState(0);
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [allMessagesIsLoaded, setAllMessagesIsLoaded] = useState(false);
    const [prevScrollPosition, setPrevScrollPosition] = useState(0);
    const [isAddedNewMessage, setIsAddedNewMessage] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [anchor, setAnchor] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);

    const handleMessagesContainerScroll = (event) => {
      event.preventDefault();
      if (event.target.scrollTop === 0 && !isLoading && !allMessagesIsLoaded) {
        loadMessages();
      }
    }

    const onCloseEditing = () => {
      setEditingMessage(null);
    }

    const loadMessages = () => {
      setIsLoading(true);
      const messagesContainer = document.querySelector("." + classes.messageListContainer);
      let page = messages.length / COUNT_MESSAGES;
      ChatService.findHistory(page, COUNT_MESSAGES).then(response => {
        console.log(response.data.length);
        if(response.data.length <= 0) { setAllMessagesIsLoaded(true); return; }
        setPrevScrollPosition(messagesContainer.scrollHeight);
        setMessages([...response.data.map((element) => {return { ...element}}), ...messages]);
        setNumberPage(numberPage + 1);
      })
      setIsLoading(false);
    }

    const onMessageClick = (message) => {
      return (event) => {
        event.preventDefault();
        if(!message.isUserOwner) return;
        setSelectedMessage(message);
        setAnchor(event.target);
      }
    }

    const closeMenu = (event) => {
      event.preventDefault();
      setSelectedMessage(null);
      setAnchor(null);
    }

    const onMenuItemClick = (event, index) => {
      event.preventDefault();
      switch(index) {
        case('DELETE'): {
          let index = messages.indexOf(selectedMessage);
          messages.splice(index, 1);
          ChatService.deleteMessage(selectedMessage.messageId);
          break;
        }
        case('EDIT'): {
          setEditingMessage(selectedMessage);
          break;
        }
      }
      setSelectedMessage(null);
      setAnchor(null);
    }
  
    useEffect(() => {
      const messagesContainer = document.querySelector("." + classes.messageListContainer);
      console.log('The last scroll position is: ' + prevScrollPosition + ' ' + messagesContainer.scrollHeight);
      messagesContainer.scrollTop = messagesContainer.scrollHeight - prevScrollPosition;
    }, [prevScrollPosition])

    useEffect(() => {
      createStompClient((response) => {
        console.log('Websocket response: ' + response.body);
        setWsLastAction(JSON.parse(response.body));
      });
    }, [])

    useEffect(() => {
      ChatService.findHistory(MIN_COUNT_MESSAGES, COUNT_MESSAGES).then(response => {
        new Promise(() => setMessages(response.data.map((element) => {return { ...element}}))).then(() => {
          const messageContainer = document.querySelector('.' + classes.messageListContainer);
          messageContainer.scrollTop = messageContainer.scrollHeight;
        });
        setNumberPage(1);
      });
    }, [])

    useEffect(() => {
      if(messages.length <= COUNT_MESSAGES || isAddedNewMessage) {
        setIsAddedNewMessage(false);
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages])

    useEffect(() => {
      if(wsLastAction == null) return;
      switch(wsLastAction.actionType) {
        case('ADD_MESSAGE'): {
          const message = {
            messageId: wsLastAction.messageId,
            text: wsLastAction.text,
            dateTime: wsLastAction.dateTime,
            login: wsLastAction.login,
            isUserOwner: wsLastAction.isUserOwner,
            userId: wsLastAction.userId
          }
          setIsAddedNewMessage(true);
          setMessages([...messages, message]);
          break;
        }
        case('DELETE_MESSAGE'): {
          setMessages(messages.filter(it => it.messageId !== wsLastAction.messageId));
          break;
        }
        case('UPDATE_MESSAGE'): {
          setMessages(messages.map(el => {
            if(el.messageId !== wsLastAction.messageId) return el;
            else { el.text = wsLastAction.text; return el; }}));
          break;
        }
      }
    }, [wsLastAction])

    return (
      <div className={classes.container}>
      <Title/>
      <div className={classes.messageListContainer} onScroll={handleMessagesContainerScroll}>
      <List className={classes.list}>
      {
        messages.map((message) => (
          <MessageContainer message = {message} onMessageClick = {onMessageClick}/>
        ))
      }
    </List>
        <div ref={messagesEndRef} />
      </div>
      <div className={classes.inputFieldContainer} ref = {inputFieldRef}>
        <InputField
          id="message-field"
          label="Enter your message"
          buttonValue="Send"
          editingMessage={editingMessage}
          onCloseEditing={onCloseEditing}
        />
        </div>
      <MessageMenu anchor={anchor} closeMenu={closeMenu} onMenuItemClick={onMenuItemClick}/>
      </div>
    );
}

export default Chat;