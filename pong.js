// Create a Vector class
class Vector {
    constructor(value) {
      this.value = value;
    }
  
    // Add a bounce method
    bounce() {
      this.value = -this.value;
    }
  }
  
  // Create a Ball object
  const ball = {
    x: /* initial x position */,
    y: /* initial y position */,
    vectorX: new Vector(/* initial X velocity */),
    vectorY: new Vector(/* initial Y velocity */),
    // Other ball-related properties and methods
  };
  
  // Create a Bat object
  const bat = {
    x: /* initial x position */,
    y: /* initial y position */,
    width: /* bat width */,
    height: /* bat height */,
    vectorX: new Vector(/* initial X velocity */),
    vectorY: new Vector(/* initial Y velocity */),
    // Other bat-related properties and methods
  };
  
  // Example usage of the bounce method on ball's vectorX
  ball.vectorX.bounce();
  
  // Example usage of the bounce method on bat's vectorY
  bat.vectorY.bounce();