
export interface DistrictBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export type DistrictState = "loaded" | "unloaded";

export class District {
  public readonly id: string;
  public readonly name: string;
  public readonly bounds: DistrictBounds;

  private state: DistrictState = "unloaded";

  constructor(
    id: string,
    name: string,
    bounds: DistrictBounds
  ) {
    this.id = id;
    this.name = name;
    this.bounds = bounds;
  }

  public isInside(x: number, z: number): boolean {
    return (
      x >= this.bounds.minX &&
      x <= this.bounds.maxX &&
      z >= this.bounds.minZ &&
      z <= this.bounds.maxZ
    );
  }

  public load(): void {
    this.state = "loaded";
  }

  public unload(): void {
    this.state = "unloaded";
  }

  public getState(): DistrictState {
    return this.state;
  }
}
