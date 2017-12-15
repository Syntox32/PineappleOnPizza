
//import { FallingThingPool } from 'pool';

/*
 *
 */
class FallingEatableThing {
  constructor(texture) {
    this.sprite = new PIXI.Sprite(texture);
    this.acceleration = new PIXI.Point(0, 0);
    this.velocity = new PIXI.Point(0, 0);
    this.falling = false;
  }
}


class FallingThingPool {
  constructor(type, count, texture) {
    this.count = count;
    this.thingType = type;
    this.things = []
    this.container = new PIXI.Container();

    // create all the new things
    let thing;
    for (var i = 0; i < count; i++) {
      if (this.thingType === 'pizza') {
        thing = new FallingEatableThing(texture);
      } else if (this.thingType === 'pineapple') {
        thing = new FallingEatableThing(texture);
      } else {
        console.log("error: unknown FallingThingPool type");
      }

      thing.sprite.anchor.set(0.5);
      thing.sprite.x = -thing.sprite.width - 50; //app.renderer.width / 2 + count * i;
      thing.sprite.y = -thing.sprite.height - 50; //app.renderer.height / 2 + count * i;
      thing.sprite.scale.x = 0.3;
      thing.sprite.scale.y = 0.3;

      thing.sprite.alpha = 1.0;
      this.things.push(thing);
      this.container.addChild(thing.sprite);
    }
  }

  canSpawn() {
    for (var i = 0; i < this.things.length; i++) {
      if (!this.things[i].falling) {
        return true;
      }
    }
    return false;
  }

  spawn() {
    let thing = null;
    for (var i = 0; i < this.things.length; i++) {
      if (!this.things[i].falling) {
        thing = this.things[i];
        break;
      }
    }
    if (thing === null) {
      console.log("could not find any literal thing to use for falling");
      return;
    }

    // get a random spawnpoint
    const xPos = Math.random() * app.renderer.width;
    const yPos = -thing.sprite.height;

    // reset values
    thing.falling = true;
    thing.sprite.x = xPos;
    thing.sprite.y = 0; //yPos;
    thing.acceleration.x = 0;
    thing.acceleration.y = 0.8; //9.82;
    thing.velocity.x = 0;
    thing.velocity.y = 0;

    //console.log("spawned new thing");
  }

  makeThingsFall(delta) {
    let thing = null;
    for (var i = 0; i < this.things.length; i++) {
      thing = this.things[i];
      if (thing.falling && thing.sprite.y >= (app.renderer.height + thing.sprite.height)) {
        thing.falling = false;
        break;
      }

      // if it is falling lets make it fall some more
      if (thing.falling) {
        thing.velocity.y += thing.acceleration.y * delta;
        if (thing.velocity.y >= 50) {
          thing.velocity.y = 50;
        }
        thing.sprite.y += thing.velocity.y;
      }
    }
  }
}


function mobileAndTabletcheck() {
  // https://stackoverflow.com/a/11381730
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}


function makeid(length) {
  // https://stackoverflow.com/a/1349426
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

class Upgrade {
  // pineapples per second
  constructor(pps, texture, name, price) {
    this.pps = pps;
    this.name = name;
    this.price = price;
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.interactive = true;
    this.sprite.buttonMode = true;
  }
}

class Game {
  constructor() {
    this.totalTime = 0;
    this.timeSince = 0;
    this.cooldown = 1000; // ms
    this.incrementUpgradeCooldown = 1000; // ms
    this.timeSinceUpgradeCooldown = 0;

    this.pineappleCooldownStandard = 1500;
    this.pineappleCooldown = 1500; // ms
    this.pineappleTimeSince = 0;

    this.background = null;
    this.backgroundArea = null;
    this.container = null;
    this.pool = null;
    this.pineapplePool = null;
    this.pineappleCount = 0;
    this.currentPPS = 0;

    this.canvasWrapper = null;
    this.app = null;

    this.upgrades = []

     //window.innerHeight);
    // Scale mode for all textures, will retain pixelation
    //PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    this.textStyle = new PIXI.TextStyle({
      fontFamily: 'Open Sans',
      fontSize: 36,
      //fontStyle: 'italic',
      fontWeight: 'bold',
      fill: '#ffffff',  //['#ffffff', '#00ff99'], // gradient
      stroke: '#111111',
      strokeThickness: 6,
      //dropShadow: true,
      //dropShadowColor: '#000000',
      //dropShadowBlur: 4,
      //dropShadowAngle: Math.PI / 6,
      //dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440
    });

    this.texturePizza = PIXI.Texture.fromImage("static/img/pizza.png");
    this.texturePineapple = PIXI.Texture.fromImage("static/img/pineapple.png");
  }
  setProgressText() {
    this.richText.text = this.pineappleCount.toString() + " (+" + this.currentPPS.toString() + ")";
    this.richText.x = (this.app.renderer.width / 2) - (this.richText.width / 2);
  }

  updateProgress() {
    Cookies.set("progress", this.pineappleCount);
    this.setProgressText();
  }

  loadProgress() {
    let count = parseInt(Cookies.get("progress"));
    this.pineappleCount = count;
    this.setProgressText();
  }

  upgrade() {
    let upgrade = new Upgrade(10, null, 'basic', 100);
    if (this.pineappleCount >= upgrade.price) {
      this.upgrades.push(upgrade);
      this.pineappleCount -= upgrade.price;
    }
    console.log("adding upgrade...");
    this.updateProgress();
  }

  incrementUpgrades() {
    let sum = 0;
    for (let i = 0; i < this.upgrades.length; i++) {
      sum += this.upgrades[i].pps;
    }
    this.currentPPS = sum;
    this.pineappleCount += this.currentPPS;
    this.updateProgress();
  }

  increment() {
    this.pineapplePool.spawn(this.app.renderer.width);
    this.pineappleCount++;
    this.updateProgress();
  }

  onBackgroundClick() {
    this.increment();
  }

  initBackground() {
    // add a clickable area equal to the screen size
    this.backgroundArea = new PIXI.RenderTexture.create(this.app.renderer.width, this.app.renderer.height);
    this.background = new PIXI.Sprite(this.backgroundArea);

    this.background.position.x = 0;
    this.background.position.y = 0;
    this.background.interactive = true;
    this.background.buttonMode = true;
    this.background.width = this.app.renderer.width;
    this.background.height = this.app.renderer.height;
    //this.background.on("pointerdown", this.onBackgroundClick);

    // dirty stuff to subscribe to the click event
    // i <3 javascript <3333 /s
    var self = this;
    function wrapper() { self.onBackgroundClick(); }
    this.background.on("pointerdown", function() { wrapper(); });

    this.app.stage.addChild(this.background);
  }

  init() {
    this.canvasWrapper = document.getElementById("canvas-wrapper");
    this.app = new PIXI.Application(this.canvasWrapper.offsetWidth, 450, {
      backgroundColor : 0x1099bb}
    );

    this.initBackground();

    //document.body.appendChild(app.view);
    this.canvasWrapper.appendChild(this.app.view);

    // ppiiizzaaassss
    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);

    this.pool = new FallingThingPool('pizza', 10, this.texturePizza);
    this.pineapplePool = new FallingThingPool('pineapple', 100, this.texturePineapple);
    // render all the things
    this.app.stage.addChild(this.pool.container);
    this.app.stage.addChild(this.pineapplePool.container);

    this.pineappleCount = 0;
    this.richText = new PIXI.Text(this.pineappleCount.toString(), this.textStyle);
    this.richText.x = (this.app.renderer.width / 2) - (this.richText.width / 2);
    this.richText.y = 20;
    this.app.stage.addChild(this.richText);
    this.updateProgress();

    this.loadProgress();
  }

  updatePizzas(delta) {
    this.pool.makeThingsFall(delta, this.app.renderer.height);
    this.pineapplePool.makeThingsFall(delta, this.app.renderer.height);
  }

  resizeApp() {
    // http://www.html5gamedevs.com/topic/14895-dynamically-resizing-pixi-stage-on-window-resize/
    let w = this.canvasWrapper.offsetWidth //window.innerWidth;
    //var h = //window.innerHeight;
    //this part resizes the canvas but keeps ratio the same
    this.app.renderer.view.style.width = w + "px";

    let title = document.getElementById("main-title");
    let swipe = document.getElementById("swipe");
    console.log(title.offsetHeight);
    console.log(swipe.offsetHeight);
    //app.renderer.view.style.height = h + "px";
    //this part adjusts the ratio:
    let height = this.app.renderer.height;
    if (mobileAndTabletcheck()) {
      height = window.innerHeight - title.offsetHeight - swipe.offsetHeight * 2;
    }

    this.app.renderer.resize(w, height);
  }

  tick(delta) {
    this.totalTime += this.app.ticker.elapsedMS;
    //pizza.rotation += 0.1 * delta;
    this.updatePizzas(delta);
    //console.log(this.timeSince);

    if (this.currentPPS > 0) {
      this.pineappleTimeSince += this.app.ticker.elapsedMS;
      if (this.pineappleTimeSince >= this.pineappleCooldown) {
        if (this.pineapplePool.canSpawn()) {
          this.pineapplePool.spawn(this.app.renderer.width);
        }
        this.pineappleTimeSince = 0;
        this.pineappleCooldown = this.pineappleCooldownStandard / (Math.log10(this.currentPPS) * 5);
      }
    }

    this.timeSinceUpgradeCooldown += this.app.ticker.elapsedMS;
    if (this.timeSinceUpgradeCooldown >= this.incrementUpgradeCooldown) {
      this.incrementUpgrades();
      console.log("incrementing upgrades...");
      this.timeSinceUpgradeCooldown = 0;
    }

    this.timeSince += this.app.ticker.elapsedMS;
    if (this.timeSince >= this.cooldown) {
      this.cooldown = 700 + Math.random() * 400;
      this.timeSince = 0;

      if (this.pool.canSpawn()) {
        this.pool.spawn(this.app.renderer.width);
      }
    }
  }

  run() {
    // Listen for animate update
    var self = this;
    this.app.ticker.add(function(delta) {
      self.tick(delta);
    });
    //var self = this;
    //this.app.ticker.add(function(delta) {
  }

}

let game = new Game();
game.init();

window.onresize = function(event) {
  game.resizeApp();
}

document.addEventListener('keyup', onKeyUp);
function onKeyUp(key) {
  if (key.keyCode === 80) {
    game.upgrade();
  }
}

game.run();
