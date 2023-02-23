import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBCol, MDBRow, MDBInput, MDBCheckbox } from "mdb-react-ui-kit";

function Login() {
  return (
    <MDBContainer fluid>
      <div className="p-5 bg-image" style={{ backgroundImage: "url(https://mdbootstrap.com/img/new/textures/full/171.jpg)", height: "300px" }}></div>

      <MDBCard className="p-5 shadow-5" style={{ margin: "-150px auto 0", width: "60%", background: "hsla(0, 0%, 100%, 0.8)", backdropFilter: "blur(30px)" }}>
        <MDBCardBody className="p-5 text-center">
          <h2 className="fw-bold mb-5">Sign up now</h2>

          <MDBRow>
            <MDBCol col="6">
              <MDBInput wrapperClass="mb-4" label="First name" id="form1" type="text" />
            </MDBCol>

            <MDBCol col="6">
              <MDBInput wrapperClass="mb-4" label="Last name" id="form1" type="text" />
            </MDBCol>
          </MDBRow>

          <MDBInput wrapperClass="mb-4" label="Email" id="form1" type="email" />
          <MDBInput wrapperClass="mb-4" label="Password" id="form1" type="password" />

          <div className="d-flex justify-content-center mb-4">
            <MDBCheckbox name="flexCheck" value="" id="flexCheckDefault" label="Subscribe to our newsletter" />
          </div>

          <MDBBtn className="w-75 mb-4" size="md">
            sign up
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default Login;
