const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const IP_ADDRESS = process.env.IP_ADDRESS || "localhost";

// セキュリティヘッダーの設定
app.use(helmet());

// レート制限の設定
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分
    max: 100, // IPアドレスごとに100リクエスト
});
app.use(limiter);

const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",")
        : "*",
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

app.post("/send-email", async (req, res) => {
    try {
        const { email, subject, message } = req.body;

        if (!email || !subject || !message) {
            return res
                .status(400)
                .json({ error: "必要な情報が不足しています" });
        }

        // 簡単な入力検証
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: "無効なメールアドレスです" });
        }

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: subject,
            text: message,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log("メール送信成功:", info.response);
        res.status(200).json({ message: "メールが送信されました" });
    } catch (error) {
        console.error("メール送信エラー:", error);
        res.status(500).json({
            error: "メール送信に失敗しました",
            details: error.message,
        });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

app.listen(PORT, IP_ADDRESS, () => {
    console.log(`サーバーが起動しました: http://${IP_ADDRESS}:${PORT}`);
});
