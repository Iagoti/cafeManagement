import { Injectable } from "@angular/core";

export interface Menu {
  state: string;
  name: string;
  icon: string;
  role: string;
}

const MENUITENS = [
  { state: 'dashboard', name: 'Dashboard', icon: 'dashboard', role: '' }
];

@Injectable()
export class MenuItens {
  getMenuitem(): Menu[] {
    return MENUITENS;
  }
}
