class Log {
  currentGroup = null;
  currentImage = null;
  numberOfGroups = 0;
  groupIndex = 0;
  numberOfImages = 0;
  imageIndex = 0;

  setNumbersOfGroups(num) {
    this.numberOfGroups = num;
  }

  prepareNumber(num, max) {
    return ((num * 100) / max).toFixed(2);
  }

  setNumbersOfImages(num) {
    this.numberOfImages = num;
  }

  nextGroup(name, index) {
    this.currentGroup = name;
    this.groupIndex = index || this.groupIndex + 1;

    this.print();
  }

  nextImage(name, index) {
    this.currentImage = name;
    this.imageIndex = index || this.imageIndex + 1;

    this.print();
  }

  print() {
    console.clear();

    console.log("---------------------------------------------")
    console.log(
      "group progress",
      this.prepareNumber(this.groupIndex, this.numberOfGroups)
    );
    console.log(
      "image progress",
      this.prepareNumber(this.imageIndex, this.numberOfImages)
    );
    console.log("group: ", this.currentGroup);
    console.log("image: ", this.currentImage);
  }
}

exports.Log = Log;
