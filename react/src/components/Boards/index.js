import React, {useEffect, useState} from 'react';
import Layout from '../Layout/Layout';
import {bindActionCreators} from 'redux';

import {connect} from 'react-redux';
import http from '../../libs/http';

const mapStateToProps = function(store) {
    return {
        user: store.user.user
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch);
};

function Boards(props) {
    const [boardsFetched, setBoardsFetched] = useState(false);
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        if (!boardsFetched) {
            getBoards();
        }
    }, [boardsFetched]);

    const getBoards = async () => {
        let res = await http.route('boards').get();

        if (!res.isError) {
            setBoards(res.data);
            setBoardsFetched(true);
        }
    };

    return <Layout>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Owner</th>
                    <th>Members count</th>
                </tr>
            </thead>
            <tbody>
                {!boardsFetched && <tr>
                    <td colSpan={4}>Loading...</td>
                </tr>}
                {boardsFetched && boards.length === 0 && <tr>
                    <td colSpan={4}>No boards to display.</td>
                </tr>}
                {boardsFetched && boards.length > 0 && boards.map((board, key) => {
                    return <tr key={key}>
                        <td>{board.id}</td>
                        <td>{board.name}</td>
                        <td>{board.user.name}</td>
                        <td>{board.board_users.length}</td>
                    </tr>;
                })}
            </tbody>
        </table>
    </Layout>;
}

export default connect(mapStateToProps, mapDispatchToProps)(Boards);
