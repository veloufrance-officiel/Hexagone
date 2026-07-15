import { District } from "./District";

export class WorldRegistry {
  private districts: Map<string, District> = new Map();

  public registerDistrict(district: District): void {
    this.districts.set(district.id, district);
  }

  public removeDistrict(id: string): void {
    this.districts.delete(id);
  }

  public getDistrict(id: string): District | undefined {
    return this.districts.get(id);
  }

  public getAllDistricts(): District[] {
    return Array.from(this.districts.values());
  }

  public getDistrictAtPosition(
    x: number,
    z: number
  ): District | undefined {
    for (const district of this.districts.values()) {
      if (district.isInside(x, z)) {
        return district;
      }
    }

    return undefined;
  }

  public clear(): void {
    this.districts.clear();
  }
}
