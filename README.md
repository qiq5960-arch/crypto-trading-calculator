# ApexCalc 合约交易计算器

一个无需后端、开箱即用的中文加密货币永续合约交易计算器。支持 BTC、ETH、SOL、BNB，以及多空方向、手续费返佣、止盈止损测算。

## 立即预览

### 方法一：在 Codex Cloud 中预览

运行下面的命令：

```bash
npm run dev
```

服务会监听 `0.0.0.0:4173`。在 Codex Cloud 的 **Ports / 端口** 面板中找到 `4173`，点击 **Open in Browser / 在浏览器中打开** 即可看到实际界面。

### 方法二：部署到 GitHub Pages（推荐，电脑和手机均可访问）

仓库已经包含自动部署配置。只需：

1. 将仓库推送到 GitHub。
2. 打开仓库的 **Settings → Pages**。
3. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
4. 打开仓库顶部的 **Actions**，等待 “Deploy ApexCalc to GitHub Pages” 变为绿色。
5. Pages 页面会显示公开网址，通常是 `https://你的用户名.github.io/仓库名/`。把该网址发到手机即可直接使用。

之后每次推送到 `main` 或 `work` 分支，网页都会自动更新。

### 方法三：在自己的电脑本地运行

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:4173](http://localhost:4173) 即可。这个项目没有第三方运行依赖，所以也可以跳过 `npm install`，直接执行 `npm run dev`。

如果希望同一 Wi-Fi 下的手机访问，请在电脑终端执行 `npm run dev`，查询电脑的局域网 IP（例如 `192.168.1.10`），然后在手机浏览器打开 `http://192.168.1.10:4173`。电脑防火墙需要允许 Node.js 访问局域网。

## 构建和测试

```bash
npm run build
npm test
```

生产构建会生成 `dist/` 文件夹，可直接上传至 Netlify、Cloudflare Pages、Vercel 或任意静态网站托管服务。

> 本工具只用于交易测算，不构成投资建议；实际成交价格、资金费率与交易所规则可能影响结果。
