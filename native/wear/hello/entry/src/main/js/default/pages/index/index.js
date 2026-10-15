export default {
  data: {
    title: 'Hello',
    count: 0
  },
  onTap() {
    this.count++;
    this.title = 'Tapped ' + this.count;
  }
};
