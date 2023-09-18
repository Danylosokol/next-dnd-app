import { render, screen, waitFor } from "@testing-library/react";

import Dashboard from "@/app/dashboard/[id]/page";
import axios from "axios";
import { useRouter } from "next/navigation";
import { weekendsAPIData } from "../app/utils/weekendsConsts"; // Adjust path

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-dnd", () => ({
  useDrag: jest.fn(() => [{ isDragging: false }, null]),
  useDrop: jest.fn(() => [{ isOver: false }, null]),
}));

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Dashboard Page Testing", () => {
  beforeEach(() => {
    // @ts-ignore
    useRouter.mockReturnValue({
      back: jest.fn(),
    });

    mockedAxios.get.mockImplementation(async (url) => {
      if (url === "/api/weekend?id=6505c90224ae1ad1ee8a4c22") {
        return Promise.resolve({ data: weekendsAPIData[0] });
      }
    });
  });

  it("Should render the weekend name", async () => {
    render(<Dashboard params={{ id: "6505c90224ae1ad1ee8a4c22" }} />);

    await waitFor(() => {
      expect(screen.getByText(weekendsAPIData[0].name)).toBeInTheDocument();
    });
  });

  it("Should render the name for the number of first tyre set for this weekend", async () => {
    render(<Dashboard params={{ id: "6505c90224ae1ad1ee8a4c22" }} />);

    await waitFor(() => {
      const tyreNumber = screen.getByText(
        weekendsAPIData[0].tyreSets[0]._id.substring(
          weekendsAPIData[0].tyreSets[0]._id.length - 4
        )
       + " - Used");
      expect(tyreNumber).toBeInTheDocument();
    });
  });

  it("Should render the name of the first session", async () => {
    render(<Dashboard params={{ id: "6505c90224ae1ad1ee8a4c22" }} />);

    await waitFor(() => {
      const sessionName = screen.getByText(
        weekendsAPIData[0].sessions[0].name);
      expect(sessionName).toBeInTheDocument();
    });
  });
});
