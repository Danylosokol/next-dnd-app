import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import EditWeekend from "@/app/edit-weekend/page";
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
    data: weekendsAPIData[0],
  })
);

jest.spyOn(window, "alert").mockImplementation(() => {});

describe("Edit Weekend Page Testing", () => {
  it('Should have "Edit Race Weekend" title', async () => {
    // @ts-ignore
    useRouter.mockReturnValue({
      push: () => {},
      back: () => {},
    });

    await act(async () => {
      render(<EditWeekend />);
    });

    await waitFor(() => {
      expect(screen.getByText("Edit Race Weekend")).toBeInTheDocument();
    });
  });

  it('Should have an alert "Editing weekend will reset the dashboard for this weekend!"', async () => {
    // @ts-ignore
    useRouter.mockReturnValue({
      push: () => {},
      back: () => {},
    });

    await act(async () => {
      render(<EditWeekend />);
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          "Editing weekend will reset the dashboard for this weekend!"
        )
      ).toBeInTheDocument();
    });
  });

  it('Should have in the input for Race Weekend name "Weekend test update with very long name"', async () => {
    // @ts-ignore
    useRouter.mockReturnValue({
      push: () => {},
      back: () => {},
    });

    await act(async () => {
      render(<EditWeekend />);
    });

    await waitFor(() => {
      const nameInput = screen.getByDisplayValue(
        "Weekend test update with very long name"
      );
      expect(nameInput).toBeInTheDocument();
    });
  });

  it('Should display "Free Practice - 2 tyres to return" on the page', async () => {
    // @ts-ignore
    useRouter.mockReturnValue({
      push: () => {},
      back: () => {},
    });

    await act(async () => {
      render(<EditWeekend />);
    });

    await waitFor(() => {
      expect(
        screen.getByText("Free Practice - 2 tyres to return")
      ).toBeInTheDocument();
    });
  });
});
