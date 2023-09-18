import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import Home from "@/app/page";
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

describe("Home Page Testing", () => {

  it('Should have "Race Weekends" on the front page', async () => {
    // @ts-ignore
    useRouter.mockReturnValue({
      push: () => {},
    });
    render(<Home />);
    const myElem = await screen.findByText("Race Weekends");
    expect(myElem).toBeInTheDocument();
  });

  it('Should display "Weekend 2" after fetching data', async () => {
    // @ts-ignore
    useRouter.mockReturnValue({
      push: () => {},
    });
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText("Weekend 2")).toBeInTheDocument();
    });
  });

  it('Should display "No Weekends found..." when API returns an empty array', async () => {
    mockedAxios.get.mockImplementationOnce(async () =>
      Promise.resolve({
        data: [],
      })
    );

    // @ts-ignore
    useRouter.mockReturnValue({
      push: () => {},
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("No Weekends found...")).toBeInTheDocument();
    });
  });
});
