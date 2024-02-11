"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AddAdminForm: () => AddAdminForm,
  ListTokenForm: () => ListTokenForm,
  SelectTokenModal: () => Kit_default,
  TokenKitWrapper: () => wrapper_default,
  TokensTable: () => TokensTable_default,
  UpdateAdminForm: () => UpdateAdminForm,
  UpdateTokenForm: () => UpdateTokenForm,
  bigintToLongAddress: () => bigintToLongAddress,
  bigintToShortStr: () => bigintToShortStr,
  convertToReadableTokens: () => convertToReadableTokens,
  limitChars: () => limitChars,
  useTokenKitContext: () => useTokenKitContext
});
module.exports = __toCommonJS(src_exports);

// src/wrapper.tsx
var import_react3 = __toESM(require("react"));
var import_core2 = require("@mantine/core");
var import_modals2 = require("@mantine/modals");
var import_notifications = require("@mantine/notifications");

// src/providers/tokenkitprovider.tsx
var import_react2 = __toESM(require("react"));
var import_starknet2 = require("starknet");
var import_starknetkit = require("starknetkit");

// src/configs/utils.ts
var import_bignumber = require("bignumber.js");

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
var import_starknet = require("starknet");
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
    const bn = (0, import_bignumber.BigNumber)(bigintstr);
    const hex_sentence = `0x` + bn.toString(16);
    return import_starknet.shortString.decodeShortString(hex_sentence);
  } catch (error) {
    return bigintstr;
  }
}
function bigintToLongAddress(bigintstr) {
  try {
    if (!bigintstr)
      return "";
    const bn = (0, import_bignumber.BigNumber)(bigintstr);
    const hex_sentence = `0x` + bn.toString(16);
    return hex_sentence;
  } catch (error) {
    return bigintstr;
  }
}
function convertToReadableTokens(tokens, decimals) {
  if (!tokens || !decimals)
    return "";
  return new import_bignumber.BigNumber(tokens).dividedBy(10 ** decimals).toNumber().toFixed(6);
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
var import_modals = require("@mantine/modals");
var import_core = require("@mantine/core");
var import_bignumber2 = __toESM(require("bignumber.js"));

// src/configs/db.ts
var import_dexie = __toESM(require("dexie"));
var TokenKitDBDexie = class extends import_dexie.default {
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
var import_react = require("react");
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
var TokenKitContext = (0, import_react.createContext)(initialData);
var useTokenKitContext = () => {
  return (0, import_react.useContext)(TokenKitContext);
};

// src/providers/tokenkitprovider.tsx
var TokenKitProvider = ({ children }) => {
  const [contract, setContract] = (0, import_react2.useState)();
  const [pragma_contract, setPragmaContract] = (0, import_react2.useState)();
  const [connection, setConnection] = (0, import_react2.useState)();
  const [account, setAccount] = (0, import_react2.useState)();
  const [address, setAddress] = (0, import_react2.useState)("");
  const [modalOpen, setModalOpen] = (0, import_react2.useState)(false);
  const [selectedToken, setselectedToken] = (0, import_react2.useState)();
  const [loading, setLoading] = (0, import_react2.useState)(false);
  const connectWallet = async () => {
    let provider = new import_starknet2.RpcProvider({ nodeUrl: "https://starknet-goerli.infura.io/v3/958e1b411a40480eacb8c0f5d640a8ec" });
    const connection2 = await (0, import_starknetkit.connect)({
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
    await (0, import_starknetkit.disconnect)({ clearLastWallet: true });
    setConnection(null);
    setAccount(null);
    setAddress("");
  };
  const openConfirmDisconnectModal = () => import_modals.modals.openConfirmModal({
    title: "Please confirm your action",
    centered: true,
    radius: "md",
    children: /* @__PURE__ */ import_react2.default.createElement(import_core.Text, { size: "sm" }, "Are you sure you want to disconnect your account?"),
    labels: { confirm: "Disconnect", cancel: "Cancel" },
    confirmProps: { radius: "md", variant: "light" },
    cancelProps: { radius: "md", variant: "light" },
    onCancel: () => {
    },
    onConfirm: () => disconnectWallet()
  });
  const makeContractConnection = () => {
    let contract2 = new import_starknet2.Contract(TOKEN_KIT_ABI, TOKEN_KIT_CONTRACT_ADDRESS);
    if (account) {
      contract2 = new import_starknet2.Contract(TOKEN_KIT_ABI, TOKEN_KIT_CONTRACT_ADDRESS, account);
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
      decimals: new import_bignumber2.default(token?.decimals).toNumber(),
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
        const noOfTokens = new import_bignumber2.default(totalTokens).toNumber();
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
        const noOfTokens = new import_bignumber2.default(totalTokens).toNumber();
        actualLoadTokens(noOfTokens);
      }
    } catch (error) {
      console.error("Error fetching contract tokens information:", error);
    }
  };
  const contextValue = (0, import_react2.useMemo)(() => ({
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
  (0, import_react2.useEffect)(() => {
    makeContractConnection();
  }, [account]);
  (0, import_react2.useEffect)(() => {
    getContractTokensInfo();
  }, [contract]);
  (0, import_react2.useEffect)(() => {
    connectWallet();
  }, []);
  return /* @__PURE__ */ import_react2.default.createElement(TokenKitContext.Provider, { value: contextValue }, children);
};
var tokenkitprovider_default = TokenKitProvider;

// src/wrapper.tsx
var import_styles = require("@mantine/core/styles.css");
var import_styles2 = require("@mantine/notifications/styles.css");
var import_styles3 = require("@mantine/carousel/styles.css");
var import_styles_layer = require("@mantine/core/styles.layer.css");
var import_styles_layer2 = require("mantine-datatable/styles.layer.css");
var TokenKitWrapper = (props) => {
  const { children, usingMantine } = props;
  if (usingMantine) {
    return /* @__PURE__ */ import_react3.default.createElement(tokenkitprovider_default, null, children);
  }
  return /* @__PURE__ */ import_react3.default.createElement(import_core2.MantineProvider, { theme: {
    primaryColor: "pink"
  } }, /* @__PURE__ */ import_react3.default.createElement(import_modals2.ModalsProvider, null, /* @__PURE__ */ import_react3.default.createElement(import_notifications.Notifications, null), /* @__PURE__ */ import_react3.default.createElement(tokenkitprovider_default, null, children)));
};
var wrapper_default = TokenKitWrapper;

// src/components/Kit.tsx
var import_react4 = require("react");
var import_core3 = require("@mantine/core");
var import_react5 = __toESM(require("react"));
var import_starknet3 = require("starknet");
var import_icons_react = require("@tabler/icons-react");
var import_hooks = require("@mantine/hooks");
var import_modals3 = require("@mantine/modals");
var SelectTokenModal = ({ children, selectedToken, callBackFunc, themeObject }) => {
  const { reloadTokensFromContract, loadingTokens } = useTokenKitContext();
  const [opened, { open, close }] = (0, import_hooks.useDisclosure)(false);
  const [tokens, setTokens] = (0, import_react4.useState)([]);
  const [commonTokens, setCommonTokens] = (0, import_react4.useState)([]);
  const [searchedToken, setSearchedToken] = (0, import_hooks.useDebouncedState)("", 500);
  const [totalTokens, setTotalTokens] = (0, import_react4.useState)(0);
  const [page, setPage] = (0, import_react4.useState)(1);
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
  (0, import_react4.useEffect)(() => {
    loadCommonTokens();
  }, []);
  (0, import_react4.useEffect)(() => {
    loadTokensFromDB();
  }, [searchedToken, page, loadingTokens]);
  return /* @__PURE__ */ import_react5.default.createElement(import_react5.default.Fragment, null, /* @__PURE__ */ import_react5.default.createElement(import_core3.Box, { onClick: open }, children), /* @__PURE__ */ import_react5.default.createElement(
    import_core3.Modal,
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
        import_modals3.modals.closeAll();
      },
      padding: 0,
      radius: "lg",
      title: null
    },
    /* @__PURE__ */ import_react5.default.createElement(import_core3.Box, { style: {
      height: "90dvh",
      background: themeObject.modalBackground
    } }, /* @__PURE__ */ import_react5.default.createElement(import_core3.Box, { h: `${HEADER_HEIGHT}px`, style: {
      background: themeObject.headerFooterBackground
    } }, /* @__PURE__ */ import_react5.default.createElement(import_core3.Group, { p: "md", justify: "space-between", align: "center", className: "w-100" }, /* @__PURE__ */ import_react5.default.createElement(import_core3.Title, { order: 2, fw: 500 }, "Select Token"), /* @__PURE__ */ import_react5.default.createElement(import_core3.ActionIcon, { variant: "light", onClick: close }, /* @__PURE__ */ import_react5.default.createElement(import_icons_react.IconX, null))), /* @__PURE__ */ import_react5.default.createElement(import_core3.Box, { px: "md", h: `${HEADER_HEIGHT}px` }, /* @__PURE__ */ import_react5.default.createElement(import_core3.Stack, { h: `${HEADER_HEIGHT}px`, gap: 6 }, /* @__PURE__ */ import_react5.default.createElement(
      import_core3.TextInput,
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
    ), /* @__PURE__ */ import_react5.default.createElement(import_core3.Group, { justify: "space-between", align: "center" }, /* @__PURE__ */ import_react5.default.createElement(import_core3.Title, { order: 5, mb: "xs" }, "Common tokens"), /* @__PURE__ */ import_react5.default.createElement(import_core3.Button, { color: "indigo", onClick: reloadTokensFromContract, size: "xs", radius: "md", leftSection: /* @__PURE__ */ import_react5.default.createElement(import_icons_react.IconReload, { size: "16px" }) }, "Refresh")), /* @__PURE__ */ import_react5.default.createElement(import_core3.Box, { style: { overflow: "hidden", maxWidth: "100%" } }, commonTokens?.length === 0 ? /* @__PURE__ */ import_react5.default.createElement(import_core3.Text, { fw: 500, ta: "center", c: themeObject.textColor }, "No listed common tokens.") : null, /* @__PURE__ */ import_react5.default.createElement(import_core3.ScrollArea, { scrollbarSize: 10, pb: "10px", type: "always" }, /* @__PURE__ */ import_react5.default.createElement(import_core3.Group, { display: "flex", style: { flexWrap: "nowrap" }, p: "6px", gap: 10 }, commonTokens?.map((item, i) => /* @__PURE__ */ import_react5.default.createElement(import_core3.Box, { key: `token_s_${i}`, w: "fit-content" }, /* @__PURE__ */ import_react5.default.createElement(
      SelectTokenBtn,
      {
        token: item,
        select: selectSingle,
        selectedToken,
        bgColor: themeObject.tokenBackgroundColor,
        hoverColor: themeObject.tokenHoverColor
      }
    ))))))))), /* @__PURE__ */ import_react5.default.createElement(import_core3.Box, { style: {
      height: `calc(100% - ${HEADER_HEIGHT}px - 60px)`,
      background: themeObject.modalBackground
    } }, /* @__PURE__ */ import_react5.default.createElement(import_core3.ScrollArea, { className: "h-100" }, tokens?.length === 0 ? /* @__PURE__ */ import_react5.default.createElement(import_core3.Box, { h: 300 }, /* @__PURE__ */ import_react5.default.createElement(import_core3.Center, { h: 300 }, /* @__PURE__ */ import_react5.default.createElement(import_core3.Text, { fw: 500, ta: "center", maw: "80%", c: themeObject.textColor }, "No tokens have been listed yet! be the first to list ", /* @__PURE__ */ import_react5.default.createElement(import_core3.Anchor, { href: "/", target: "_blank" }, "here.")))) : null, /* @__PURE__ */ import_react5.default.createElement(import_core3.Stack, { p: "xs", gap: 0 }, sortTokens()?.map((item, i) => /* @__PURE__ */ import_react5.default.createElement(
      SelectToken,
      {
        key: `dfd_${i}`,
        token: item,
        select: selectSingle,
        selectedToken,
        bgColor: themeObject.tokenBackgroundColor,
        hoverColor: themeObject.tokenHoverColor
      }
    ))))), /* @__PURE__ */ import_react5.default.createElement(import_core3.Box, { px: "md", style: (theme) => ({
      height: `60px`,
      background: themeObject.headerFooterBackground
    }) }, /* @__PURE__ */ import_react5.default.createElement(import_core3.Group, { style: { height: "100%" }, align: "center", justify: "space-between" }, /* @__PURE__ */ import_react5.default.createElement(import_core3.Anchor, { href: "/", size: "sm" }, "Add New"), /* @__PURE__ */ import_react5.default.createElement(import_core3.Pagination, { value: page, radius: "md", onChange: setPage, total: Math.ceil(totalTokens / tokensPerPage), size: "sm" }))))
  ));
};
var SelectToken = ({ token, select, selectedToken, bgColor, hoverColor }) => {
  const { colorScheme } = (0, import_core3.useMantineColorScheme)();
  const { pragma_contract } = useTokenKitContext();
  const [tokenPrice, setTokenPrice] = (0, import_react4.useState)(null);
  const getTokenPrice = async () => {
    if (pragma_contract) {
      const SPOTENTRY_ENUM = new import_starknet3.CairoCustomEnum({
        SpotEntry: token?.pair_id
      });
      const res = await pragma_contract.get_data_median(SPOTENTRY_ENUM);
    }
  };
  const selectToken = () => {
    select(token);
  };
  const has_changed = (0, import_react4.useMemo)(() => ({
    pragma_contract,
    selectedToken
  }), [pragma_contract, selectedToken]);
  (0, import_react4.useEffect)(() => {
    getTokenPrice();
  }, [has_changed]);
  return /* @__PURE__ */ import_react5.default.createElement(import_core3.Paper, { py: "xs", bg: selectedToken?.address === token?.address ? hoverColor : bgColor, radius: "md", px: "md", style: {
    backgroundColor: `${selectedToken?.address === token?.address ? hoverColor : bgColor} !important`,
    cursor: "pointer",
    pointerEvents: selectedToken?.address === token?.address ? "none" : "all"
  }, onClick: () => selectToken() }, /* @__PURE__ */ import_react5.default.createElement(import_core3.Group, { justify: "space-between", align: "center" }, /* @__PURE__ */ import_react5.default.createElement(import_core3.Group, { align: "center" }, /* @__PURE__ */ import_react5.default.createElement(import_core3.Avatar, { size: "sm", src: token?.icon, variant: "light", color: "pink" }), /* @__PURE__ */ import_react5.default.createElement(import_core3.Stack, { gap: -10 }, /* @__PURE__ */ import_react5.default.createElement(import_core3.Text, { size: "md" }, /* @__PURE__ */ import_react5.default.createElement("b", null, token?.symbol)), /* @__PURE__ */ import_react5.default.createElement(import_core3.Text, { size: "sm", fw: 400 }, token?.name))), /* @__PURE__ */ import_react5.default.createElement(import_core3.Text, { size: "sm", fw: 500 }, "$", formatNumberInternational(tokenPrice))));
};
var SelectTokenBtn = ({ token, select, selectedToken, bgColor, hoverColor }) => {
  const { colorScheme } = (0, import_core3.useMantineColorScheme)();
  const { pragma_contract } = useTokenKitContext();
  const [tokenPrice, setTokenPrice] = (0, import_react4.useState)(null);
  const [_loading, setLoading] = (0, import_react4.useState)(false);
  const getTokenPrice = async () => {
    setLoading(true);
    if (pragma_contract) {
      const SPOTENTRY_ENUM = new import_starknet3.CairoCustomEnum({
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
  (0, import_react4.useEffect)(() => {
    getTokenPrice();
  }, [pragma_contract, selectedToken]);
  return /* @__PURE__ */ import_react5.default.createElement(import_core3.Paper, { bg: selectedToken?.address === token?.address ? hoverColor : bgColor, style: {
    background: `${selectedToken?.address === token?.address ? hoverColor : bgColor} !important`,
    border: "none",
    borderRadius: "10px",
    pointerEvents: selectedToken?.address === token?.address ? "none" : "all",
    padding: "4px 6px",
    cursor: "pointer",
    width: "fit-content"
  }, onClick: () => selectToken() }, /* @__PURE__ */ import_react5.default.createElement(import_core3.Group, { gap: 10, wrap: "nowrap" }, /* @__PURE__ */ import_react5.default.createElement(import_core3.Avatar, { size: "sm", src: token?.icon }), /* @__PURE__ */ import_react5.default.createElement(import_core3.Text, { size: "sm", fw: 500 }, token?.symbol)));
};
var Kit_default = SelectTokenModal;

// src/components/TokensTable.tsx
var import_hooks2 = require("@mantine/hooks");
var import_react9 = __toESM(require("react"));
var import_core6 = require("@mantine/core");

// src/components/CustomCopyButton.tsx
var import_react6 = __toESM(require("react"));
var import_core4 = require("@mantine/core");
var import_icons_react2 = require("@tabler/icons-react");
var CustomCopyBtn = (props) => {
  const { color, copy_value } = props;
  return /* @__PURE__ */ import_react6.default.createElement(import_core4.CopyButton, { value: copy_value }, ({ copied, copy }) => /* @__PURE__ */ import_react6.default.createElement(import_core4.Tooltip, { label: copied ? "Copied" : "Copy" }, /* @__PURE__ */ import_react6.default.createElement(import_core4.ActionIcon, { variant: "light", size: "sm", radius: "sm", color: copied ? `${color}.9` : color, onClick: copy }, /* @__PURE__ */ import_react6.default.createElement(import_icons_react2.IconCopy, null))));
};
var CustomCopyButton_default = CustomCopyBtn;

// src/components/TokensTable.tsx
var import_icons_react4 = require("@tabler/icons-react");

// src/components/forms.tsx
var import_core5 = require("@mantine/core");
var import_form = require("@mantine/form");
var import_notifications2 = require("@mantine/notifications");
var import_icons_react3 = require("@tabler/icons-react");
var import_react7 = __toESM(require("react"));
var import_react8 = require("react");
var UpdateTokenForm = (props) => {
  const { data } = props;
  const { contract } = useTokenKitContext();
  const [loading, setLoading] = (0, import_react8.useState)(false);
  const form = (0, import_form.useForm)({
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
        (0, import_notifications2.showNotification)({
          title: "Update",
          message: `Update Succesful`,
          color: "green",
          icon: /* @__PURE__ */ import_react7.default.createElement(import_icons_react3.IconCheck, null)
        });
      }).catch((err) => {
        (0, import_notifications2.showNotification)({
          title: "Update failed",
          message: `${err}`,
          color: "red",
          icon: /* @__PURE__ */ import_react7.default.createElement(import_icons_react3.IconAlertTriangle, null)
        });
      }).finally(() => {
        setLoading(false);
      });
    }
  };
  return /* @__PURE__ */ import_react7.default.createElement("form", { onSubmit: form.onSubmit((_values) => handleSubmit()) }, /* @__PURE__ */ import_react7.default.createElement(import_core5.Stack, null, /* @__PURE__ */ import_react7.default.createElement(import_core5.Title, { order: 3 }, "Update Token"), /* @__PURE__ */ import_react7.default.createElement(import_core5.Grid, null, /* @__PURE__ */ import_react7.default.createElement(import_core5.Grid.Col, { span: { md: 12 } }, /* @__PURE__ */ import_react7.default.createElement(import_core5.NumberInput, { disabled: true, label: "Token Index", placeholder: "Token Index", radius: "md", ...form.getInputProps("token_index") })), /* @__PURE__ */ import_react7.default.createElement(import_core5.Grid.Col, { span: { md: 12 } }, /* @__PURE__ */ import_react7.default.createElement(import_core5.TextInput, { label: "Pair ID", placeholder: "ETH/USD", radius: "md", ...form.getInputProps("pair_id") })), /* @__PURE__ */ import_react7.default.createElement(import_core5.Grid.Col, { span: { md: 4 } }, /* @__PURE__ */ import_react7.default.createElement(import_core5.Switch, { label: "Common", radius: "md", ...form.getInputProps("common", { type: "checkbox" }) })), /* @__PURE__ */ import_react7.default.createElement(import_core5.Grid.Col, { span: { md: 4 } }, /* @__PURE__ */ import_react7.default.createElement(import_core5.Switch, { label: "Public", radius: "md", ...form.getInputProps("public", { type: "checkbox" }) })), /* @__PURE__ */ import_react7.default.createElement(import_core5.Grid.Col, { span: { md: 4 } }, /* @__PURE__ */ import_react7.default.createElement(import_core5.Switch, { label: "Verified", radius: "md", ...form.getInputProps("verified", { type: "checkbox" }) })), /* @__PURE__ */ import_react7.default.createElement(import_core5.Grid.Col, { span: { md: 12 } }, /* @__PURE__ */ import_react7.default.createElement(import_core5.TextInput, { label: "Icon Link", placeholder: "https://shortlink/xysx", radius: "md", ...form.getInputProps("icon_link"), maxLength: 29 })), /* @__PURE__ */ import_react7.default.createElement(import_core5.Grid.Col, { span: { md: 12 } }, /* @__PURE__ */ import_react7.default.createElement(import_core5.Button, { radius: "md", type: "submit", leftSection: loading ? /* @__PURE__ */ import_react7.default.createElement(import_core5.Loader, { size: "sm", color: "white" }) : /* @__PURE__ */ import_react7.default.createElement(import_icons_react3.IconWriting, { size: "18px" }), rightSection: loading ? /* @__PURE__ */ import_react7.default.createElement(import_core5.Loader, { color: "white", size: "sm" }) : null }, "Update Token")))));
};
var ListTokenForm = () => {
  const [loading, setLoading] = (0, import_react8.useState)(false);
  const { contract } = useTokenKitContext();
  const form = (0, import_form.useForm)({
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
        (0, import_notifications2.showNotification)({
          title: "Token Listing",
          message: `Token Added Succesfully`,
          color: "green",
          icon: /* @__PURE__ */ import_react7.default.createElement(import_icons_react3.IconCheck, null)
        });
      }).catch((err) => {
        (0, import_notifications2.showNotification)({
          title: "Token listing failed",
          message: `${err}`,
          color: "red",
          icon: /* @__PURE__ */ import_react7.default.createElement(import_icons_react3.IconAlertTriangle, null)
        });
      }).finally(() => {
        setLoading(false);
      });
    }
  };
  return /* @__PURE__ */ import_react7.default.createElement("form", { onSubmit: form.onSubmit((_values) => handleSubmit()) }, /* @__PURE__ */ import_react7.default.createElement(import_core5.Stack, null, /* @__PURE__ */ import_react7.default.createElement(import_core5.Title, { order: 3 }, "List new Token"), /* @__PURE__ */ import_react7.default.createElement(import_core5.Grid, null, /* @__PURE__ */ import_react7.default.createElement(import_core5.Grid.Col, { span: { md: 12 } }, /* @__PURE__ */ import_react7.default.createElement(import_core5.TextInput, { label: "Token Address", placeholder: "Token Address", radius: "md", ...form.getInputProps("address") })), /* @__PURE__ */ import_react7.default.createElement(import_core5.Grid.Col, { span: { md: 12 } }, /* @__PURE__ */ import_react7.default.createElement(import_core5.TextInput, { label: "Pair ID", placeholder: "ETH/USD", radius: "md", ...form.getInputProps("pair_id") })), /* @__PURE__ */ import_react7.default.createElement(import_core5.Grid.Col, { span: { md: 12 } }, /* @__PURE__ */ import_react7.default.createElement(import_core5.TextInput, { label: "Icon Link", placeholder: "https://shortlink/xysx", ...form.getInputProps("icon_link"), maxLength: 29, radius: "md" })), /* @__PURE__ */ import_react7.default.createElement(import_core5.Grid.Col, { span: { md: 12 } }, /* @__PURE__ */ import_react7.default.createElement(import_core5.Button, { radius: "md", type: "submit", leftSection: /* @__PURE__ */ import_react7.default.createElement(import_icons_react3.IconUpload, { size: "18px" }), rightSection: loading ? /* @__PURE__ */ import_react7.default.createElement(import_core5.Loader, { color: "white", size: "sm" }) : null }, "List Token")))));
};
var AddAdminForm = () => {
  const [loading, setLoading] = (0, import_react8.useState)(false);
  const { contract } = useTokenKitContext();
  const form = (0, import_form.useForm)({
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
        (0, import_notifications2.showNotification)({
          title: "New Admin",
          message: `Admin Added Successfully`,
          color: "green",
          icon: /* @__PURE__ */ import_react7.default.createElement(import_icons_react3.IconCheck, null)
        });
      }).catch((err) => {
        (0, import_notifications2.showNotification)({
          title: "Adding failed",
          message: `${err}`,
          color: "red",
          icon: /* @__PURE__ */ import_react7.default.createElement(import_icons_react3.IconAlertTriangle, null)
        });
      }).finally(() => {
        setLoading(false);
      });
    }
  };
  return /* @__PURE__ */ import_react7.default.createElement("form", { onSubmit: form.onSubmit((_values) => handleSubmit()) }, /* @__PURE__ */ import_react7.default.createElement(import_core5.Stack, null, /* @__PURE__ */ import_react7.default.createElement(import_core5.Title, { order: 3 }, "Add New Admin"), /* @__PURE__ */ import_react7.default.createElement(import_core5.Grid, null, /* @__PURE__ */ import_react7.default.createElement(import_core5.Grid.Col, { span: { md: 12 } }, /* @__PURE__ */ import_react7.default.createElement(import_core5.TextInput, { label: "Admin Address", placeholder: "Admin Address", radius: "md", ...form.getInputProps("address") })), /* @__PURE__ */ import_react7.default.createElement(import_core5.Grid.Col, { span: { md: 12 } }, /* @__PURE__ */ import_react7.default.createElement(import_core5.Button, { radius: "md", type: "submit", leftSection: /* @__PURE__ */ import_react7.default.createElement(import_icons_react3.IconUpload, { size: "18px" }), rightSection: loading ? /* @__PURE__ */ import_react7.default.createElement(import_core5.Loader, { color: "white", size: "sm" }) : null }, "Add Admin")))));
};
var UpdateAdminForm = (props) => {
  const { data } = props;
  const [loading, setLoading] = (0, import_react8.useState)(false);
  const { contract } = useTokenKitContext();
  const form = (0, import_form.useForm)({
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
        (0, import_notifications2.showNotification)({
          title: "New Admin",
          message: `Admin Updated Successfully`,
          color: "green",
          icon: /* @__PURE__ */ import_react7.default.createElement(import_icons_react3.IconCheck, null)
        });
      }).catch((err) => {
        (0, import_notifications2.showNotification)({
          title: "Update failed",
          message: `${err}`,
          color: "red",
          icon: /* @__PURE__ */ import_react7.default.createElement(import_icons_react3.IconAlertTriangle, null)
        });
      }).finally(() => {
        setLoading(false);
      });
    }
  };
  return /* @__PURE__ */ import_react7.default.createElement("form", { onSubmit: form.onSubmit((_values) => handleSubmit()) }, /* @__PURE__ */ import_react7.default.createElement(import_core5.Stack, null, /* @__PURE__ */ import_react7.default.createElement(import_core5.Title, { order: 3 }, "Update Admin"), /* @__PURE__ */ import_react7.default.createElement(import_core5.Grid, null, /* @__PURE__ */ import_react7.default.createElement(import_core5.Grid.Col, { span: { md: 12 } }, /* @__PURE__ */ import_react7.default.createElement(import_core5.TextInput, { label: "Admin Address", disabled: true, placeholder: "Admin Address", radius: "md", ...form.getInputProps("address") })), /* @__PURE__ */ import_react7.default.createElement(import_core5.Grid.Col, { span: { md: 4 } }, /* @__PURE__ */ import_react7.default.createElement(import_core5.Switch, { label: "Has Admin Permissions", radius: "md", ...form.getInputProps("has_permission", { type: "checkbox" }) })), /* @__PURE__ */ import_react7.default.createElement(import_core5.Grid.Col, { span: { md: 12 } }, /* @__PURE__ */ import_react7.default.createElement(import_core5.Button, { radius: "md", type: "submit", leftSection: /* @__PURE__ */ import_react7.default.createElement(import_icons_react3.IconUpload, { size: "18px" }), rightSection: loading ? /* @__PURE__ */ import_react7.default.createElement(import_core5.Loader, { color: "white", size: "sm" }) : null }, "Add Admin")))));
};

// src/components/TokensTable.tsx
var import_form2 = require("@mantine/form");
var TokensTable = (props) => {
  const { reloadTokensFromContract, loadingTokens } = useTokenKitContext();
  const { DataTable } = props;
  const [tokens, setTokens] = (0, import_react9.useState)([]);
  const [token, setToken] = (0, import_react9.useState)();
  const [opened, { open, close }] = (0, import_hooks2.useDisclosure)(false);
  const [totalTokens, setTotalTokens] = (0, import_react9.useState)(0);
  const [page, setPage] = (0, import_react9.useState)(1);
  const tokensPerPage = 25;
  const filterForm = (0, import_form2.useForm)({
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
  (0, import_react9.useEffect)(() => {
    loadTokensFromDB();
  }, [page, loadingTokens]);
  return /* @__PURE__ */ import_react9.default.createElement(import_core6.Stack, null, /* @__PURE__ */ import_react9.default.createElement(import_core6.Box, null, /* @__PURE__ */ import_react9.default.createElement("form", { onSubmit: filterForm.onSubmit((_values) => loadTokensFromDB()) }, /* @__PURE__ */ import_react9.default.createElement(import_core6.Grid, null, /* @__PURE__ */ import_react9.default.createElement(import_core6.Grid.Col, { span: { md: 3 } }, /* @__PURE__ */ import_react9.default.createElement(import_core6.TextInput, { label: "Search Token", placeholder: "Search by name, symbol or address", radius: "md", ...filterForm.getInputProps("searchedToken") })), /* @__PURE__ */ import_react9.default.createElement(import_core6.Grid.Col, { span: { md: 2 } }, /* @__PURE__ */ import_react9.default.createElement(import_core6.Select, { label: "Common", radius: "md", placeholder: "True/False", data: [
    { value: "all", label: "All" },
    { value: "true", label: "True" },
    { value: "false", label: "False" }
  ], ...filterForm.getInputProps("common") })), /* @__PURE__ */ import_react9.default.createElement(import_core6.Grid.Col, { span: { md: 2 } }, /* @__PURE__ */ import_react9.default.createElement(import_core6.Select, { label: "Verified", radius: "md", placeholder: "True/False", data: [
    { value: "all", label: "All" },
    { value: "true", label: "True" },
    { value: "false", label: "False" }
  ], ...filterForm.getInputProps("verified") })), /* @__PURE__ */ import_react9.default.createElement(import_core6.Grid.Col, { span: { md: 2 } }, /* @__PURE__ */ import_react9.default.createElement(import_core6.Select, { label: "Public", radius: "md", placeholder: "True/False", data: [
    { value: "all", label: "All" },
    { value: "true", label: "True" },
    { value: "false", label: "False" }
  ], ...filterForm.getInputProps("public") })), /* @__PURE__ */ import_react9.default.createElement(import_core6.Grid.Col, { span: { md: 3 } }, /* @__PURE__ */ import_react9.default.createElement(import_core6.Group, { h: "100%", justify: "start", align: "end" }, /* @__PURE__ */ import_react9.default.createElement(import_core6.Button, { radius: "md", type: "submit", size: "xs", leftSection: /* @__PURE__ */ import_react9.default.createElement(import_icons_react4.IconFilter, { size: "16px" }) }, "Filter"), /* @__PURE__ */ import_react9.default.createElement(import_core6.Button, { color: "indigo", size: "xs", onClick: reloadTokens, radius: "md", leftSection: /* @__PURE__ */ import_react9.default.createElement(import_icons_react4.IconReload, { size: "16px" }) }, "Refresh")))))), /* @__PURE__ */ import_react9.default.createElement(import_core6.Drawer, { opened, onClose: close, title: `Updating ${token?.name}`, position: "right", size: "sm" }, /* @__PURE__ */ import_react9.default.createElement(UpdateTokenForm, { data: token })), /* @__PURE__ */ import_react9.default.createElement(
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
          render: (item) => /* @__PURE__ */ import_react9.default.createElement(import_core6.Text, { size: "sm" }, item.id)
        },
        {
          accessor: "name",
          title: "Name",
          width: "250px",
          render: (item) => /* @__PURE__ */ import_react9.default.createElement(import_core6.Group, { align: "center", gap: "sm" }, /* @__PURE__ */ import_react9.default.createElement(import_core6.Avatar, { src: item.icon, size: "md", radius: "md", tt: "uppercase" }, limitChars(item.name, 2, false)), /* @__PURE__ */ import_react9.default.createElement(import_core6.Text, { size: "sm" }, item.name))
        },
        {
          accessor: "symbol",
          title: "Symbol",
          width: "200px",
          render: (item) => /* @__PURE__ */ import_react9.default.createElement(import_core6.Text, { size: "sm" }, item.symbol)
        },
        {
          accessor: "address",
          title: "Token Address",
          width: "300px",
          render: (item) => /* @__PURE__ */ import_react9.default.createElement(import_core6.Group, { gap: 10, wrap: "nowrap" }, /* @__PURE__ */ import_react9.default.createElement(CustomCopyButton_default, { color: "green", copy_value: item.address }), /* @__PURE__ */ import_react9.default.createElement(import_core6.Text, { size: "sm" }, limitChars(item.address, 20, true)))
        },
        {
          accessor: "decimals",
          title: "Decimals",
          width: "100px",
          textAlign: "center",
          render: (item) => /* @__PURE__ */ import_react9.default.createElement(import_core6.Text, { size: "sm", ta: "center", fw: 500 }, item.decimals)
        },
        {
          accessor: "pair_id",
          title: "Pair ID (Pragma ID)",
          width: "200px",
          textAlign: "center",
          render: (item) => /* @__PURE__ */ import_react9.default.createElement(import_core6.Text, { size: "sm" }, item.pair_id)
        },
        {
          accessor: "common",
          title: "Common",
          width: "150px",
          textAlign: "center",
          render: (item, i) => /* @__PURE__ */ import_react9.default.createElement(import_core6.Group, { justify: "center" }, item.common ? /* @__PURE__ */ import_react9.default.createElement(import_icons_react4.IconCheck, { color: "green", stroke: (0, import_core6.em)(1.5) }) : /* @__PURE__ */ import_react9.default.createElement(import_icons_react4.IconX, { color: "red", stroke: (0, import_core6.em)(1.5) }))
        },
        {
          accessor: "verified",
          title: "Verified",
          width: "150px",
          textAlign: "center",
          render: (item, i) => /* @__PURE__ */ import_react9.default.createElement(import_core6.Group, { justify: "center" }, item.verified ? /* @__PURE__ */ import_react9.default.createElement(import_icons_react4.IconCheck, { color: "green", stroke: (0, import_core6.em)(1.5) }) : /* @__PURE__ */ import_react9.default.createElement(import_icons_react4.IconX, { color: "red", stroke: (0, import_core6.em)(1.5) }))
        },
        {
          accessor: "public",
          title: "Public",
          width: "150px",
          textAlign: "center",
          render: (item, i) => /* @__PURE__ */ import_react9.default.createElement(import_core6.Group, { justify: "center" }, item.public ? /* @__PURE__ */ import_react9.default.createElement(import_icons_react4.IconCheck, { color: "green", stroke: (0, import_core6.em)(1.5) }) : /* @__PURE__ */ import_react9.default.createElement(import_icons_react4.IconX, { color: "red", stroke: (0, import_core6.em)(1.5) }))
        },
        {
          accessor: "actions",
          title: "Actions",
          width: "150px",
          textAlign: "center",
          render: (item, i) => /* @__PURE__ */ import_react9.default.createElement(import_core6.Group, { justify: "center" }, /* @__PURE__ */ import_react9.default.createElement(import_core6.ActionIcon, { onClick: () => updateTokenModal(item) }, /* @__PURE__ */ import_react9.default.createElement(import_icons_react4.IconWriting, null)))
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AddAdminForm,
  ListTokenForm,
  SelectTokenModal,
  TokenKitWrapper,
  TokensTable,
  UpdateAdminForm,
  UpdateTokenForm,
  bigintToLongAddress,
  bigintToShortStr,
  convertToReadableTokens,
  limitChars,
  useTokenKitContext
});
