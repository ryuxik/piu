import { KeyBindings } from './Controller';

export class PlayerOneKeyBindings implements KeyBindings {
    public readonly left      = 37;  // left arrow
    public readonly right     = 39;  // right arrow
    public readonly jump      = 38;  // up arrow
    public readonly charge    = 40;  // down arrow
    public readonly block     = 16;  // right shift
    public readonly attack    = 188; // comma
    public readonly altAttack = 190; // period
}

export class PlayerTwoKeyBindings implements KeyBindings {
    public readonly left      = 65; // a
    public readonly right     = 68; // d
    public readonly jump      = 87; // w
    public readonly charge    = 83; // s
    public readonly block     = 88; // x
    public readonly attack    = 81; // q
    public readonly altAttack = 69; // e
}