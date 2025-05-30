export const itensDeNavegacao = [
  {
    titulo: "carrinho",
    url: "/",
  },
  {
    titulo: "suporte",
    url: "/",
  },
];

export const itensDeNavegacaoUser = [
  {
    titulo: "minhas compras",
    url: "/",
  },
  {
    titulo: "configurações",
    url: "/",
  },
  {
    titulo: "sair",
    url: "/",
  },
];
export const itensDeNavegacaoLoja = (id) => {
  return [
    {
      titulo: "Gerenciar Produtos",
      url: `/loja/${id}/produtos/gerenciar`,
    },
  ];
};

export const deleteIcon = `<svg width="20" height="20" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M333.333 400V566.667" stroke="currentColor" stroke-width="66.6667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M466.667 400V566.667" stroke="currentColor" stroke-width="66.6667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M133.333 233.333H666.667" stroke="currentColor" stroke-width="66.6667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M200 333.333V600C200 655.23 244.772 700 300 700H500C555.23 700 600 655.23 600 600V333.333" stroke="currentColor" stroke-width="66.6667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M300 166.667C300 129.848 329.848 100 366.667 100H433.333C470.153 100 500 129.848 500 166.667V233.333H300V166.667Z" stroke="currentColor" stroke-width="66.6667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
export const editIcon = `<svg width="20" height="20" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M709.33 213.335L391.33 531.333C359.663 563 265.662 577.667 244.662 556.667C223.662 535.667 237.996 441.667 269.662 410L587.997 91.6673C595.847 83.1027 605.35 76.218 615.937 71.428C626.52 66.638 637.967 64.0413 649.583 63.7967C661.197 63.5523 672.743 65.6637 683.52 70.004C694.297 74.3443 704.083 80.8243 712.287 89.051C720.49 97.2777 726.943 107.081 731.253 117.87C735.563 128.659 737.647 140.209 737.37 151.824C737.093 163.439 734.463 174.878 729.647 185.45C724.827 196.022 717.917 205.508 709.33 213.335Z" stroke="currentColor" stroke-width="50" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M366.667 133.333H200C164.638 133.333 130.726 147.381 105.721 172.386C80.7163 197.391 66.6666 231.304 66.6666 266.667V600C66.6666 635.363 80.7163 669.277 105.721 694.28C130.726 719.287 164.638 733.333 200 733.333H566.667C640.333 733.333 666.667 673.333 666.667 600V433.333" stroke="currentColor" stroke-width="50" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

export function arrow(side = "left") {
  const rotate = side == "left" ? "" : "rotate";
  return `<svg class="${rotate}" width="20" height="20" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M500 233.333L333.333 400L500 566.667" stroke="currentColor" stroke-width="50" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
}
export function doubleArrow(side = "left") {
  const rotate = side == "left" ? "" : "rotate";
  return `<svg class="${rotate}" width="20" height="20" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M633.333 633.333L423.57 423.57C410.553 410.553 410.553 389.447 423.57 376.43L633.333 166.667" stroke="currentColor" stroke-width="66.6667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M366.667 633.333L156.904 423.57C143.886 410.553 143.886 389.447 156.904 376.43L366.667 166.667" stroke="currentColor" stroke-width="66.6667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

`;
}

export const cartIcon = `<svg width="27" height="27" viewBox="0 0 668 668" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M143.992 100.667H634L567.333 334H179.89M600.667 467.333H200.667L134 34H34M234 600.667C234 619.077 219.076 634 200.667 634C182.257 634 167.333 619.077 167.333 600.667C167.333 582.257 182.257 567.333 200.667 567.333C219.076 567.333 234 582.257 234 600.667ZM600.667 600.667C600.667 619.077 585.743 634 567.333 634C548.923 634 534 619.077 534 600.667C534 582.257 548.923 567.333 567.333 567.333C585.743 567.333 600.667 582.257 600.667 600.667Z" stroke="currentColor" stroke-width="66.6667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

export const lupaIcon = `<svg width="20" height="20" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M500 500L700 700" stroke="currentColor" stroke-width="66.6667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M566.667 333.333C566.667 462.2 462.2 566.667 333.333 566.667C204.467 566.667 100 462.2 100 333.333C100 204.467 204.467 100 333.333 100C462.2 100 566.667 204.467 566.667 333.333Z" stroke="CurrentColor" stroke-width="66.6667"/>
</svg>
`;

export const urlBase = "https://light-labrador-composed.ngrok-free.app/";
