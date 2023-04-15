import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ChatService from '../api/ChatService';
import PropTypes from 'prop-types';

const MAX_LENGTH = 255;
const INITIAL_HELPER_TEXT_STATE = `0 / ${MAX_LENGTH} chars`;

const useStyles = makeStyles(() => ({
  formContainer: {
    display: 'flex',
    alignItems: 'baseline',
    width: '100%'
  },
  inputField: {
    marginRight: '0.5rem',
    width: '100%'
  }
}));

const InputField = ({id, label, buttonValue, editingMessage, onCloseEditing}) => {

  const classes = useStyles();
  const [value, setValue] = useState('');
  const [hasError, setError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [helperText, setHelperText] = useState(INITIAL_HELPER_TEXT_STATE);

  const validate = (value) => {
    setHelperText(`${value.length} /  ${MAX_LENGTH} chars`);
    let flag = value.length > 255 || !value ? false : true;
    flag ? setError(false) : setError(true);
    return flag;
  };

  useEffect(() => {
    if(editingMessage) {
      setValue(editingMessage.text);
      setEditing(true);
    }
  }, [editingMessage])

  const changeValue = (event) => {
    const value = event.target.value;
    setValue(value);
    validate(value);
  };

  const submitValue = (event) => {
    event.preventDefault();
    if (validate(value)) {
      onSubmit(value);
      setValue('');
      setHelperText(INITIAL_HELPER_TEXT_STATE);
    }
  };

  const onSubmit = (message) => {
    if(editing) {
      ChatService.editMessage(editingMessage.messageId, message);
      setEditing(false);
      onCloseEditing();
    } else ChatService.sendMessage(message);
  }

  return (
    <>
    {editing && (
      <div className="editing-message-container">
        <div className="editing-message-text"><strong>Editing</strong> <br></br> {editingMessage?.text}</div>
        <button className="editing-message-cancel-button" onClick={() => {setEditing(false) ; setValue(""); onCloseEditing();}}>✕</button>
      </div>
    )}
    <form
      className={classes.formContainer}
      onSubmit={submitValue}
    >
      <TextField
        className={classes.inputField}
        error={hasError}
        helperText={helperText}
        id={id}
        label={label}
        multiline
        value={value}
        onChange={changeValue}
      />
      <Button
        onClick={submitValue}
        variant="outlined"
        color="primary"
        type="submit"
        size="large"
      >
        {buttonValue}
      </Button>
    </form>
    </>
  );
}


InputField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  buttonValue: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  editingMode: PropTypes.bool
};

export default InputField;