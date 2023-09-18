import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import CreateWeekend from "@/app/create-weekend/page";
import axios from "axios";
import { useRouter } from "next/navigation";
import { weekendsAPIData } from "../app/utils/weekendsConsts";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.get.mockImplementation(async () =>
  Promise.resolve({
    data: weekendsAPIData,
  })
);

describe("Create Weekend Page Testing", () => {
  it('Should have "Create new Race Weekend" title', async () => {
    // @ts-ignore
    useRouter.mockReturnValue({
      push: () => {},
      back: () => {},
    });

    await act(async () => {
      render(<CreateWeekend />);
    });

    await waitFor(() => {
      expect(screen.getByText("Create new Race Weekend")).toBeInTheDocument();
    });
  });

  it('Should have "Create sessions" section', async () => {
    // @ts-ignore
    useRouter.mockReturnValue({
      push: () => {},
      back: () => {},
    });

    await act(async () => {
      render(<CreateWeekend />);
    });

    await waitFor(() => {
      expect(screen.getByText("Create sessions")).toBeInTheDocument();
    });
  });

  it("Should have select element with weekend templates", async () => {
    // @ts-ignore
    useRouter.mockReturnValue({
      push: jest.fn(),
      back: jest.fn(),
    });

    await act(async () => {
      render(<CreateWeekend />);
    });

    await waitFor(() => {
      const select = screen.getByLabelText("Weekend template");
      expect(select).toBeInTheDocument();
    });
  });

  it("On empty form submition have to invoke an alert with 'Name is required!' text", async () => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
    
    // @ts-ignore
    useRouter.mockReturnValue({
      push: jest.fn(),
      back: jest.fn(),
    });

    await act(async () => {
      render(<CreateWeekend />);
    });
    
    const addSessionBtn = screen.getByTestId("button-save");;
    fireEvent.click(addSessionBtn);
    
    await waitFor(() => {
      expect(window.alert).toBeCalledWith("Name is required!");
    });
  });
});
