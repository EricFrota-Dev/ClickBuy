alert("deu bom");
// const signupForm = document.querySelector(".signup-form");
// signupForm.addEventListener("submit", handleSubmit);
const loginForm = document.querySelector(".login-form");
loginForm.addEventListener("submit", handleSubmit);
async function handleSubmit(e) {
  e.preventDefault();

  const response = await fetch("http://127.0.0.1:5000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: document.querySelector("#email").value,
      senha: document.querySelector("#senha").value,
    }),
  });
  const data = await response.json();
  alert(data.msg);
}
