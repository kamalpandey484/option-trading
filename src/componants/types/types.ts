export interface Contract {
  expiry: string;
  token: string;
  [key: string]: any;
}

export interface OptionData {
  [key: string]: any;
}

export interface OptionChainResponse {
  options: {
    [expiryDate: string]: OptionData;
  };
  futures: {
    [expiryDate: string]: OptionData;
  };
  cash: {
    close: number;
  };
  vix: {
    close: number;
  };
}

export interface SelectedFuture {
  timestamp: string;
  close: number;
}
