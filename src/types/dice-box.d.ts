declare module "@3d-dice/dice-box" {
  export interface DiceBoxConfig {
    id?: string;
    assetPath?: string;
    theme?: string;
    themeColor?: string;
    scale?: number;
    gravity?: number;
    mass?: number;
    friction?: number;
    restitution?: number;
    angularDamping?: number;
    linearDamping?: number;
    spinForce?: number;
    throwForce?: number;
    startingHeight?: number;
    offscreen?: boolean;
    delay?: number;
    enableShadows?: boolean;
    shadowTransparency?: number;
    lightIntensity?: number;
  }

  export interface DiceRoll {
    value: number;
    groupValue?: number;
    sides: number;
  }

  export interface RollResult {
    rolls: DiceRoll[];
    value: number;
  }

  export default class DiceBox {
    constructor(config?: DiceBoxConfig);
    init(): Promise<any>;
    roll(notation: string | string[]): Promise<any>;
    add(notation: string, groupId?: string): Promise<any>;
    show(): Promise<void>;
    hide(): Promise<void>;
    clear(): Promise<void>;
    resize(): void;
    updateConfig(updates: Partial<DiceBoxConfig>): void;
    onRollComplete?: (results: RollResult[]) => void;
    onThemeConfigLoaded?: (themeData: any) => void;
    getRollResults(): RollResult[];
  }
}
