class Storage {
  constructor() {}
  set(key, value) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
  get(key) {
    if (typeof localStorage !== 'undefined') {
      return JSON.parse(localStorage.getItem(key));
    }
    return '';
  }
  remove(key) {
    if (typeof localStorage !== 'undefined') {
      return localStorage.removeItem(key);
    }
  }
}

const storage = new Storage();
export default storage;
