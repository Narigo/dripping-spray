describe("Spray", function() {
  var Spray = require("./spray");
  var splatterAmount = 33;
  var splatterRadius = 44;
  var dropThreshold = 5;
  var spraySize = 1;

  var canvas = {
    width: 1000,
    height: 1000
  };
  var spray = new Spray({
    size: spraySize,
    splatterAmount: splatterAmount,
    splatterRadius: splatterRadius,
    dropThreshold: dropThreshold,
    canvas: canvas
  });
  var DrawerMock;

  beforeEach(function() {
    DrawerMock = (function() {
      var circles = 0;
      var lines = 0;
      var maxLineSize = 0;
      var maxTop = 500;
      var maxLeft = 500;
      var maxRight = 500;
      var maxBottom = 500;
      return {
        drawShapes: function(shapes) {
          var i;
          if (shapes.shape === "circle") {
            circles += shapes.shapes.length;
            for (i = 0; i < shapes.shapes.length; i++) {
              maxTop = Math.min(maxTop, shapes.shapes[i].y);
              maxBottom = Math.min(maxBottom, shapes.shapes[i].y);
              maxLeft = Math.min(maxLeft, shapes.shapes[i].x);
              maxRight = Math.max(maxRight, shapes.shapes[i].x);
            }
          } else if (shapes.shape === "line") {
            lines += shapes.shapes.length;
            for (i = 0; i < shapes.shapes.length; i++) {
              maxLineSize = Math.max(maxLineSize, shapes.shapes[i].size);
            }
          }
        },
        amountOfCircles: function() {
          return circles;
        },
        amountOfLines: function() {
          return lines;
        },
        maxSizeOfLines: function() {
          return maxLineSize;
        },
        maxLeftCircle: function() {
          return maxLeft;
        },
        maxRightCircle: function() {
          return maxRight;
        },
        maxTopCircle: function() {
          return maxTop;
        },
        maxBottomCircle: function() {
          return maxBottom;
        }
      };
    })();
  });

  it("should draw the same amount of circles as put into options plus one (the one in the middle)", function() {
    spray.draw(DrawerMock, { x: 500, y: 500 });
    expect(DrawerMock.amountOfCircles()).toBe(splatterAmount + 1);
  });

  it("should always draw the amount of circles as put into options when we repeatedly spray", function() {
    var howOften = 5;
    var i;
    for (i = 0; i < howOften; i++) {
      spray.draw(DrawerMock, { x: 500, y: 500 });
    }

    expect(DrawerMock.amountOfCircles()).toBe((splatterAmount + 1) * howOften);
  });

  it("should start dropping when hitting the threshold and thus draw a line", function() {
    var mySpray = new Spray({
      size: spraySize,
      splatterAmount: 0,
      splatterRadius: 0,
      dropThreshold: dropThreshold,
      canvas: canvas
    });

    var i;
    for (i = 0; i < dropThreshold / spraySize + 1; i++) {
      mySpray.draw(DrawerMock, { x: 500, y: 500 });
    }
    expect(DrawerMock.amountOfLines()).toBe(1);
  });

  it("should not draw lines that are bigger than the drop threshold (the amount of spray needed to drop)", function() {
    var i;
    for (i = 0; i <= dropThreshold / spraySize; i++) {
      spray.draw(DrawerMock, { x: 500, y: 500 });
    }
    expect(DrawerMock.maxSizeOfLines() <= dropThreshold);
  });

  it("should draw multiple lines after hitting the drop threshold", function() {
    var i;
    for (i = 0; i <= dropThreshold / spraySize; i++) {
      spray.draw(DrawerMock, { x: 500, y: 500 });
    }
    expect(DrawerMock.amountOfLines() >= 1).toBeTruthy();
  });

  it("should draw without problems at the edge cases", function() {
    var i = 0;
    spray.draw(DrawerMock, { x: 0, y: 0 });
    i++;
    spray.draw(DrawerMock, { x: 0, y: 500 });
    i++;
    spray.draw(DrawerMock, { x: 0, y: 1000 });
    i++;
    spray.draw(DrawerMock, { x: 500, y: 1000 });
    i++;
    spray.draw(DrawerMock, { x: 500, y: 0 });
    i++;
    spray.draw(DrawerMock, { x: 1000, y: 0 });
    i++;
    spray.draw(DrawerMock, { x: 1000, y: 500 });
    i++;
    spray.draw(DrawerMock, { x: 1000, y: 1000 });
    i++;

    expect(DrawerMock.amountOfCircles()).toBe((splatterAmount + 1) * i);
  });

  it("should not draw circles outside the splatterRadius", function() {
    var howOften = 50;
    var i;
    for (i = 0; i < howOften; i++) {
      spray.draw(DrawerMock, { x: 500, y: 500 });
    }

    expect(DrawerMock.maxTopCircle()).toBeGreaterThan(500 - splatterRadius);
    expect(DrawerMock.maxLeftCircle()).toBeGreaterThan(500 - splatterRadius);
    expect(DrawerMock.maxRightCircle()).toBeLessThan(500 + splatterRadius);
    expect(DrawerMock.maxBottomCircle()).toBeLessThan(500 + splatterRadius);
  });
});
