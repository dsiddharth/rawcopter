import { Methods, Context } from "./.hathora/methods";
import { Response } from "../api/base";
import {
  User,
  GameStatus,
  GameState,
  UserId,
  IInitializeRequest,
  IJoinGameRequest,
  IThrustRequest,
} from "../api/types";

type InternalUser = User & { yVelocity: number, acceleration: number }
type InternalState = {
  users: InternalUser[];
  status: GameStatus;
  xPosition: number
};

const X_VELOCITY = 100;
const PLAYERS_TO_START = 1;

export class Impl implements Methods<InternalState> {
  initialize(ctx: Context, request: IInitializeRequest): InternalState {
    return {
      users: [],
      status: 0,
      xPosition: 20
    };
  }
  joinGame(state: InternalState, userId: UserId, ctx: Context, request: IJoinGameRequest): Response {
    state.users.push({
      yPosition: 50,
      yVelocity: 50,
      score: 0,
      userId,
      acceleration: 10
    });

    if (state.users.length === PLAYERS_TO_START) {
      state.status = GameStatus.PLAYING;
    }
    return Response.ok();
  }
  thrust(state: InternalState, userId: UserId, ctx: Context, request: IThrustRequest): Response {
    const user = state.users.find((user) => user.userId === userId);
    if (!user) {
      return Response.error("User not found");
    }
    // user.acceleration -= 10;
    user.yVelocity = -150;
    return Response.ok();
  }
  getUserState(state: InternalState, userId: UserId): GameState {
    return state;
  }
  onTick(state: InternalState, ctx: Context, timeDelta: number): void {
    if (state.status === GameStatus.PLAYING) {
      state.xPosition += timeDelta * X_VELOCITY;
      state.users.forEach((user) => {
        console.log(user.yVelocity, user.acceleration)
        user.yPosition = user.yPosition + user.yVelocity * timeDelta;
        user.yVelocity = Math.min(user.yVelocity + user.acceleration * timeDelta, 150);
        user.acceleration = Math.min(user.acceleration + 400 * timeDelta, 150);
      })
    }
  }
}
