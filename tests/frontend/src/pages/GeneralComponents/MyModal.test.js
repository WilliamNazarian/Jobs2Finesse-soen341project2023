import React from "react";
import { mount } from "enzyme";
import MyModal from "./MyModal";

describe("MyModal", () => {
  let wrapper;
  const props = {
    open: true,
    closeModal: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<MyModal {...props} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("renders the modal with correct props", () => {
    expect(wrapper.find("Modal").prop("open")).toBe(true);
    expect(wrapper.find("Modal").prop("onClose")).toBe(props.closeModal);
    expect(wrapper.find("Fade").prop("in")).toBe(true);
  });

  it("renders the modal content with correct styles", () => {
    expect(wrapper.find("Box").prop("sx")).toEqual(expect.objectContaining({
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 500,
      bgcolor: expect.any(String),
      border: `2px solid ${expect.any(String)}`,
      boxShadow: 24,
      p: 4,
      borderRadius: "30px"
    }));
  });

  it("renders the modal title with correct text and styles", () => {
    expect(wrapper.find("Typography").text()).toBe("POST A JOB");
    expect(wrapper.find("Typography").prop("sx")).toEqual(expect.objectContaining({
      textAlign: "center"
    }));
  });

  it("renders the form inside the modal", () => {
    expect(wrapper.find("FormInsideModal").exists()).toBe(true);
  });

  it("calls closeModal prop when modal is closed", () => {
    wrapper.find("Modal").simulate("close");
    expect(props.closeModal).toHaveBeenCalledTimes(1);
  });

  it("calls closeModalHandler prop when form is submitted", () => {
    const formInsideModal = wrapper.find("FormInsideModal");
    formInsideModal.props().onSubmitForm();
    expect(props.closeModal).toHaveBeenCalledTimes(1);
  });
});
