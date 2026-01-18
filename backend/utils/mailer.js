const fetch = require("node-fetch");

async function sendOTPEmail(to, otp) {
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) throw new Error("Missing BREVO_API_KEY");

    const payload = {
        sender: {
            email: "aanush748@gmail.com",
            name: "BAKA TEAM"
        },
        to: [{ email: to }],
        subject: "Your OTP Code",
        htmlContent: `
            <p>Your OTP is <strong>${otp}</strong></p>
            <p>This code expires in 5 minutes.</p>
            <br/>
            <p>Regards,<br/><b>BAKA TEAM</b></p>
        `
    };

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-key": apiKey
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const err = await res.text();
        console.log("BREVO SEND ERROR →", err);
        throw new Error("Brevo error: " + err);
    }

    return true;
}
async function welcome(name, phone, usn, gender, to, key) {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) throw new Error("Missing BREVO_API_KEY");

    const payload = {
        sender: {
            email: "aanush748@gmail.com",
            name: "BAKA TEAM"
        },
        to: [{ email: to }],
        subject: "Welcome Message",
        htmlContent: `
<pre style="font-family: Arial; white-space: pre-wrap; font-size: 15px; color:#000;">

🎉 Welcome to Canteen Connect!

Hi ${name},

Welcome to Canteen Connect! We’re so excited to have you on board 🚀
Thanks for signing up. You're officially part of the inner circle now.

Here are your details:
Name: ${name}
Phone: ${phone}
USN: ${usn}
Gender: ${gender}

Your unique key for assistance & order verification:
</pre>

<div style="padding:10px; background:#eee; border-radius:6px; font-size:18px; text-align:center; font-family: Arial;">
${key}
</div>

<pre style="font-family: Arial; white-space: pre-wrap; font-size: 15px; color:#000;">

If you have any questions or need help, feel free to reach out anytime 📩
Happy exploring! 🌐✨

Best regards,
BAKA TEAM 😎

</pre>
`


    };

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-key": apiKey
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const err = await res.text();
        console.log("BREVO SEND ERROR →", err);
        throw new Error("Brevo error: " + err);
    }

    return true;
}


async function sendTopupAcceptedEmail(to, name, amount) {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) return;

    const payload = {
        sender: { email: "aanush748@gmail.com", name: "BAKA TEAM" },
        to: [{ email: to }],
        subject: "Top-up Accepted",
        htmlContent: `
            <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                <h2 style="color: #4CAF50;">Top-up Successful!</h2>
                <p>Hi ${name},</p>
                <p>Your wallet top-up of <strong>₹${amount}</strong> has been approved and added to your balance.</p>
                <br/>
                <p>Regards,<br/><b>BAKA TEAM</b></p>
            </div>
        `
    };

    await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "Content-Type": "application/json", "api-key": apiKey },
        body: JSON.stringify(payload)
    });
}

async function sendTopupRejectedEmail(to, name, amount) {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) return;

    const payload = {
        sender: { email: "aanush748@gmail.com", name: "BAKA TEAM" },
        to: [{ email: to }],
        subject: "Top-up Rejected",
        htmlContent: `
            <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                <h2 style="color: #F44336;">Top-up Rejected</h2>
                <p>Hi ${name},</p>
                <p>Your wallet top-up request of <strong>₹${amount}</strong> was rejected.</p>
                <p>Please contact support if you think this is a mistake.</p>
                <br/>
                <p>Regards,<br/><b>BAKA TEAM</b></p>
            </div>
        `
    };

    await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "Content-Type": "application/json", "api-key": apiKey },
        body: JSON.stringify(payload)
    });
}

async function sendOrderPlacedEmail(to, name, orderItems, totalAmount) {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) return;

    let itemsHtml = orderItems.map(item => `
        <div style="display: flex; align-items: center; border-bottom: 1px solid #eee; padding: 10px 0;">
            <img src="${item.itemsrc}" alt="${item.itemname}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover; margin-right: 15px;">
            <div>
                <p style="margin: 0; font-weight: bold;">${item.itemname}</p>
                <p style="margin: 0; color: #555;">Qty: ${item.quantity} | ₹${item.itemprice}</p>
            </div>
        </div>
    `).join('');

    const payload = {
        sender: { email: "aanush748@gmail.com", name: "BAKA TEAM" },
        to: [{ email: to }],
        subject: "Order Placed Successfully",
        htmlContent: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #FF7043;">Order Confirmed!</h2>
                <p>Hi ${name},</p>
                <p>Your order has been placed successfully. Please wait while its geting rready.</p>
                <div style="background: #fff3e0; padding: 15px; border-radius: 10px; margin: 20px 0;">
                    ${itemsHtml}
                </div>
                <h3>Total Amount: ₹${totalAmount}</h3>
                <br/>
                <p>Regards,<br/><b>BAKA TEAM</b></p>
            </div>
        `
    };

    await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "Content-Type": "application/json", "api-key": apiKey },
        body: JSON.stringify(payload)
    });
}

async function sendOrderReadyEmail(to, name, orderId, items) {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) return;

    let itemsHtml = items.map(item => `
         <div style="display: flex; align-items: center; border-bottom: 1px solid #eee; padding: 10px 0;">
            <img src="${item.itemsrc}" alt="${item.itemname}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover; margin-right: 15px;">
            <div>
                 <p style="margin: 0;">${item.quantity} x ${item.itemname}</p>
            </div>
        </div>
    `).join('');

    const payload = {
        sender: { email: "aanush748@gmail.com", name: "BAKA TEAM" },
        to: [{ email: to }],
        subject: "Your Order is Ready!",
        htmlContent: `
            <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                <h2 style="color: #4CAF50;">Order Ready for Pickup!</h2>
                <p>Hi ${name},</p>
                <p>Your order <strong>#${orderId.slice(-6).toUpperCase()}</strong> is ready.</p>
                <p>Please collect it from the counter.</p>
                 <div style="text-align: left; background: #f9f9f9; padding: 15px; border-radius: 10px; margin: 20px 0;">
                    ${itemsHtml}
                </div>
                <br/>
                <p>Regards,<br/><b>BAKA TEAM</b></p>
            </div>
        `
    };

    await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "Content-Type": "application/json", "api-key": apiKey },
        body: JSON.stringify(payload)
    });
}

module.exports = {
    sendOTPEmail,
    welcome,
    sendTopupAcceptedEmail,
    sendTopupRejectedEmail,
    sendOrderPlacedEmail,
    sendOrderReadyEmail
};
