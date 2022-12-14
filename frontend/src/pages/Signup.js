import React, { useState } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { useSignupUserMutation } from "../services/appApi";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import profileImage from "../assets/profile_placeholder.jpg";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupUser, { isLoading, error }] = useSignupUserMutation();
  const navigate = useNavigate();

  // States for uploading and setting profile images
  const [image, setImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  function validateImage(e) {
    const file = e.target.files[0];

    // Check if image size is greater than 1mb
    if (file.size > 1048576) {
      return alert("Max file size is 1 MB");
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function uploadImage() {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "chat_app_uploaded_image");

    // Upload image to cloudinary api
    try {
      setUploadingImage(true);
      const cloudinary_cloud_name = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
      let res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinary_cloud_name}/upload`,
        {
          method: "post",
          body: data,
        }
      );

      const urlData = await res.json();
      setUploadingImage(false);
      return urlData.url;
    } catch (e) {
      setUploadingImage(false);
      console.log(e);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    if (!image) return alert("Please upload your profile");
    const url = await uploadImage(image);
    console.log(url);

    // TODO: Sign up the user
    signupUser({ name, email, password, picture: url }).then(({ data }) => {
      if (data) {
        console.log(data);
        navigate("/chat");
      }
    });
  }

  return (
    <Container>
      <Row>
        <Col
          md={7}
          className="d-flex align-items-center justify-content-center flex-direction-column"
        >
          <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleSignup}>
            <h1 className="text-center">Create An Account</h1>
            <div className="signup-profile-pic__container">
              <img
                src={imagePreview || profileImage}
                className="signup-profile-pic"
                alt=""
              />
              <label htmlFor="image-upload" className="image-upload-label">
                <i className="fas fa-plus-circle add-picture-icon"></i>
              </label>
              <input
                type="file"
                id="image-upload"
                hidden
                accept="image/png, image/jpeg"
                onChange={validateImage}
              />
            </div>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Your Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Your Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {uploadingImage ? "Signing You Up..." : "Sign Up"}
            </Button>
            <div className="py-4">
              <p className="text-center">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </Form>
        </Col>
        <Col md={5} className="signup__bg"></Col>
      </Row>
    </Container>
  );
}

export default Signup;
