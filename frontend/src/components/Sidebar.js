import React, { useContext, useEffect } from "react";
import { Col, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import { addNotifications, resetNotifications } from "../features/userSlice";
import ProfileImage from "./ProfileImage";
import "./Sidebar.css";

function Sidebar() {
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const { socket, setMembers, members, setCurrentChannel, setChannels, privateMemberMessage, channels, setPrivateMemberMessage, currentChannel } = useContext(AppContext);

	function joinChannel(channel, isPublic = true) {
		if (!user) {
			return alert("Please login");
		}
		socket.emit("join-channel", channel, currentChannel);
		setCurrentChannel(channel);

		if (isPublic) {
			setPrivateMemberMessage(null);
		}
		// dispatch for notifications
		dispatch(resetNotifications(channel));
	}

	socket.off("notifications").on("notifications", (channel) => {
		if (currentChannel !== channel) dispatch(addNotifications(channel));
	});

	useEffect(() => {
		if (user) {
			setCurrentChannel("general");

			fetch("http://localhost:5001/channels")
				.then((res) => res.json())
				.then((data) => setChannels(data));

			socket.emit("join-channel", "general");
			socket.emit("new-user");
		}

	}, [socket, user, setChannels, setCurrentChannel]);

	socket.off("new-user").on("new-user", (payload) => {
		setMembers(payload);
	});


	function orderIds(id1, id2) {
		if (id1 > id2) {
			return id1 + "-" + id2;
		} else {
			return id2 + "-" + id1;
		}
	}

	function handlePrivateMemberMessage(member) {
		setPrivateMemberMessage(member);
		const channelId = orderIds(user._id, member._id);
		joinChannel(channelId, false);
	}

	if (!user) {
		return <></>;
	}
	return (
		<>
			<h2 className="sidebar-header">Available Channels</h2>
			<ListGroup>
				{channels.map((channel, idx) => (
					<ListGroup.Item key={idx} onClick={() => joinChannel(channel)} active={channel === currentChannel} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
						{channel} {currentChannel !== channel && <span className="badge rounded-pill bg-primary">{user.newMessages[channel]}</span>}
					</ListGroup.Item>
				))}
			</ListGroup>
			<h2 className="sidebar-header">Members</h2>
			{members.map((member, idx) => (
				<ListGroup.Item key={idx} style={{ cursor: "pointer" }} active={privateMemberMessage?._id === member?._id} onClick={() => handlePrivateMemberMessage(member)} disabled={member._id === user._id}>
					<Row>
						<Col xs={2} className="member-status">
							<ProfileImage userObject={member} />
						</Col>
						<Col xs={9}>
							{member.name}
							{member._id === user?._id && " (You)"}
							{member.status === "offline" && " (Offline)"}
						</Col>
						<Col xs={1}>
							<span className="badge rounded-pill bg-primary">{user.newMessages[orderIds(member._id, user._id)]}</span>
						</Col>
					</Row>
				</ListGroup.Item>
			))}
		</>
	);
}

export default Sidebar;
