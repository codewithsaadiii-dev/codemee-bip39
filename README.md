# CodeMee BIP39 Tool

A secure, open-source tool for converting BIP39 mnemonic phrases to addresses and private keys. 

## 🌐 Online Version

You can access the live web version of the tool here:
**[bip39.codemee.xyz](https://bip39.codemee.xyz)**

---

## 🚀 How to use tool (For Users)

There are two ways to use the CodeMee BIP39 Tool:

### Option 1: Online Web Tool
Simply visit the online link above to use the tool directly in your browser. 

### Option 2: Standalone Offline Version (Recommended)
For maximum security, you can run this tool offline on your local machine.
1. Download the `bip39-standalone.html` file from the repository's **[Releases](https://github.com/codewithsaadiii-dev/codemee-bip39/releases)** page.
2. Disconnect your computer from the internet.
3. Open the downloaded HTML file directly in your web browser by double-clicking it.

### How to Use the Interface
* Enter your BIP39 phrase into the **'BIP39 Phrase'** field, or press **'Generate Random Phrase'**.
* If required, set the derivation path (the defaults are highly usable for most wallets).
* Scroll down to see the table containing a list of addresses generated from your phrase.
* You can toggle columns to blank to easily copy and paste a single column of data (e.g., to safely import private keys into a wallet or supply someone with a list of public addresses).

---

## 💻 For Developers (Ubuntu/Linux)

If you want to compile the standalone file from the source code or run tests, follow these instructions. 

### 1. Clone the Repository
Open your terminal and run the following commands to download a fresh copy of the code to your Desktop:

```bash
cd ~
git clone [https://github.com/codewithsaadiii-dev/codemee-bip39.git](https://github.com/codewithsaadiii-dev/codemee-bip39.git)
cd codemee-bip39
```

### 2. Build the Standalone File
To generate the single, standalone HTML file (`bip39-standalone.html`), you need to run the Python compile script. 

*Note: Please do not make manual modifications to `bip39-standalone.html`, as they will be overwritten by the compiler. Make all your changes in the `src/` directory.*

```bash
cd ~/codemee-bip39
python3 compile.py
```

### 3. Running Tests
The testing environment relies on Node.js and Selenium. 

**Step A: Install Test Dependencies**
Navigate to the tests folder to install the required Node modules (this will recreate your `node_modules` folder):

```bash
cd ~/codemee-bip39/tests
npm install
```

**Step B: Start the Python Server (Terminal 1)**
The testing robot requires a live local URL to visit. Ensure you are in the root project directory and start the server:

```bash
cd ~/codemee-bip39
python3 -m http.server 8000
```
*(Leave this terminal window open and running!)*

**Step C: Run the Tests (Terminal 2)**
Open a second, new terminal window (`Ctrl + Alt + T` on Ubuntu). Navigate to the tests folder and launch Jasmine:

```bash
cd ~/codemee-bip39/tests
npx jasmine spec/tests.js
```

---

## 💖 Donations

**Why donate to us?** Your donations directly support our team in making more advancements in open-source security tools. It also helps fund the development of our upcoming flagship project: the **Crypto Wallet**.

If you find this tool helpful, consider supporting us at the following addresses:

* **Bitcoin (BTC):** `bc1ql2yzz4aeufl8k70sr2axr7tcdegvxskqfm8wq3`
* **Litecoin (LTC):** `ltc1qqnfg75lff9s3u8cqjvfl5unk4c87uu0r57kuhw`
* **Meta Mask Ethereum (ETH) / BNB Chain:** `0xA7145c568Fb1BCAe0632d6d0aE9E2B1c193BA3Ba`

---

## 💬 Get Help & Feedback
Encountered an issue, have a feature request, or just want to share your thoughts? We'd love to hear from you!

* **Email:** [codewithsaadiii@gmail.com](mailto:codewithsaadiii@gmail.com)

## 📄 License

This BIP39 tool is released under the terms of the MIT license. See the `LICENSE` file for more information or visit https://opensource.org/licenses/MIT.
