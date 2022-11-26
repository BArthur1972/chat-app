import "./ProfileImage.css";

function ProfileImage(props) {

    const user = props.userObject;

    return (
        <>
            <img src={user.picture} alt="" className="member-status-img" />
            {user.status === "online" ? <i className="fas fa-circle sidebar-online-status"></i> : <i className="fas fa-circle sidebar-offline-status"></i>}
        </>
    )
};

export default ProfileImage;