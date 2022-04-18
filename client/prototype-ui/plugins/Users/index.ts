import { Users, GameState } from "../../../../api/types";
import { HathoraConnection } from "../../../.hathora/client";

export default class UsersPlugin extends HTMLElement {
  val!: Users;
  state!: GameState;
  client!: HathoraConnection;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // create 800x600 canvas with a black border
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    canvas.style.border = "1px solid black";
    this.shadowRoot!.append(canvas);
    const ctx = canvas.getContext("2d")!;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // draw each player as a black circle with a radius of 15
      ctx.strokeStyle = "black";
      this.state.users.forEach((user) => {
        ctx.beginPath();
        ctx.arc(20, user.yPosition, 15, 0, 2 * Math.PI);
        ctx.stroke();
      });
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }
}
