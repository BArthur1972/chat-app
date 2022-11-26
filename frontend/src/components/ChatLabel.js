import React from 'react';

function ChatLabel(props) {
    const user = props.userObject;
    const privateMemberMessage = props.privateMemberMsg;
    const currentChannel = props.currChannel;

    return (
        <div>{user && !privateMemberMessage?._id && <div className="alert alert-info">You are in the {currentChannel} channel</div>}</div>
    )
}

export default ChatLabel;