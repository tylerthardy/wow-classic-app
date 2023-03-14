import { IGearPlannerData } from './gear-planner-data.interface';

class WH {
  public static maxLevel: number = 80;
  public static cOr(obj: any, baseState: any): any {
    return Object.assign(obj, baseState);
  }
}

class c {
  public static getIdFromSlug(arg: any): number {
    return 1;
  }
}

class o {
  public static getBySlug(arg: any): string {
    return '1';
  }
  public static canBeRace(arg: any, arg1: any): boolean {
    return true;
  }
}

const s = 128;
const n = 64;

class l {
  public static baseState: IGearPlannerData = {
    buffs: [],
    level: 80,
    phase: 6,
    shapeshiftForm: 0,
    slots: {},
    talentHash: '',
    version: 1
  };
}

export class WowheadParseFunction {
  public static parse(e: string): IGearPlannerData {
    let t = WH.cOr({}, l.baseState);
    let a = /^([a-z-]+)\/([a-z-]+)(?:\/([a-zA-Z0-9_-]+))?$/.exec(e);
    if (!a) {
      return t;
    }
    {
      let e = o.getBySlug(a[1]);
      if (e) {
        t.classId = parseInt(e);
      }
      if (!t.classId) {
        return t;
      }
    }
    {
      let e = c.getIdFromSlug(a[2]);
      if (e && o.canBeRace(t.classId, e)) {
        t.raceId = e;
      }
      if (!t.raceId) {
        t.classId = undefined;
        return t;
      }
    }
    t.level = WH.maxLevel;
    if (a[3]) {
      let e = a[3].replace(/-/g, '+').replace(/_/g, '/');
      let l = atob(e);
      let i: any[] = [];
      for (let e = 0; e < l.length; e++) {
        i.push(l.charCodeAt(e));
      }
      let r = i.shift();
      if (r <= 6) {
        if (r > 4) {
          t.genderId = i.shift();
        }
        if (r > 0) {
          t.level = i.shift();
        }
        t.talentHash = '';
        if (r > 1) {
          let e = i.shift();
          let a: any[] = i.splice(0, e);
          let s: any[] = [];
          for (let e = 0; e < a.length; e++) {
            s.push(a[e] >> 4, a[e] & 15);
          }
          let n = 0;
          for (let e = 0; e < s.length && n < 3; e++) {
            if (s[e] === 15) {
              t.talentHash += '-';
              n++;
            } else {
              t.talentHash += '' + s[e];
            }
          }
          t.talentHash = t.talentHash.replace(/-+$/, '');
          if (r >= 4) {
            let e = i.shift();
            if (e > 0) {
              t.talentHash += '_';
              while (e-- > 0) {
                t.talentHash += String.fromCharCode(i.shift());
              }
            }
          }
        }
        while (i.length >= 3) {
          let e = i.shift();
          let a = 0;
          let l = 0;
          if (r >= 3) {
            let e = i.shift();
            a = (e & 224) >> 5;
            l |= (e & 31) << 16;
          }
          l |= i.shift() << 8;
          l |= i.shift();
          let o = (e & s) > 0;
          let c = (e & n) > 0;
          e = e & ~s & ~n;
          t.slots[e] = {
            item: l
          };
          if (o) {
            let a = 0;
            if (r >= 6) {
              a |= i.shift() << 16;
            }
            a |= i.shift() << 8;
            a |= i.shift();
            t.slots[e].enchant = a;
          }
          if (c) {
            let a = i.shift() << 8;
            a |= i.shift();
            if ((a & 32768) > 0) {
              a -= 65536;
            }
            t.slots[e].randomEnchant = a;
          }
          while (a--) {
            let a = 0;
            let s = i.shift();
            let n = (s & 224) >> 5;
            a |= (s & 31) << 16;
            a |= i.shift() << 8;
            a |= i.shift();
            t.slots[e].gems = t.slots[e].gems || {};
            t.slots[e].gems[n] = a;
          }
        }
      }
    }
    return t;
  }
}
