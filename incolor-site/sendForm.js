const BOT_TOKEN = "8124303621:AAHXIkPoPOAVXaY1HxqwpbJspMAzEMv8pBI";
const CHAT_ID = "651384326"; // ⚠️ Тут встав саме chat_id, не посилання!

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contactForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);

    const message = `
📩 *Нова заявка з сайту InColor:*
👤 Ім’я: ${data.get("name")}
📧 Email: ${data.get("email")}
📞 Телефон: ${data.get("phone")}
💬 Повідомлення: ${data.get("message")}
`;


    try {
      // 📤 Надсилаємо в Telegram
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "Markdown"
        })
      });

      // 📩 Надсилаємо у Formspree
      await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      });

      alert("✅ Заявку надіслано! Ми скоро з вами зв’яжемось 💬");
      form.reset();
    } catch (error) {
      console.error("Помилка відправки:", error);
      alert("⚠️ Сталася помилка. Спробуйте ще раз!");
    }
  });
});
