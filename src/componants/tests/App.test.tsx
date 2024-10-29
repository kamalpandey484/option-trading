import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import App from "../../App";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("App Component", () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
  });

  it("renders Header and ErrorMessage components", async () => {
    render(<App />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByTestId("error-message")).toBeInTheDocument();
  });

  it("fetches initial data and sets state correctly", async () => {
    const contractsData = [{ id: "1", name: "BANKNIFTY" }];
    const optionChainData = {
      options: { "2024-11-02": { call: {}, put: {} } },
      futures: { "2024-11-02": { close: 42000 } },
      cash: { close: 40000 },
      vix: { close: 15 },
    };

    mockedAxios.get.mockResolvedValueOnce({ data: contractsData });
    mockedAxios.get.mockResolvedValueOnce({ data: optionChainData });

    render(<App />);

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://prices.algotest.xyz/contracts"
      );
    });
    await waitFor(() => {
      expect(screen.getByText("BANKNIFTY")).toBeInTheDocument();
    });
  });

  it("shows an error message when the API request fails", async () => {
    mockedAxios.get.mockRejectedValue(new Error("API error"));

    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Failed to fetch initial data. Check console for details."
        )
      ).toBeInTheDocument();
    });
  });

  it("toggles the UnderlyingSelector dropdown on button click", async () => {
    const contractsData = [{ id: "1", name: "BANKNIFTY" }];
    mockedAxios.get.mockResolvedValueOnce({ data: contractsData });

    render(<App />);
    const dropdownToggle = screen.getByRole("button", {
      name: /underlying selector/i,
    });

    fireEvent.click(dropdownToggle);
    expect(screen.getByTestId("dropdown")).toBeVisible();

    fireEvent.click(dropdownToggle);
    expect(screen.queryByTestId("dropdown")).not.toBeVisible();
  });

  it("handles underlying selection and updates state", async () => {
    const contractsData = [{ id: "1", name: "BANKNIFTY" }];
    const optionChainData = {
      options: { "2024-11-02": { call: {}, put: {} } },
      futures: { "2024-11-02": { close: 42000 } },
      cash: { close: 40000 },
      vix: { close: 15 },
    };

    mockedAxios.get.mockResolvedValueOnce({ data: contractsData });
    mockedAxios.get.mockResolvedValueOnce({ data: optionChainData });

    render(<App />);

    await waitFor(() => {
      fireEvent.click(
        screen.getByRole("button", { name: /underlying selector/i })
      );
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText("BANKNIFTY"));
      expect(
        screen.getByText(/selected underlying: BANKNIFTY/i)
      ).toBeInTheDocument();
    });
  });

  it("updates expiry selection on ExpiryFilter change", async () => {
    const contractsData = [{ id: "1", name: "BANKNIFTY" }];
    const optionChainData = {
      options: { "2024-11-02": { call: {}, put: {} } },
      futures: { "2024-11-02": { close: 42000 } },
      cash: { close: 40000 },
      vix: { close: 15 },
    };

    mockedAxios.get.mockResolvedValueOnce({ data: contractsData });
    mockedAxios.get.mockResolvedValueOnce({ data: optionChainData });

    render(<App />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("2024-11-02"));
    });

    expect(
      screen.getByText(/selected expiry: 2024-11-02/i)
    ).toBeInTheDocument();
  });
});
