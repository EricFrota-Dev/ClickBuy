class userData {
  constructor() {
    this.data = this.getUser();
  }
  setUser(data) {
    localStorage.setItem("user", JSON.stringify(data));
    this.data = data;
  }
  clear() {
    localStorage.removeItem("user");
    this.data = null;
  }
  getUser() {
    const data = localStorage.getItem("user") || null;
    this.data = JSON.parse(data);
    return this.data;
  }
}
export const user = new userData();
