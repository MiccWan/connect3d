import { WebGLRenderer, Scene, PerspectiveCamera, Raycaster, AmbientLight, DirectionalLight, BoxGeometry, MeshLambertMaterial, Mesh, Vector2, Material } from 'three';
import PieceType from 'knect-common/src/games/PieceType';
import Game from './Game.js';
import RoleType from '../../../server/src/game/games/RoleType.js';

const Materials = {
  Invis: new MeshLambertMaterial({ opacity: 0, transparent: true }),
  Blue: new MeshLambertMaterial({ color: 0x0000ff }),
  Red: new MeshLambertMaterial({ color: 0xff0000 }),
  Gray: new MeshLambertMaterial({ color: 0x222222 }),
  TransGray: new MeshLambertMaterial({ color: 0x555555, opacity: 0.3, transparent: true }),
  TransBlue: new MeshLambertMaterial({ color: 0x0000ff, opacity: 0.6, transparent: true }),
  TransRed: new MeshLambertMaterial({ color: 0xff0000, opacity: 0.6, transparent: true }),
  BlinkBlue: new MeshLambertMaterial({ color: 0x0000ff, opacity: 0, transparent: true }),
  BlinkRed: new MeshLambertMaterial({ color: 0xff0000, opacity: 0, transparent: true }),
};

const Geometries = {
  Platform: new BoxGeometry(5, 0.1, 5),
  SmallBox: new BoxGeometry(0.5, 0.5, 0.5),
  BigBox: new BoxGeometry(0.7, 0.7, 0.7),
};

export default class Bingo extends Game {
  constructor(el) {
    super('3DBingo', el);

    this.role = RoleType.None;
    this.turn = RoleType.None;
    this.lastPiece = null;
    this.board = [];

    // Scene setup
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(70, 1.2, 1, 1000);
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(el.clientWidth, el.clientHeight);
    this.renderer.setClearColor(0xbbbbbb);

    // raycaster (mouse event) setup
    this.raycaster = new Raycaster();
    this.mouse = new Vector2();
    this.intersected = null;

    // set up light
    const ambientLight = new AmbientLight(0x888888, 0.3);
    this.scene.add(ambientLight);
    const directionalLight = new DirectionalLight(0xcccccc);
    directionalLight.position.set(1, 2, 3).normalize();
    this.scene.add(directionalLight);

    el.appendChild(this.renderer.domElement);
  }

  setup() {
    // platform
    const platform = new Mesh(Geometries.Platform, Materials.Gray);
    platform.position.x = 2.5;
    platform.position.z = 2.5;
    this.scene.add(platform);

    // set up cubes
    this.pieces = [];
    for (let x = 0; x < 4; ++x) {
      for (let y = 0; y < 4; ++y) {
        for (let z = 0; z < 4; ++z) {
          const piece = new Mesh(Geometries.SmallBox, Materials.Invis);
          piece.status = PieceType.Empty;
          piece.position.x = x - 1.5;
          piece.position.y = y + 0.4;
          piece.position.z = z - 1.5;
          piece.onClick = () => {
            this.onPieceClick(x, y, z);
          };
          piece.onMouseHover = () => {
            if (PieceType.is.Empty(piece.status)) {
              if (RoleType.is.PlayerA(this.role)) piece.material = Materials.TransBlue;
              if (RoleType.is.PlayerB(this.role)) piece.material = Materials.TransRed;
            }
          };
          piece.onMouseLeave = () => {
            if (PieceType.is.Empty(piece.status)) {
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
      [new Mesh(Geometries.SmallBox, Materials.Blue), new Mesh(Geometries.SmallBox, Materials.Blue)],
      [new Mesh(Geometries.SmallBox, Materials.Red), new Mesh(Geometries.SmallBox, Materials.Red)]
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

  onClick() {
    this.intersected?.onClick?.();
  }

  render() {
    requestAnimationFrame(this.render.bind(this));

    // set raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersections = this.raycaster.intersectObjects(this.scene.children);

    if (intersections.length) {
      if (intersections[0] !== this.intersected) {
        // intersection changed
        const oldIntersected = this.intersected;
        this.intersected = intersections[0].object;
        oldIntersected.onMouseLeave?.();
        this.intersected.onMouseHover?.();
      }
    }
    else {
      const oldIntersected = this.intersected;
      this.intersected = null;
      oldIntersected.onMouseLeave?.();
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
    Materials.BlinkBlue.opacity = opacity;
    Materials.BlinkRed.opacity = opacity;
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
    if (RoleType.is.PlayerA(this.turn)) this.renderer.setClearColor(0xbbbbdd);
    if (RoleType.is.PlayerB(this.turn)) this.renderer.setClearColor(0xddbbbb);
  }

  refreshPiecesMaterial() {
    for (let x = 0; x < 4; ++x) {
      for (let y = 0; y < 4; ++y) {
        for (let z = 0; z < 4; ++z) {
          const piece = this.getPiece(x, y, z);
          const status = this.getBoard(x, y, z);
          piece.visible = true;
          if (PieceType.is.PlayerA(status)) piece.material = Materials.Blue;
          if (PieceType.is.PlayerB(status)) piece.material = Materials.Red;
          if (PieceType.is.Empty(status)) {
            piece.material = Material.TransGray;
            if (y !== 0 && PieceType.is.Empty(this.getPiece(x, y - 1, z).status)) {
              piece.visible = false;
            }
          }
        }
      }
    }

    if (this.lastPiece) {
      const piece = this.pieces[this.lastPiece];
      const status = this.board[this.lastPiece];

      if (PieceType.is.PlayerA(status)) piece.material = Materials.BlinkBlue;
      if (PieceType.is.PlayerB(status)) piece.material = Materials.BlinkRed;
    }
  }
}