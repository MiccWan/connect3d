import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Raycaster,
  AmbientLight,
  DirectionalLight,
  BoxGeometry,
  MeshLambertMaterial,
  Mesh,
  Vector2,
  Vector3
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import PieceType from 'knect-common/src/games/PieceType.js';
import RoleType from 'knect-common/src/RoleType';
// import newLogger from 'knect-common/src/Logger.js';
import { ClientEvents } from 'knect-common/src/BingoEvents';
import GameResultType, { isGameEnd } from 'knect-common/src/GameResultType.js';
import Game from './Game.js';

// const log = newLogger('Bingo');

const Materials = {
  Invis: new MeshLambertMaterial({ opacity: 0, transparent: true }),
  Red: new MeshLambertMaterial({ color: '#F4997B' }),
  Green: new MeshLambertMaterial({ color: '#A4C77F' }),
  Gray: new MeshLambertMaterial({ color: '#222222' }),
  TransGray: new MeshLambertMaterial({ color: '#999999', opacity: 0.45, transparent: true }),
  TransRed: new MeshLambertMaterial({ color: '#F4997B', opacity: 0.8, transparent: true }),
  TransGreen: new MeshLambertMaterial({ color: '#A4C77F', opacity: 0.8, transparent: true }),
  BlinkRed: new MeshLambertMaterial({ color: '#F4997B', opacity: 0, transparent: true }),
  BlinkGreen: new MeshLambertMaterial({ color: '#A4C77F', opacity: 0, transparent: true }),
};

const Geometries = {
  Platform: new BoxGeometry(5, 0.1, 5),
  SmallBox: new BoxGeometry(0.5, 0.5, 0.5),
  BigBox: new BoxGeometry(0.7, 0.7, 0.7),
};

export default class Bingo extends Game {
  constructor(socket, elRef) {
    super('3DBingo', socket, elRef);

    this.role = RoleType.None;
    this.turn = RoleType.None;
    this.lastPiece = null;
    this.result = GameResultType.NotOverYet;
    this.board = Array.from({ length: 64 }, () => PieceType.Empty);
    this.t = 0;

    this.renderFlag = false;

    this.setup();

    this.el.appendChild(this.renderer.domElement);
  }

  get el() {
    return this.elRef.current;
  }

  get end() {
    return isGameEnd(this.result);
  }

  setup() {
    // scene
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(70, this.el.clientWidth / this.el.clientHeight, 1, 1000);
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(this.el.clientWidth, this.el.clientHeight);
    this.renderer.setClearColor('#EADAC2');
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(5, 5, 5);
    this.controls.target = new Vector3(0, 1, 0);
    this.controls.update();

    // raycaster (mouse event)
    this.raycaster = new Raycaster();
    this.mouse = new Vector2();
    this.intersected = null;

    // light
    const ambientLight = new AmbientLight('#FFFFFF', 0.5);
    this.scene.add(ambientLight);
    const directionalLight = new DirectionalLight('#FFFFFF', 0.5);
    directionalLight.position.set(1, 2, 3).normalize();
    this.scene.add(directionalLight);

    // platform
    const platform = new Mesh(Geometries.Platform, Materials.Gray);
    this.scene.add(platform);

    // cubes
    this.pieces = [];
    for (let x = 0; x < 4; ++x) {
      for (let y = 0; y < 4; ++y) {
        for (let z = 0; z < 4; ++z) {
          const piece = new Mesh(Geometries.SmallBox, Materials.Invis);
          piece.position.x = x - 1.5;
          piece.position.y = y + 0.4;
          piece.position.z = z - 1.5;
          piece.onClick = () => {
            if (this.turn === this.role) {
              this.onPieceClick(x, y, z);
            }
          };
          piece.onMouseHover = () => {
            if (PieceType.is.Empty(this.getBoard(x, y, z))) {
              if (RoleType.is.PlayerA(this.role)) piece.material = Materials.TransRed;
              if (RoleType.is.PlayerB(this.role)) piece.material = Materials.TransGreen;
            }
          };
          piece.onMouseLeave = () => {
            if (PieceType.is.Empty(this.getBoard(x, y, z))) {
              piece.material = Materials.TransGray;
            }
          };
          this.pieces[16 * x + 4 * y + z] = piece;
          this.scene.add(piece);
        }
      }
    }

    // icons
    this.icons = [
      [new Mesh(Geometries.SmallBox, Materials.Red), new Mesh(Geometries.SmallBox, Materials.Red)],
      [new Mesh(Geometries.SmallBox, Materials.Green), new Mesh(Geometries.SmallBox, Materials.Green)]
    ];
    this.icons[0][0].position.x = -3;
    this.icons[0][0].position.z = -3;
    this.icons[0][1].position.x = 3;
    this.icons[0][1].position.z = 3;
    this.icons[1][0].position.x = -3;
    this.icons[1][0].position.z = 3;
    this.icons[1][1].position.x = 3;
    this.icons[1][1].position.z = -3;
    this.scene.add(this.icons[0][0]);
    this.scene.add(this.icons[0][1]);
    this.scene.add(this.icons[1][0]);
    this.scene.add(this.icons[1][1]);

    this.el.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    this.el.addEventListener('resize', this.onResize.bind(this), false);
    this.el.addEventListener('click', this.onClick.bind(this), false);

    this.refreshPiecesMaterial();
  }

  onDidMount() {
    this.renderFlag = true;
    this.render();
  }

  onWillUnmount() {
    this.renderFlag = false;
  }

  onResize() {
    this.renderer.setSize(this.el.innerWidth, this.el.innerHeight);
  }

  onMouseMove(e) {
    e.preventDefault();
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.mouse.x = (x / this.el.clientWidth) * 2 - 1;
    this.mouse.y = -(y / this.el.clientHeight) * 2 + 1;
  }

  onPieceClick(x, y, z) {
    this.socket.emit(ClientEvents.Place, { x, y, z });
  }

  onClick() {
    this.intersected?.onClick?.();
  }

  render() {
    if (!this.renderFlag) {
      return;
    }

    requestAnimationFrame(this.render.bind(this));

    this.controls.update();

    // set raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersections = this.raycaster.intersectObjects(this.scene.children);
    let newIntersection;
    for (const intersection of intersections) {
      if (intersection.object.visible) {
        newIntersection = intersection.object;
        break;
      }
    }

    if (newIntersection) {
      if (newIntersection !== this.intersected) {
        // intersection changed
        const oldIntersected = this.intersected;
        this.intersected = newIntersection;
        oldIntersected?.onMouseLeave?.();
        this.intersected.onMouseHover?.();
      }
    }
    else {
      const oldIntersected = this.intersected;
      this.intersected = null;
      if (oldIntersected) {
        oldIntersected.onMouseLeave?.();
      }
    }

    // rotate icons
    if (RoleType.is.PlayerA(this.turn)) {
      this.icons[0][0].rotation.y = this.t;
      this.icons[0][1].rotation.y = this.t;
    }
    if (RoleType.is.PlayerB(this.turn)) {
      this.icons[1][0].rotation.y = this.t;
      this.icons[1][1].rotation.y = this.t;
    }
    else if (RoleType.is.None(this.turn)) {
      this.icons[0][0].rotation.y = this.t;
      this.icons[0][1].rotation.y = this.t;
      this.icons[1][0].rotation.y = this.t;
      this.icons[1][1].rotation.y = this.t;
    }
    this.t += 0.05;
    const opacity = Math.sin(this.t) / 4 + 0.75;
    Materials.BlinkRed.opacity = opacity;
    Materials.BlinkGreen.opacity = opacity;
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * @return {Mesh}
   */
  getPiece(x, y, z) {
    return this.pieces[16 * x + 4 * y + z];
  }

  getBoard(x, y, z) {
    return this.board[16 * x + 4 * y + z];
  }

  /**
   * @param {Array<number>} state
   */
  setState(state) {
    Object.assign(this, state);
    this.refreshPiecesMaterial();
    if (RoleType.is.PlayerA(this.role)) this.renderer.setClearColor('#F0D0B2');
    if (RoleType.is.PlayerB(this.role)) this.renderer.setClearColor('#E3D8B3');
  }

  refreshPiecesMaterial() {
    for (let x = 0; x < 4; ++x) {
      for (let y = 0; y < 4; ++y) {
        for (let z = 0; z < 4; ++z) {
          const piece = this.getPiece(x, y, z);
          const status = this.getBoard(x, y, z);
          piece.visible = true;
          if (PieceType.is.PlayerA(status)) piece.material = Materials.Red;
          if (PieceType.is.PlayerB(status)) piece.material = Materials.Green;
          if (PieceType.is.Empty(status)) {
            piece.material = Materials.TransGray;
            if (this.end || (y !== 0 && PieceType.is.Empty(this.getBoard(x, y - 1, z)))) {
              piece.visible = false;
            }
          }
        }
      }
    }

    if (!this.end && this.lastPiece) {
      const { x, y, z } = this.lastPiece;
      const piece = this.getPiece(x, y, z);
      const status = this.getBoard(x, y, z);

      if (PieceType.is.PlayerA(status)) piece.material = Materials.BlinkRed;
      if (PieceType.is.PlayerB(status)) piece.material = Materials.BlinkGreen;
    }

    this.refreshIcons();
  }

  refreshIcons() {
    if (this.result === GameResultType.PlayerAWins) {
      this.icons[0][0].material = Materials.Red;
      this.icons[0][1].material = Materials.Red;
      this.icons[1][0].material = Materials.Red;
      this.icons[1][1].material = Materials.Red;
      this.icons[0][0].geometry = Geometries.BigBox;
      this.icons[0][1].geometry = Geometries.BigBox;
      this.icons[1][0].geometry = Geometries.BigBox;
      this.icons[1][1].geometry = Geometries.BigBox;
    }
    else if (this.result === GameResultType.PlayerBWins) {
      this.icons[0][0].material = Materials.Green;
      this.icons[0][1].material = Materials.Green;
      this.icons[1][0].material = Materials.Green;
      this.icons[1][1].material = Materials.Green;
      this.icons[0][0].geometry = Geometries.BigBox;
      this.icons[0][1].geometry = Geometries.BigBox;
      this.icons[1][0].geometry = Geometries.BigBox;
      this.icons[1][1].geometry = Geometries.BigBox;
    }
    else {
      this.icons[0][0].material = Materials.Red;
      this.icons[0][1].material = Materials.Red;
      this.icons[1][0].material = Materials.Green;
      this.icons[1][1].material = Materials.Green;
      this.icons[0][0].geometry = Geometries.SmallBox;
      this.icons[0][1].geometry = Geometries.SmallBox;
      this.icons[1][0].geometry = Geometries.SmallBox;
      this.icons[1][1].geometry = Geometries.SmallBox;
    }
  }

  // handleGameEnd() {
  //   // TODO: update rendering by this.result (game result type)
  // }
}
