import React, {Fragment} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

const mapStateToProps = function(store) {
    return {
        user: store.user.user
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch);
};

function Header(props) {
    const {user} = props;

    return (
        <header className={'header'}>
            <Link to={'/'}>Home</Link> | {user && <Fragment>
            <Link to={'profile'}>Profile</Link> | <Link to={'boards'}>Boards</Link> | <Link
            to={'logout'}>Logout</Link>
        </Fragment>} {!user && <Fragment>
            <Link to={'login'}>Login</Link>
        </Fragment>}
        </header>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
