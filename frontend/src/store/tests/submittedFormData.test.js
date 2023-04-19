import { submittedFormDataActions, default as submittedFormDataReducer } from "./submittedFormData";

//test file for
describe("submittedFormDataReducer", () => {
  test("should set submittedFormData correctly", () => {
    const initialState = {
      submittedFormData: false,
    };

    const action = {
      type: submittedFormDataActions.setSubmittedFormData.type,
      payload: true,
    };

    const nextState = submittedFormDataReducer(initialState, action);

    expect(nextState).toEqual({
      submittedFormData: true,
    });
  });

  test("should handle invalid action type", () => {
    const initialState = {
      submittedFormData: false,
    };

    const action = {
      type: "INVALID_ACTION_TYPE",
    };

    const nextState = submittedFormDataReducer(initialState, action);

    expect(nextState).toEqual(initialState);
  });
});
