// src/wrapper.tsx
import React2 from "react";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

// src/providers/tokenkitprovider.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Contract, RpcProvider } from "starknet";
import { connect, disconnect } from "starknetkit";

// src/configs/utils.ts
import { BigNumber } from "bignumber.js";

// src/assets/token_kit_abi.json
var token_kit_abi_default = [
  {
    type: "impl",
    name: "TokenRegImpl",
    interface_name: "tokenreg::tokensreg::ITokenReg"
  },
  {
    type: "struct",
    name: "core::integer::u256",
    members: [
      {
        name: "low",
        type: "core::integer::u128"
      },
      {
        name: "high",
        type: "core::integer::u128"
      }
    ]
  },
  {
    type: "enum",
    name: "core::bool",
    variants: [
      {
        name: "False",
        type: "()"
      },
      {
        name: "True",
        type: "()"
      }
    ]
  },
  {
    type: "struct",
    name: "tokenreg::tokensreg::Token",
    members: [
      {
        name: "address",
        type: "core::starknet::contract_address::ContractAddress"
      },
      {
        name: "icon",
        type: "core::felt252"
      },
      {
        name: "name",
        type: "core::felt252"
      },
      {
        name: "symbol",
        type: "core::felt252"
      },
      {
        name: "decimals",
        type: "core::integer::u8"
      },
      {
        name: "verified",
        type: "core::bool"
      },
      {
        name: "public",
        type: "core::bool"
      },
      {
        name: "common",
        type: "core::bool"
      },
      {
        name: "pair_id",
        type: "core::felt252"
      }
    ]
  },
  {
    type: "interface",
    name: "tokenreg::tokensreg::ITokenReg",
    items: [
      {
        type: "function",
        name: "add_token",
        inputs: [
          {
            name: "address",
            type: "core::starknet::contract_address::ContractAddress"
          },
          {
            name: "icon_link",
            type: "core::felt252"
          },
          {
            name: "pair_id",
            type: "core::felt252"
          }
        ],
        outputs: [],
        state_mutability: "external"
      },
      {
        type: "function",
        name: "edit_token",
        inputs: [
          {
            name: "token_index",
            type: "core::integer::u256"
          },
          {
            name: "public",
            type: "core::bool"
          },
          {
            name: "verified",
            type: "core::bool"
          },
          {
            name: "common",
            type: "core::bool"
          },
          {
            name: "icon_link",
            type: "core::felt252"
          },
          {
            name: "pair_id",
            type: "core::felt252"
          }
        ],
        outputs: [],
        state_mutability: "external"
      },
      {
        type: "function",
        name: "add_admin",
        inputs: [
          {
            name: "address",
            type: "core::starknet::contract_address::ContractAddress"
          }
        ],
        outputs: [],
        state_mutability: "external"
      },
      {
        type: "function",
        name: "get_tokens",
        inputs: [
          {
            name: "page",
            type: "core::integer::u256"
          }
        ],
        outputs: [
          {
            type: "core::array::Array::<tokenreg::tokensreg::Token>"
          }
        ],
        state_mutability: "view"
      },
      {
        type: "function",
        name: "get_tokens_count",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u256"
          }
        ],
        state_mutability: "view"
      },
      {
        type: "function",
        name: "get_has_upgraded",
        inputs: [],
        outputs: [
          {
            type: "core::felt252"
          }
        ],
        state_mutability: "view"
      }
    ]
  },
  {
    type: "impl",
    name: "UpgradeableContract",
    interface_name: "tokenreg::upgrade::IUpgradeableContract"
  },
  {
    type: "interface",
    name: "tokenreg::upgrade::IUpgradeableContract",
    items: [
      {
        type: "function",
        name: "upgrade",
        inputs: [
          {
            name: "impl_hash",
            type: "core::starknet::class_hash::ClassHash"
          }
        ],
        outputs: [],
        state_mutability: "external"
      },
      {
        type: "function",
        name: "version",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u8"
          }
        ],
        state_mutability: "view"
      }
    ]
  },
  {
    type: "constructor",
    name: "constructor",
    inputs: [
      {
        name: "guardian",
        type: "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    type: "event",
    name: "tokenreg::tokensreg::TokenReg::Upgraded",
    kind: "struct",
    members: [
      {
        name: "implementation",
        type: "core::starknet::class_hash::ClassHash",
        kind: "data"
      }
    ]
  },
  {
    type: "event",
    name: "tokenreg::tokensreg::TokenReg::Event",
    kind: "enum",
    variants: [
      {
        name: "Upgraded",
        type: "tokenreg::tokensreg::TokenReg::Upgraded",
        kind: "nested"
      }
    ]
  }
];

// src/configs/utils.ts
import { shortString } from "starknet";
var TOKEN_KIT_ABI = token_kit_abi_default;
var TOKEN_KIT_CONTRACT_ADDRESS = "0xa6715bb9e01d8e096f962569b9961e075c274e5ea65516de6c924d943681f9";
function formatNumberInternational(number) {
  const DECIMALS = 4;
  if (typeof Intl.NumberFormat === "function") {
    const formatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: DECIMALS, maximumFractionDigits: DECIMALS });
    return formatter.format(number);
  } else {
    console.warn("Intl.NumberFormat is not supported in this browser. Fallback may not provide accurate formatting.");
    return number.toLocaleString("en-US");
  }
}
function bigintToShortStr(bigintstr) {
  try {
    if (!bigintstr)
      return "";
    const bn = BigNumber(bigintstr);
    const hex_sentence = `0x` + bn.toString(16);
    return shortString.decodeShortString(hex_sentence);
  } catch (error) {
    return bigintstr;
  }
}
function bigintToLongAddress(bigintstr) {
  try {
    if (!bigintstr)
      return "";
    const bn = BigNumber(bigintstr);
    const hex_sentence = `0x` + bn.toString(16);
    return hex_sentence;
  } catch (error) {
    return bigintstr;
  }
}
function convertToReadableTokens(tokens, decimals) {
  if (!tokens || !decimals)
    return "";
  return new BigNumber(tokens).dividedBy(10 ** decimals).toNumber().toFixed(6);
}
var removeTrailingZeros = (tokenAddress) => {
  if (tokenAddress.length > 4) {
    const res = "0x" + tokenAddress.substring(2).replace(/^0+/, "");
    return res;
  }
  return tokenAddress;
};
function limitChars(str, count, show_dots) {
  if (count <= str?.length) {
    return `${str.substring(0, count)} ${show_dots ? "..." : ""}`;
  }
  return str;
}

// src/providers/tokenkitprovider.tsx
import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";
import BigNumber2 from "bignumber.js";

// src/configs/db.ts
import Dexie from "dexie";
var TokenKitDBDexie = class extends Dexie {
  tokens;
  constructor() {
    super("TokenKitDB");
    this.version(1).stores({
      tokens: "++id, name, symbol, decimals, address, verified, public"
    });
    this.version(2).stores({
      tokens: "++id, name, symbol, decimals, address, verified, public, common, pair_id, [verified+common], [verified+public], [verified+common+public]"
    });
  }
};
var db = new TokenKitDBDexie();

// src/providers/providerUtils.ts
import { createContext, useContext } from "react";
var initialData = {
  contract: null,
  pragma_contract: null,
  account: null,
  address: null,
  connection: null,
  handleConnetDisconnectWalletBtnClick: null,
  openCloseModal: null,
  modalOpen: false,
  selectTokenFunc: null,
  selectedToken: null,
  reloadTokensFromContract: null,
  loadingTokens: false
};
var TokenKitContext = createContext(initialData);
var useTokenKitContext = () => {
  return useContext(TokenKitContext);
};

// src/providers/tokenkitprovider.tsx
var TokenKitProvider = ({ children }) => {
  const [contract, setContract] = useState();
  const [pragma_contract, setPragmaContract] = useState();
  const [connection, setConnection] = useState();
  const [account, setAccount] = useState();
  const [address, setAddress] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedToken, setselectedToken] = useState();
  const [loading, setLoading] = useState(false);
  const connectWallet = async () => {
    let provider = new RpcProvider({ nodeUrl: "https://starknet-goerli.infura.io/v3/958e1b411a40480eacb8c0f5d640a8ec" });
    const connection2 = await connect({
      webWalletUrl: "https://web.argent.xyz",
      dappName: "Token Kit",
      modalMode: "alwaysAsk",
      provider
    });
    if (connection2 && connection2?.wallet) {
      setConnection(connection2);
      setAccount(connection2?.wallet?.account);
      setAddress(connection2?.wallet?.selectedAddress);
    }
  };
  const disconnectWallet = async () => {
    await disconnect({ clearLastWallet: true });
    setConnection(null);
    setAccount(null);
    setAddress("");
  };
  const openConfirmDisconnectModal = () => modals.openConfirmModal({
    title: "Please confirm your action",
    centered: true,
    radius: "md",
    children: /* @__PURE__ */ React.createElement(Text, { size: "sm" }, "Are you sure you want to disconnect your account?"),
    labels: { confirm: "Disconnect", cancel: "Cancel" },
    confirmProps: { radius: "md", variant: "light" },
    cancelProps: { radius: "md", variant: "light" },
    onCancel: () => {
    },
    onConfirm: () => disconnectWallet()
  });
  const makeContractConnection = () => {
    let contract2 = new Contract(TOKEN_KIT_ABI, TOKEN_KIT_CONTRACT_ADDRESS);
    if (account) {
      contract2 = new Contract(TOKEN_KIT_ABI, TOKEN_KIT_CONTRACT_ADDRESS, account);
    }
    setContract(contract2);
  };
  const handleConnetDisconnectWalletBtnClick = () => {
    if (!account) {
      connectWallet();
    } else {
      openConfirmDisconnectModal();
    }
  };
  const openCloseModal = (open) => {
    setModalOpen(open);
  };
  const selectTokenFunc = (token, func) => {
    setselectedToken(token);
    func(token);
  };
  const loadTokens = async (page) => {
    try {
      const res = await contract.get_tokens(page);
      return res;
    } catch (error) {
      throw error;
    }
  };
  const formatToken = (token) => {
    const icon = bigintToShortStr(token?.icon);
    const formattedIcon = icon.startsWith("https://") || icon.startsWith("http://") ? icon : `https://${icon}`;
    const formated_token = {
      address: bigintToLongAddress(token?.address),
      name: bigintToShortStr(token?.name),
      symbol: bigintToShortStr(token?.symbol),
      decimals: new BigNumber2(token?.decimals).toNumber(),
      icon: formattedIcon,
      verified: token?.verified,
      public: token?.public,
      common: token?.common,
      pair_id: bigintToShortStr(token?.pair_id)
    };
    return formated_token;
  };
  const actualLoadTokens = async (noOfTokens) => {
    setLoading(true);
    const totalPages = Math.ceil(noOfTokens / 25);
    const allTokens = await Promise.all(
      Array.from({ length: totalPages }, (_, index) => loadTokens(index + 1))
    );
    const combinedTokens = allTokens.flat().map((token, i) => {
      const formated_token = formatToken(token);
      return {
        id: i + 1,
        ...formated_token
      };
    });
    db.tokens.bulkPut(combinedTokens).then((res) => {
      console.log("Tokens saved the items successfully");
    }).catch((error) => {
      console.log("Error: ", error);
    });
    setLoading(false);
  };
  const getContractTokensInfo = async () => {
    try {
      if (contract) {
        const totalTokens = await contract.get_tokens_count();
        const noOfTokens = new BigNumber2(totalTokens).toNumber();
        const dbTokensCount = await db.tokens.count();
        if (dbTokensCount !== noOfTokens) {
          actualLoadTokens(noOfTokens);
        }
      }
    } catch (error) {
      console.error("Error fetching contract tokens information:", error);
    }
  };
  const reloadTokensFromContract = async () => {
    try {
      if (contract) {
        const totalTokens = await contract.get_tokens_count();
        const noOfTokens = new BigNumber2(totalTokens).toNumber();
        actualLoadTokens(noOfTokens);
      }
    } catch (error) {
      console.error("Error fetching contract tokens information:", error);
    }
  };
  const contextValue = useMemo(() => ({
    contract,
    pragma_contract,
    account,
    address,
    connection,
    handleConnetDisconnectWalletBtnClick,
    modalOpen,
    openCloseModal,
    selectTokenFunc,
    selectedToken,
    reloadTokensFromContract,
    loadingTokens: loading
  }), [account, contract, address, pragma_contract, modalOpen]);
  useEffect(() => {
    makeContractConnection();
  }, [account]);
  useEffect(() => {
    getContractTokensInfo();
  }, [contract]);
  useEffect(() => {
    connectWallet();
  }, []);
  return /* @__PURE__ */ React.createElement(TokenKitContext.Provider, { value: contextValue }, children);
};
var tokenkitprovider_default = TokenKitProvider;

// src/wrapper.tsx
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/core/styles.layer.css";
import "mantine-datatable/styles.layer.css";
var TokenKitWrapper = (props) => {
  const { children, usingMantine } = props;
  if (usingMantine) {
    return /* @__PURE__ */ React2.createElement(tokenkitprovider_default, null, children);
  }
  return /* @__PURE__ */ React2.createElement(MantineProvider, { theme: {
    primaryColor: "pink"
  } }, /* @__PURE__ */ React2.createElement(ModalsProvider, null, /* @__PURE__ */ React2.createElement(Notifications, null), /* @__PURE__ */ React2.createElement(tokenkitprovider_default, null, children)));
};
var wrapper_default = TokenKitWrapper;

// src/components/Kit.tsx
import { useEffect as useEffect2, useMemo as useMemo2, useState as useState2 } from "react";
import { Modal, Box, Group, Title, ActionIcon, TextInput, Paper, Avatar, Stack, Text as Text2, ScrollArea, useMantineColorScheme, Pagination, Center, Anchor, Button } from "@mantine/core";
import React3 from "react";
import { CairoCustomEnum } from "starknet";
import { IconReload, IconX } from "@tabler/icons-react";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import { modals as modals2 } from "@mantine/modals";
var SelectTokenModal = ({ children, selectedToken, callBackFunc, themeObject }) => {
  const { reloadTokensFromContract, loadingTokens } = useTokenKitContext();
  const [opened, { open, close }] = useDisclosure(false);
  const [tokens, setTokens] = useState2([]);
  const [commonTokens, setCommonTokens] = useState2([]);
  const [searchedToken, setSearchedToken] = useDebouncedState("", 500);
  const [totalTokens, setTotalTokens] = useState2(0);
  const [page, setPage] = useState2(1);
  const tokensPerPage = 25;
  const selectSingle = (token) => {
    callBackFunc && callBackFunc(token);
    close();
  };
  const loadCommonTokens = async () => {
    const total_tokens = await db.tokens.count();
    const common_tks = await db.tokens.filter((t) => t.common ?? false).toArray();
    setCommonTokens(common_tks);
    setTotalTokens(total_tokens);
  };
  const loadTokensFromDB = async () => {
    const limit = tokensPerPage;
    const offset = (page - 1) * tokensPerPage;
    const searchTermTrimmedZeroes = removeTrailingZeros(searchedToken);
    const regexString = searchTermTrimmedZeroes.split("").join("[\\w\\s]*");
    const regex = new RegExp(`(${regexString}[\\w\\s]*)`, "gi");
    const filteredTokens = await db.tokens.filter((token) => {
      const matched = token.symbol.match(regex) || token.name.match(regex) || removeTrailingZeros(token.address).match(regex);
      return matched ? true : false;
    }).filter((token) => !!token.public).limit(limit).offset(offset).toArray();
    setTokens(filteredTokens);
  };
  const sortTokens = () => {
    return tokens.sort((a, b) => {
      if (a.verified && a.common && !b.verified) {
        return -1;
      } else if (a.verified && !a.common && !b.verified) {
        return -1;
      } else if (!a.verified && b.verified) {
        return 1;
      } else if (!a.verified && !b.verified) {
        return 1;
      } else {
        return a.common ? -1 : 1;
      }
    });
  };
  const HEADER_HEIGHT = 250;
  useEffect2(() => {
    loadCommonTokens();
  }, []);
  useEffect2(() => {
    loadTokensFromDB();
  }, [searchedToken, page, loadingTokens]);
  return /* @__PURE__ */ React3.createElement(React3.Fragment, null, /* @__PURE__ */ React3.createElement(Box, { onClick: open }, children), /* @__PURE__ */ React3.createElement(
    Modal,
    {
      bg: themeObject.modalBackground,
      lockScroll: true,
      c: themeObject.textColor,
      withinPortal: true,
      opened,
      styles: {
        header: {
          width: "100%"
        },
        title: {
          width: "100%"
        }
      },
      withCloseButton: false,
      size: "md",
      onClose: () => {
        close();
        modals2.closeAll();
      },
      padding: 0,
      radius: "lg",
      title: null
    },
    /* @__PURE__ */ React3.createElement(Box, { style: {
      height: "90dvh",
      background: themeObject.modalBackground
    } }, /* @__PURE__ */ React3.createElement(Box, { h: `${HEADER_HEIGHT}px`, style: {
      background: themeObject.headerFooterBackground
    } }, /* @__PURE__ */ React3.createElement(Group, { p: "md", justify: "space-between", align: "center", className: "w-100" }, /* @__PURE__ */ React3.createElement(Title, { order: 2, fw: 500 }, "Select Token"), /* @__PURE__ */ React3.createElement(ActionIcon, { variant: "light", onClick: close }, /* @__PURE__ */ React3.createElement(IconX, null))), /* @__PURE__ */ React3.createElement(Box, { px: "md", h: `${HEADER_HEIGHT}px` }, /* @__PURE__ */ React3.createElement(Stack, { h: `${HEADER_HEIGHT}px`, gap: 6 }, /* @__PURE__ */ React3.createElement(
      TextInput,
      {
        defaultValue: searchedToken,
        onChange: (e) => setSearchedToken(e.target.value),
        size: "md",
        radius: "lg",
        placeholder: "Search name, symbol or paste address",
        className: "w-100",
        mb: "md",
        styles: {
          input: {
            border: `2px solid ${themeObject.searchBorderColor}`,
            background: themeObject.searchBackgroundColor
          }
        }
      }
    ), /* @__PURE__ */ React3.createElement(Group, { justify: "space-between", align: "center" }, /* @__PURE__ */ React3.createElement(Title, { order: 5, mb: "xs" }, "Common tokens"), /* @__PURE__ */ React3.createElement(Button, { color: "indigo", onClick: reloadTokensFromContract, size: "xs", radius: "md", leftSection: /* @__PURE__ */ React3.createElement(IconReload, { size: "16px" }) }, "Refresh")), /* @__PURE__ */ React3.createElement(Box, { style: { overflow: "hidden", maxWidth: "100%" } }, commonTokens?.length === 0 ? /* @__PURE__ */ React3.createElement(Text2, { fw: 500, ta: "center", c: themeObject.textColor }, "No listed common tokens.") : null, /* @__PURE__ */ React3.createElement(ScrollArea, { scrollbarSize: 10, pb: "10px", type: "always" }, /* @__PURE__ */ React3.createElement(Group, { display: "flex", style: { flexWrap: "nowrap" }, p: "6px", gap: 10 }, commonTokens?.map((item, i) => /* @__PURE__ */ React3.createElement(Box, { key: `token_s_${i}`, w: "fit-content" }, /* @__PURE__ */ React3.createElement(
      SelectTokenBtn,
      {
        token: item,
        select: selectSingle,
        selectedToken,
        bgColor: themeObject.tokenBackgroundColor,
        hoverColor: themeObject.tokenHoverColor
      }
    ))))))))), /* @__PURE__ */ React3.createElement(Box, { style: {
      height: `calc(100% - ${HEADER_HEIGHT}px - 60px)`,
      background: themeObject.modalBackground
    } }, /* @__PURE__ */ React3.createElement(ScrollArea, { className: "h-100" }, tokens?.length === 0 ? /* @__PURE__ */ React3.createElement(Box, { h: 300 }, /* @__PURE__ */ React3.createElement(Center, { h: 300 }, /* @__PURE__ */ React3.createElement(Text2, { fw: 500, ta: "center", maw: "80%", c: themeObject.textColor }, "No tokens have been listed yet! be the first to list ", /* @__PURE__ */ React3.createElement(Anchor, { href: "/", target: "_blank" }, "here.")))) : null, /* @__PURE__ */ React3.createElement(Stack, { p: "xs", gap: 0 }, sortTokens()?.map((item, i) => /* @__PURE__ */ React3.createElement(
      SelectToken,
      {
        key: `dfd_${i}`,
        token: item,
        select: selectSingle,
        selectedToken,
        bgColor: themeObject.tokenBackgroundColor,
        hoverColor: themeObject.tokenHoverColor
      }
    ))))), /* @__PURE__ */ React3.createElement(Box, { px: "md", style: (theme) => ({
      height: `60px`,
      background: themeObject.headerFooterBackground
    }) }, /* @__PURE__ */ React3.createElement(Group, { style: { height: "100%" }, align: "center", justify: "space-between" }, /* @__PURE__ */ React3.createElement(Anchor, { href: "/", size: "sm" }, "Add New"), /* @__PURE__ */ React3.createElement(Pagination, { value: page, radius: "md", onChange: setPage, total: Math.ceil(totalTokens / tokensPerPage), size: "sm" }))))
  ));
};
var SelectToken = ({ token, select, selectedToken, bgColor, hoverColor }) => {
  const { colorScheme } = useMantineColorScheme();
  const { pragma_contract } = useTokenKitContext();
  const [tokenPrice, setTokenPrice] = useState2(null);
  const getTokenPrice = async () => {
    if (pragma_contract) {
      const SPOTENTRY_ENUM = new CairoCustomEnum({
        SpotEntry: token?.pair_id
      });
      const res = await pragma_contract.get_data_median(SPOTENTRY_ENUM);
    }
  };
  const selectToken = () => {
    select(token);
  };
  const has_changed = useMemo2(() => ({
    pragma_contract,
    selectedToken
  }), [pragma_contract, selectedToken]);
  useEffect2(() => {
    getTokenPrice();
  }, [has_changed]);
  return /* @__PURE__ */ React3.createElement(Paper, { py: "xs", bg: selectedToken?.address === token?.address ? hoverColor : bgColor, radius: "md", px: "md", style: {
    backgroundColor: `${selectedToken?.address === token?.address ? hoverColor : bgColor} !important`,
    cursor: "pointer",
    pointerEvents: selectedToken?.address === token?.address ? "none" : "all"
  }, onClick: () => selectToken() }, /* @__PURE__ */ React3.createElement(Group, { justify: "space-between", align: "center" }, /* @__PURE__ */ React3.createElement(Group, { align: "center" }, /* @__PURE__ */ React3.createElement(Avatar, { size: "sm", src: token?.icon, variant: "light", color: "pink" }), /* @__PURE__ */ React3.createElement(Stack, { gap: -10 }, /* @__PURE__ */ React3.createElement(Text2, { size: "md" }, /* @__PURE__ */ React3.createElement("b", null, token?.symbol)), /* @__PURE__ */ React3.createElement(Text2, { size: "sm", fw: 400 }, token?.name))), /* @__PURE__ */ React3.createElement(Text2, { size: "sm", fw: 500 }, "$", formatNumberInternational(tokenPrice))));
};
var SelectTokenBtn = ({ token, select, selectedToken, bgColor, hoverColor }) => {
  const { colorScheme } = useMantineColorScheme();
  const { pragma_contract } = useTokenKitContext();
  const [tokenPrice, setTokenPrice] = useState2(null);
  const [_loading, setLoading] = useState2(false);
  const getTokenPrice = async () => {
    setLoading(true);
    if (pragma_contract) {
      const SPOTENTRY_ENUM = new CairoCustomEnum({
        SpotEntry: token?.pair_id
      });
      const res = await pragma_contract.get_data_median(SPOTENTRY_ENUM);
    }
    setLoading(false);
  };
  const selectToken = () => {
    setTokenPrice(tokenPrice);
    select(token);
  };
  useEffect2(() => {
    getTokenPrice();
  }, [pragma_contract, selectedToken]);
  return /* @__PURE__ */ React3.createElement(Paper, { bg: selectedToken?.address === token?.address ? hoverColor : bgColor, style: {
    background: `${selectedToken?.address === token?.address ? hoverColor : bgColor} !important`,
    border: "none",
    borderRadius: "10px",
    pointerEvents: selectedToken?.address === token?.address ? "none" : "all",
    padding: "4px 6px",
    cursor: "pointer",
    width: "fit-content"
  }, onClick: () => selectToken() }, /* @__PURE__ */ React3.createElement(Group, { gap: 10, wrap: "nowrap" }, /* @__PURE__ */ React3.createElement(Avatar, { size: "sm", src: token?.icon }), /* @__PURE__ */ React3.createElement(Text2, { size: "sm", fw: 500 }, token?.symbol)));
};
var Kit_default = SelectTokenModal;

// src/components/TokensTable.tsx
import { useDisclosure as useDisclosure2 } from "@mantine/hooks";
import React6, { useEffect as useEffect3, useState as useState4 } from "react";
import { ActionIcon as ActionIcon3, Avatar as Avatar2, Box as Box2, Button as Button3, Drawer, Grid as Grid2, Group as Group2, Select, Stack as Stack3, Text as Text3, TextInput as TextInput3, em } from "@mantine/core";

// src/components/CustomCopyButton.tsx
import React4 from "react";
import { ActionIcon as ActionIcon2, CopyButton, Tooltip } from "@mantine/core";
import { IconCopy } from "@tabler/icons-react";
var CustomCopyBtn = (props) => {
  const { color, copy_value } = props;
  return /* @__PURE__ */ React4.createElement(CopyButton, { value: copy_value }, ({ copied, copy }) => /* @__PURE__ */ React4.createElement(Tooltip, { label: copied ? "Copied" : "Copy" }, /* @__PURE__ */ React4.createElement(ActionIcon2, { variant: "light", size: "sm", radius: "sm", color: copied ? `${color}.9` : color, onClick: copy }, /* @__PURE__ */ React4.createElement(IconCopy, null))));
};
var CustomCopyButton_default = CustomCopyBtn;

// src/components/TokensTable.tsx
import { IconCheck as IconCheck2, IconFilter, IconReload as IconReload2, IconWriting as IconWriting2, IconX as IconX2 } from "@tabler/icons-react";

// src/components/forms.tsx
import { Stack as Stack2, Title as Title2, Grid, NumberInput, TextInput as TextInput2, Switch, Button as Button2, Loader } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconAlertTriangle, IconWriting, IconUpload } from "@tabler/icons-react";
import React5 from "react";
import { useState as useState3 } from "react";
var UpdateTokenForm = (props) => {
  const { data } = props;
  const { contract } = useTokenKitContext();
  const [loading, setLoading] = useState3(false);
  const form = useForm({
    initialValues: {
      token_index: data?.id ?? "",
      public: data?.public ?? false,
      verified: data?.verified ?? false,
      common: data?.common ?? false,
      icon_link: data?.icon ?? "",
      pair_id: data?.pair_id ?? "-"
    },
    validate: {
      icon_link: (val) => val === "" ? "Icon link is required" : null
    }
  });
  const handleSubmit = () => {
    console.log(contract);
    if (contract) {
      const call_data = form.values;
      call_data.icon_link = form.values.icon_link;
      const myCall = contract.populate("edit_token", call_data);
      contract.edit_token(myCall.calldata).then((_res) => {
        showNotification({
          title: "Update",
          message: `Update Succesful`,
          color: "green",
          icon: /* @__PURE__ */ React5.createElement(IconCheck, null)
        });
      }).catch((err) => {
        showNotification({
          title: "Update failed",
          message: `${err}`,
          color: "red",
          icon: /* @__PURE__ */ React5.createElement(IconAlertTriangle, null)
        });
      }).finally(() => {
        setLoading(false);
      });
    }
  };
  return /* @__PURE__ */ React5.createElement("form", { onSubmit: form.onSubmit((_values) => handleSubmit()) }, /* @__PURE__ */ React5.createElement(Stack2, null, /* @__PURE__ */ React5.createElement(Title2, { order: 3 }, "Update Token"), /* @__PURE__ */ React5.createElement(Grid, null, /* @__PURE__ */ React5.createElement(Grid.Col, { span: { md: 12 } }, /* @__PURE__ */ React5.createElement(NumberInput, { disabled: true, label: "Token Index", placeholder: "Token Index", radius: "md", ...form.getInputProps("token_index") })), /* @__PURE__ */ React5.createElement(Grid.Col, { span: { md: 12 } }, /* @__PURE__ */ React5.createElement(TextInput2, { label: "Pair ID", placeholder: "ETH/USD", radius: "md", ...form.getInputProps("pair_id") })), /* @__PURE__ */ React5.createElement(Grid.Col, { span: { md: 4 } }, /* @__PURE__ */ React5.createElement(Switch, { label: "Common", radius: "md", ...form.getInputProps("common", { type: "checkbox" }) })), /* @__PURE__ */ React5.createElement(Grid.Col, { span: { md: 4 } }, /* @__PURE__ */ React5.createElement(Switch, { label: "Public", radius: "md", ...form.getInputProps("public", { type: "checkbox" }) })), /* @__PURE__ */ React5.createElement(Grid.Col, { span: { md: 4 } }, /* @__PURE__ */ React5.createElement(Switch, { label: "Verified", radius: "md", ...form.getInputProps("verified", { type: "checkbox" }) })), /* @__PURE__ */ React5.createElement(Grid.Col, { span: { md: 12 } }, /* @__PURE__ */ React5.createElement(TextInput2, { label: "Icon Link", placeholder: "https://shortlink/xysx", radius: "md", ...form.getInputProps("icon_link"), maxLength: 29 })), /* @__PURE__ */ React5.createElement(Grid.Col, { span: { md: 12 } }, /* @__PURE__ */ React5.createElement(Button2, { radius: "md", type: "submit", leftSection: loading ? /* @__PURE__ */ React5.createElement(Loader, { size: "sm", color: "white" }) : /* @__PURE__ */ React5.createElement(IconWriting, { size: "18px" }), rightSection: loading ? /* @__PURE__ */ React5.createElement(Loader, { color: "white", size: "sm" }) : null }, "Update Token")))));
};
var ListTokenForm = () => {
  const [loading, setLoading] = useState3(false);
  const { contract } = useTokenKitContext();
  const form = useForm({
    initialValues: {
      address: "",
      icon_link: "",
      pair_id: "-"
    },
    validate: {
      address: (val) => val === "" ? "Token Address is required" : null,
      icon_link: (val) => val === "" ? "Icon link is required" : null
    }
  });
  const handleSubmit = () => {
    if (contract) {
      const call_data = form.values;
      call_data.icon_link = form.values.icon_link;
      const myCall = contract.populate("add_token", call_data);
      contract.add_token(myCall.calldata).then((_res) => {
        showNotification({
          title: "Token Listing",
          message: `Token Added Succesfully`,
          color: "green",
          icon: /* @__PURE__ */ React5.createElement(IconCheck, null)
        });
      }).catch((err) => {
        showNotification({
          title: "Token listing failed",
          message: `${err}`,
          color: "red",
          icon: /* @__PURE__ */ React5.createElement(IconAlertTriangle, null)
        });
      }).finally(() => {
        setLoading(false);
      });
    }
  };
  return /* @__PURE__ */ React5.createElement("form", { onSubmit: form.onSubmit((_values) => handleSubmit()) }, /* @__PURE__ */ React5.createElement(Stack2, null, /* @__PURE__ */ React5.createElement(Title2, { order: 3 }, "List new Token"), /* @__PURE__ */ React5.createElement(Grid, null, /* @__PURE__ */ React5.createElement(Grid.Col, { span: { md: 12 } }, /* @__PURE__ */ React5.createElement(TextInput2, { label: "Token Address", placeholder: "Token Address", radius: "md", ...form.getInputProps("address") })), /* @__PURE__ */ React5.createElement(Grid.Col, { span: { md: 12 } }, /* @__PURE__ */ React5.createElement(TextInput2, { label: "Pair ID", placeholder: "ETH/USD", radius: "md", ...form.getInputProps("pair_id") })), /* @__PURE__ */ React5.createElement(Grid.Col, { span: { md: 12 } }, /* @__PURE__ */ React5.createElement(TextInput2, { label: "Icon Link", placeholder: "https://shortlink/xysx", ...form.getInputProps("icon_link"), maxLength: 29, radius: "md" })), /* @__PURE__ */ React5.createElement(Grid.Col, { span: { md: 12 } }, /* @__PURE__ */ React5.createElement(Button2, { radius: "md", type: "submit", leftSection: /* @__PURE__ */ React5.createElement(IconUpload, { size: "18px" }), rightSection: loading ? /* @__PURE__ */ React5.createElement(Loader, { color: "white", size: "sm" }) : null }, "List Token")))));
};
var AddAdminForm = () => {
  const [loading, setLoading] = useState3(false);
  const { contract } = useTokenKitContext();
  const form = useForm({
    initialValues: {
      address: ""
    },
    validate: {
      address: (val) => val === "" ? "Admin Address is required" : null
    }
  });
  const handleSubmit = () => {
    if (contract) {
      const call_data = form.values;
      const myCall = contract.populate("add_admin", call_data);
      contract.add_admin(myCall.calldata).then((_res) => {
        showNotification({
          title: "New Admin",
          message: `Admin Added Successfully`,
          color: "green",
          icon: /* @__PURE__ */ React5.createElement(IconCheck, null)
        });
      }).catch((err) => {
        showNotification({
          title: "Adding failed",
          message: `${err}`,
          color: "red",
          icon: /* @__PURE__ */ React5.createElement(IconAlertTriangle, null)
        });
      }).finally(() => {
        setLoading(false);
      });
    }
  };
  return /* @__PURE__ */ React5.createElement("form", { onSubmit: form.onSubmit((_values) => handleSubmit()) }, /* @__PURE__ */ React5.createElement(Stack2, null, /* @__PURE__ */ React5.createElement(Title2, { order: 3 }, "Add New Admin"), /* @__PURE__ */ React5.createElement(Grid, null, /* @__PURE__ */ React5.createElement(Grid.Col, { span: { md: 12 } }, /* @__PURE__ */ React5.createElement(TextInput2, { label: "Admin Address", placeholder: "Admin Address", radius: "md", ...form.getInputProps("address") })), /* @__PURE__ */ React5.createElement(Grid.Col, { span: { md: 12 } }, /* @__PURE__ */ React5.createElement(Button2, { radius: "md", type: "submit", leftSection: /* @__PURE__ */ React5.createElement(IconUpload, { size: "18px" }), rightSection: loading ? /* @__PURE__ */ React5.createElement(Loader, { color: "white", size: "sm" }) : null }, "Add Admin")))));
};
var UpdateAdminForm = (props) => {
  const { data } = props;
  const [loading, setLoading] = useState3(false);
  const { contract } = useTokenKitContext();
  const form = useForm({
    initialValues: {
      address: data?.address ?? "",
      has_permission: data?.has_permission ?? false
    },
    validate: {
      address: (val) => val === "" ? "Admin Address is required" : null
    }
  });
  const handleSubmit = () => {
    if (contract) {
      const call_data = form.values;
      const myCall = contract.populate("add_admin", call_data);
      contract.add_admin(myCall.calldata).then((_res) => {
        showNotification({
          title: "New Admin",
          message: `Admin Updated Successfully`,
          color: "green",
          icon: /* @__PURE__ */ React5.createElement(IconCheck, null)
        });
      }).catch((err) => {
        showNotification({
          title: "Update failed",
          message: `${err}`,
          color: "red",
          icon: /* @__PURE__ */ React5.createElement(IconAlertTriangle, null)
        });
      }).finally(() => {
        setLoading(false);
      });
    }
  };
  return /* @__PURE__ */ React5.createElement("form", { onSubmit: form.onSubmit((_values) => handleSubmit()) }, /* @__PURE__ */ React5.createElement(Stack2, null, /* @__PURE__ */ React5.createElement(Title2, { order: 3 }, "Update Admin"), /* @__PURE__ */ React5.createElement(Grid, null, /* @__PURE__ */ React5.createElement(Grid.Col, { span: { md: 12 } }, /* @__PURE__ */ React5.createElement(TextInput2, { label: "Admin Address", disabled: true, placeholder: "Admin Address", radius: "md", ...form.getInputProps("address") })), /* @__PURE__ */ React5.createElement(Grid.Col, { span: { md: 4 } }, /* @__PURE__ */ React5.createElement(Switch, { label: "Has Admin Permissions", radius: "md", ...form.getInputProps("has_permission", { type: "checkbox" }) })), /* @__PURE__ */ React5.createElement(Grid.Col, { span: { md: 12 } }, /* @__PURE__ */ React5.createElement(Button2, { radius: "md", type: "submit", leftSection: /* @__PURE__ */ React5.createElement(IconUpload, { size: "18px" }), rightSection: loading ? /* @__PURE__ */ React5.createElement(Loader, { color: "white", size: "sm" }) : null }, "Add Admin")))));
};

// src/components/TokensTable.tsx
import { useForm as useForm2 } from "@mantine/form";
var TokensTable = (props) => {
  const { reloadTokensFromContract, loadingTokens } = useTokenKitContext();
  const { DataTable } = props;
  const [tokens, setTokens] = useState4([]);
  const [token, setToken] = useState4();
  const [opened, { open, close }] = useDisclosure2(false);
  const [totalTokens, setTotalTokens] = useState4(0);
  const [page, setPage] = useState4(1);
  const tokensPerPage = 25;
  const filterForm = useForm2({
    initialValues: {
      searchedToken: "",
      common: "all",
      public: "all",
      verified: "all"
    }
  });
  const loadTokensFromDB = async () => {
    const tot_tokens = await db.tokens.count();
    setTotalTokens(tot_tokens);
    const limit = tokensPerPage;
    const offset = (page - 1) * tokensPerPage;
    const searchTermTrimmedZeroes = removeTrailingZeros(filterForm.values.searchedToken);
    const regexString = searchTermTrimmedZeroes.split("").join("[\\w\\s]*");
    const regex = new RegExp(`(${regexString}[\\w\\s]*)`, "gi");
    const filteredTokens = await db.tokens.filter((token2) => {
      const matched = token2.symbol.match(regex) || token2.name.match(regex) || removeTrailingZeros(token2.address).match(regex);
      return matched ? true : false;
    }).filter((token2) => {
      const common = filterForm.values.common;
      if (common === "true") {
        return token2.common === true;
      } else if (common === "false") {
        return token2.common === false;
      }
      return true;
    }).filter((token2) => {
      const verified = filterForm.values.verified;
      if (verified === "true") {
        return token2.verified === true;
      } else if (verified === "false") {
        return token2.verified === false;
      }
      return true;
    }).filter((token2) => {
      const _public = filterForm.values.public;
      if (_public === "true") {
        return token2.public === true;
      } else if (_public === "false") {
        return token2.public === false;
      }
      return true;
    }).limit(limit).offset(offset).toArray();
    setTokens(filteredTokens);
  };
  const updateTokenModal = (token2) => {
    setToken(token2);
    open();
  };
  const reloadTokens = () => {
    reloadTokensFromContract && reloadTokensFromContract();
    loadTokensFromDB();
  };
  const sortTokens = () => {
    return tokens.sort((a, b) => {
      if (a.verified && a.common && !b.verified) {
        return -1;
      } else if (a.verified && !a.common && !b.verified) {
        return -1;
      } else if (!a.verified && b.verified) {
        return 1;
      } else if (!a.verified && !b.verified) {
        return 1;
      } else {
        return a.common ? -1 : 1;
      }
    });
  };
  useEffect3(() => {
    loadTokensFromDB();
  }, [page, loadingTokens]);
  return /* @__PURE__ */ React6.createElement(Stack3, null, /* @__PURE__ */ React6.createElement(Box2, null, /* @__PURE__ */ React6.createElement("form", { onSubmit: filterForm.onSubmit((_values) => loadTokensFromDB()) }, /* @__PURE__ */ React6.createElement(Grid2, null, /* @__PURE__ */ React6.createElement(Grid2.Col, { span: { md: 3 } }, /* @__PURE__ */ React6.createElement(TextInput3, { label: "Search Token", placeholder: "Search by name, symbol or address", radius: "md", ...filterForm.getInputProps("searchedToken") })), /* @__PURE__ */ React6.createElement(Grid2.Col, { span: { md: 2 } }, /* @__PURE__ */ React6.createElement(Select, { label: "Common", radius: "md", placeholder: "True/False", data: [
    { value: "all", label: "All" },
    { value: "true", label: "True" },
    { value: "false", label: "False" }
  ], ...filterForm.getInputProps("common") })), /* @__PURE__ */ React6.createElement(Grid2.Col, { span: { md: 2 } }, /* @__PURE__ */ React6.createElement(Select, { label: "Verified", radius: "md", placeholder: "True/False", data: [
    { value: "all", label: "All" },
    { value: "true", label: "True" },
    { value: "false", label: "False" }
  ], ...filterForm.getInputProps("verified") })), /* @__PURE__ */ React6.createElement(Grid2.Col, { span: { md: 2 } }, /* @__PURE__ */ React6.createElement(Select, { label: "Public", radius: "md", placeholder: "True/False", data: [
    { value: "all", label: "All" },
    { value: "true", label: "True" },
    { value: "false", label: "False" }
  ], ...filterForm.getInputProps("public") })), /* @__PURE__ */ React6.createElement(Grid2.Col, { span: { md: 3 } }, /* @__PURE__ */ React6.createElement(Group2, { h: "100%", justify: "start", align: "end" }, /* @__PURE__ */ React6.createElement(Button3, { radius: "md", type: "submit", size: "xs", leftSection: /* @__PURE__ */ React6.createElement(IconFilter, { size: "16px" }) }, "Filter"), /* @__PURE__ */ React6.createElement(Button3, { color: "indigo", size: "xs", onClick: reloadTokens, radius: "md", leftSection: /* @__PURE__ */ React6.createElement(IconReload2, { size: "16px" }) }, "Refresh")))))), /* @__PURE__ */ React6.createElement(Drawer, { opened, onClose: close, title: `Updating ${token?.name}`, position: "right", size: "sm" }, /* @__PURE__ */ React6.createElement(UpdateTokenForm, { data: token })), /* @__PURE__ */ React6.createElement(
    DataTable,
    {
      withTableBorder: true,
      minHeight: 300,
      verticalSpacing: "md",
      horizontalSpacing: "md",
      borderRadius: "lg",
      records: sortTokens() ?? [],
      columns: [
        {
          accessor: "id",
          title: "ID",
          width: "100px",
          render: (item) => /* @__PURE__ */ React6.createElement(Text3, { size: "sm" }, item.id)
        },
        {
          accessor: "name",
          title: "Name",
          width: "250px",
          render: (item) => /* @__PURE__ */ React6.createElement(Group2, { align: "center", gap: "sm" }, /* @__PURE__ */ React6.createElement(Avatar2, { src: item.icon, size: "md", radius: "md", tt: "uppercase" }, limitChars(item.name, 2, false)), /* @__PURE__ */ React6.createElement(Text3, { size: "sm" }, item.name))
        },
        {
          accessor: "symbol",
          title: "Symbol",
          width: "200px",
          render: (item) => /* @__PURE__ */ React6.createElement(Text3, { size: "sm" }, item.symbol)
        },
        {
          accessor: "address",
          title: "Token Address",
          width: "300px",
          render: (item) => /* @__PURE__ */ React6.createElement(Group2, { gap: 10, wrap: "nowrap" }, /* @__PURE__ */ React6.createElement(CustomCopyButton_default, { color: "green", copy_value: item.address }), /* @__PURE__ */ React6.createElement(Text3, { size: "sm" }, limitChars(item.address, 20, true)))
        },
        {
          accessor: "decimals",
          title: "Decimals",
          width: "100px",
          textAlign: "center",
          render: (item) => /* @__PURE__ */ React6.createElement(Text3, { size: "sm", ta: "center", fw: 500 }, item.decimals)
        },
        {
          accessor: "pair_id",
          title: "Pair ID (Pragma ID)",
          width: "200px",
          textAlign: "center",
          render: (item) => /* @__PURE__ */ React6.createElement(Text3, { size: "sm" }, item.pair_id)
        },
        {
          accessor: "common",
          title: "Common",
          width: "150px",
          textAlign: "center",
          render: (item, i) => /* @__PURE__ */ React6.createElement(Group2, { justify: "center" }, item.common ? /* @__PURE__ */ React6.createElement(IconCheck2, { color: "green", stroke: em(1.5) }) : /* @__PURE__ */ React6.createElement(IconX2, { color: "red", stroke: em(1.5) }))
        },
        {
          accessor: "verified",
          title: "Verified",
          width: "150px",
          textAlign: "center",
          render: (item, i) => /* @__PURE__ */ React6.createElement(Group2, { justify: "center" }, item.verified ? /* @__PURE__ */ React6.createElement(IconCheck2, { color: "green", stroke: em(1.5) }) : /* @__PURE__ */ React6.createElement(IconX2, { color: "red", stroke: em(1.5) }))
        },
        {
          accessor: "public",
          title: "Public",
          width: "150px",
          textAlign: "center",
          render: (item, i) => /* @__PURE__ */ React6.createElement(Group2, { justify: "center" }, item.public ? /* @__PURE__ */ React6.createElement(IconCheck2, { color: "green", stroke: em(1.5) }) : /* @__PURE__ */ React6.createElement(IconX2, { color: "red", stroke: em(1.5) }))
        },
        {
          accessor: "actions",
          title: "Actions",
          width: "150px",
          textAlign: "center",
          render: (item, i) => /* @__PURE__ */ React6.createElement(Group2, { justify: "center" }, /* @__PURE__ */ React6.createElement(ActionIcon3, { onClick: () => updateTokenModal(item) }, /* @__PURE__ */ React6.createElement(IconWriting2, null)))
        }
      ],
      page,
      onPageChange: setPage,
      totalRecords: totalTokens,
      recordsPerPage: 25
    }
  ));
};
var TokensTable_default = TokensTable;
export {
  AddAdminForm,
  ListTokenForm,
  Kit_default as SelectTokenModal,
  wrapper_default as TokenKitWrapper,
  TokensTable_default as TokensTable,
  UpdateAdminForm,
  UpdateTokenForm,
  bigintToLongAddress,
  bigintToShortStr,
  convertToReadableTokens,
  limitChars,
  useTokenKitContext
};
