export class Theme {
  constructor(themeButton) {
    this.temaAtual = localStorage.getItem("theme") || "light";
    this.body = document.body;
    this.themeButton = themeButton;
  }
  darkIcon = `<svg width="23" height="30" viewBox="0 0 156 203" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M155.939 185.316C89.264 133.361 104.266 51.3529 155.911 17.3751C85.5434 -29.1711 0.729123 24.3591 0.00469565 100.361C-0.733798 177.298 85.7825 231.123 155.939 185.323V185.316Z"
            fill="currentColor"
          />
        </svg>`;
  lightIcon = `<svg width="30" height="30" viewBox="0 0 251 252" fill="white" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_8_5)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M116.166 76.4631C50.9548 89.4005 69.6719 187.406 134.738 175.273C159.069 170.736 180.916 146.818 174.937 116.041C170.312 92.2315 146.231 70.4995 116.166 76.4631Z" fill="currentColor"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M39.7632 132.415C42.0184 126.488 42.0184 125.176 39.7903 119.222C32.4277 116.749 26.9977 117.497 17.802 117.443C9.54995 117.395 0.538146 116.216 0.0286123 125.216C-0.517101 134.803 8.18717 134.267 16.4513 134.206C25.3425 134.14 32.6116 135.105 39.7632 132.412V132.415Z" fill="currentColor"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M132.076 250.015C132.173 248.146 133.994 245.456 133.994 239.83C134.084 225.618 135.028 226.013 132.827 212.496C125.413 207.893 117.239 209.071 117.239 221.165C117.239 242.927 114.11 255.201 132.076 250.015Z" fill="currentColor"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M57.6722 183.311C53.421 184.867 42.8656 196.484 39.332 200.02C30.9895 208.372 33.9834 220.332 45.1298 216.636C45.1328 216.636 70.905 197.446 68.2035 188.307C66.9372 184.023 61.9716 181.738 57.6752 183.311H57.6722Z" fill="currentColor"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M215.314 118.145C206.613 121.908 208.253 132.961 217.934 134.134C222.128 134.643 243.115 134.668 246.151 133.386C252.513 130.703 253.077 118.794 243.034 117.515C238.65 116.957 218.154 116.912 215.311 118.142L215.314 118.145Z" fill="currentColor"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M188.215 183.221C174.407 187.74 188.101 200.283 191.408 203.575C195.291 207.44 203.64 219.295 211.747 216.582C215.603 215.291 218.208 211.324 216.11 205.833C216.11 205.83 196.543 180.498 188.212 183.224L188.215 183.221Z" fill="currentColor"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M205.093 35.9537C197.933 39.8672 193.109 46.2349 187.332 51.9995C176.819 62.4917 186.249 72.5527 194.857 67.6443C197.384 66.2062 208.654 54.1583 211.771 51.1131C222.23 40.8953 214.084 31.0423 205.096 35.9537H205.093Z" fill="currentColor"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M117.239 11.8338C117.239 28.7931 113.923 46.066 131.799 40.3556C135.16 32.6071 133.994 21.9642 133.994 11.8338C133.994 -3.25619 117.239 -4.61595 117.239 11.8338Z" fill="currentColor"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M38.7863 36.4361C38.7863 36.4361 30.9624 39.0773 35.5964 47.2479C35.6085 47.269 55.3084 72.8753 64.3625 67.8011C75.3973 61.6143 61.9384 50.7543 58.4169 47.2358C54.413 43.238 46.1278 30.6896 38.7863 36.4392V36.4361Z" fill="currentColor"/>
          </g>
          <defs>
            <clipPath id="clip0_8_5">
            <rect width="250.784" height="251.2" fill="white"/>
            </clipPath>
          </defs>
      </svg>`;

  themeConfig() {
    console.log("Aplicando tema:", this.temaAtual);
    this.body.classList.remove("dark", "light"); // Remove ambos antes de adicionar o atual
    this.body.classList.add(this.temaAtual);

    // Atualiza o SVG do botão
    this.themeButton.innerHTML =
      this.temaAtual === "dark" ? this.lightIcon : this.darkIcon;
  }

  toggleTheme() {
    this.temaAtual = this.body.classList.contains("dark") ? "light" : "dark";
    localStorage.setItem("theme", this.temaAtual);
    this.themeConfig();
  }

  init() {
    this.themeConfig();
    this.themeButton.addEventListener("click", () => this.toggleTheme());
  }
}
