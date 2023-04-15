import { Menu, MenuItem } from "@material-ui/core";
import PropTypes from 'prop-types';

function MessageMenu({anchor, closeMenu, onMenuItemClick}) {
    return (
        <Menu
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={closeMenu}
        keepMounted
      >
        <MenuItem
            onClick={(event) => onMenuItemClick(event, 'EDIT')}
        >
            Edit
        </MenuItem>
        <MenuItem
            key='DELETE'
            onClick={(event) => onMenuItemClick(event, 'DELETE')}
        >
            Delete
        </MenuItem>
      </Menu>
    );
}
MessageMenu.propTypes = {
    onMenuItemClick: PropTypes.string.isRequired,
    closeMenu: PropTypes.func.isRequired
  };

export default MessageMenu;