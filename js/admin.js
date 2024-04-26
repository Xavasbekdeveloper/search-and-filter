const logOut = document.querySelector(".log-out");
let isLogin = localStorage.getItem("x-auth-token")

function checkUser() {
    if (!isLogin) {
        window.location.replace("../index.html");
    }
}

checkUser()


logOut.addEventListener("click", () => {
    localStorage.removeItem("x-auth-token");

    window.open("../index.html", "_self")
})