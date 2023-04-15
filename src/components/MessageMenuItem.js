import MenuItem from "@material-ui/core";

function MessageMenuItem(index, onMenuItemClick) {
    return (
        <MenuItem
        key={index}
        onClick={(event) => onMenuItemClick(event, index)}
      >
        {option}
      </MenuItem>
    );
}

export default MessageMenuItem;